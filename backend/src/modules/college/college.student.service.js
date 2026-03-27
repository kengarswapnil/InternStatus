import StudentProfile from "../../models/StudentProfile.js";
import StudentAcademicHistory from "../../models/StudentAcademicHistory.js";
import User from "../../models/User.js";
import mongoose from "mongoose";
import InternshipReport from "../../models/InternshipReport.js";
import College from "../../models/College.js";
import Application from "../../models/Application.js";
import sendEmail from "../../utils/sendEmail.js";
import Notification from "../../models/Notification.js";
import FacultyProfile from "../../models/FacultyProfile.js";

export const getCollegeStudentsService = async (user) => {

  const collegeId = user.referenceId;

  const students = await StudentProfile.find({
    college: collegeId,
    status: "active"
  })
    .select(`
      fullName
      prn
      abcId
      phoneNo
      courseName
      specialization
      courseStartYear
      courseEndYear
      Year
      status
    `)
    .populate("user", "email")
    .lean();

  return students;
};



export const updateCollegeStudentService = async (
  user,
  studentId,
  body
) => {

  const collegeId = user.referenceId;

  const student = await StudentProfile.findOne({
    _id: studentId,
    college: collegeId
  });

  if (!student) throw new Error("Student not found");

  const fields = [
    "courseName",
    "specialization",
    "courseStartYear",
    "courseEndYear",
    "Year",
    "status"
  ];

  fields.forEach((f) => {
    if (body[f] !== undefined) {
      student[f] = body[f];
    }
  });

  if (body.prn !== undefined) {
    student.prn = body.prn;
  }

  if (body.abcId !== undefined) {

    if (!/^\d{12}$/.test(body.abcId)) {
      throw new Error("ABC ID must be 12 digits");
    }

    student.abcId = body.abcId;
  }

  await student.save();

  return student;
};



export const removeStudentFromCollegeService = async (
  user,
  studentId
) => {

  const collegeId = user.referenceId;

  const student = await StudentProfile.findOne({
    _id: studentId,
    college: collegeId
  });

  if (!student) throw new Error("Student not found");

  await StudentAcademicHistory.updateOne(
    {
      student: studentId,
      status: "active"
    },
    {
      endDate: new Date(),
      status: "ended",
      endedBy: user._id
    }
  );

  student.college = null;
  student.status = "unassigned";

  await student.save();

  const userDoc = await User.findById(student.user);

  if (userDoc) {
    userDoc.password = null;
    userDoc.isRegistered = false;
    userDoc.isVerified = false;
    await userDoc.save();
  }

  return { success: true };
};


export const searchStudentService = async (query, user, options = {}) => {
  if (!query || !query.trim()) {
    throw new Error("Search query required");
  }

  const trimmedQuery = query.trim();

  // pagination defaults
  const limit = Math.min(Number(options.limit) || 10, 50); // max 50
  const page = Number(options.page) || 1;
  const skip = (page - 1) * limit;

  let filter = {};

  // 🔍 ABC ID exact match (fast path)
  if (/^\d{12}$/.test(trimmedQuery)) {
    filter.abcId = trimmedQuery;
  } else {
    // 🔍 Name search (case-insensitive, partial)
    filter.fullName = {
      $regex: trimmedQuery,
      $options: "i",
    };
  }

  // 🔒 COLLEGE RESTRICTION
  if (user.role === "college") {
    filter.college = user.referenceId;
  }

  // 🔍 QUERY EXECUTION
  const students = await StudentProfile.find(filter)
    .select("fullName abcId college")
    .sort({ fullName: 1 }) // alphabetical
    .skip(skip)
    .limit(limit)
    .lean();

  // count for pagination
  const total = await StudentProfile.countDocuments(filter);

  if (!students.length) {
    throw new Error("No students found");
  }

  return {
    results: students,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentReportsService = async (studentId, user) => {

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const student = await StudentProfile.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  // 🔒 COLLEGE VALIDATION
  if (
    user.role === "college" &&
   student.college?.toString() !== String(user.referenceId)
  ) {
    throw new Error("Unauthorized access to this student");
  }

  const reports = await InternshipReport.find({
    student: studentId
  })
    .populate({
      path: "application",
      populate: {
        path: "internship",
        select: "title"
      }
    })
    .select(`
      facultyScore
      creditsEarned
      completionRate
      status
    `);

  return reports;
};

/*
  ================= CREDIT CALCULATION =================
*/

export const assignCreditsService = async ({
  reportId,
  facultyScore,
  remarks,
  user
}) => {

  // ================= VALIDATION =================
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new Error("Invalid report id");
  }

  if (facultyScore < 0 || facultyScore > 10) {
    throw new Error("Score must be between 0 and 10");
  }

  const report = await InternshipReport.findById(reportId)
    .populate({
      path: "application",
      populate: {
        path: "student"
      }
    });

  if (!report) {
    throw new Error("Report not found");
  }

  if (!["faculty", "college"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const student = report.application?.student;

  if (!student) {
    throw new Error("Invalid report data (student missing)");
  }

  // ================= COLLEGE VALIDATION =================
  if (
    user.role === "college" &&
    (!student.college ||
      !student.college.equals(user.referenceId))
  ) {
    throw new Error("You can only assign credits to your college students");
  }

  // ================= FACULTY VALIDATION =================
  if (
    user.role === "faculty" &&
    report.mentor &&
    !report.mentor.equals(user.referenceId)
  ) {
    throw new Error("You are not assigned to this internship");
  }

  // ================= PREVENT DUPLICATE =================
  if (report.facultyStatus === "approved") {
    throw new Error("Credits already assigned");
  }

  // ================= 🔥 CORRECT CREDIT LOGIC =================

  // 1. Fetch student full profile
  const studentProfile = await StudentProfile.findById(student._id);

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  // 2. Fetch college to get course credits
  const college = await College.findById(studentProfile.college);

  if (!college) {
    throw new Error("College not found");
  }

  // 3. Find course inside college
  const course = college.courses.find(
    c => c._id.toString() === studentProfile.courseId?.toString()
  );

  if (!course) {
    throw new Error("Course not found for student");
  }

  // 🔥 FINAL CREDIT VALUE
  let credits = course.credits || 0;

  // Optional: completion rule
  if ((report.completionRate || 0) < 50) {
    credits = 0;
  }

  // ================= SAVE =================
  report.facultyScore = facultyScore;
  report.facultyRemarks = remarks;
  report.creditsEarned = credits;

  report.facultyStatus = "approved";
  report.status = "faculty_approved";
  report.approvedAt = new Date();

  await report.save();

  return {
    creditsEarned: credits
  };
};



// ---------------- GET ALL AT-RISK STUDENTS ----------------
export const getAtRiskStudentsService = async ({
  collegeId,
  search = "",
  page = 1,
  limit = 20
}) => {
  if (!mongoose.Types.ObjectId.isValid(collegeId)) {
    throw new Error("Invalid collegeId");
  }

  const skip = (page - 1) * limit;

  const matchStage = {
    college: new mongoose.Types.ObjectId(collegeId),
    status: "active"
  };

  if (search) {
    matchStage.fullName = { $regex: search, $options: "i" };
  }

  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "applications",
        let: { studentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$student", "$$studentId"] }
            }
          },
          { $limit: 1 } // ⚡ performance optimization
        ],
        as: "applications"
      }
    },

    {
      $match: {
        applications: { $size: 0 }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userData"
      }
    },

    { $unwind: "$userData" },

    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$fullName",
        email: "$userData.email",
        specialization: 1,
        courseName: 1,
        year: "$Year",
        reason: { $literal: "No internship applications" }
      }
    },

    { $sort: { name: 1 } },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }]
      }
    }
  ];

  const result = await StudentProfile.aggregate(pipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.total[0]?.count || 0;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// ---------------- GET SINGLE AT-RISK STUDENT ----------------
export const getAtRiskStudentByIdService = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid studentId");
  }

  const student = await StudentProfile.findById(studentId)
    .populate("user", "email")
    .lean();

  if (!student) return null;

  const exists = await Application.exists({
    student: student._id
  });

  if (exists) return null;

  return {
    id: student._id,
    name: student.fullName,
    email: student.user?.email,
    specialization: student.specialization,
    courseName: student.courseName,
    year: student.Year,
    reason: "No internship applications"
  };
};


// ---------------- NOTIFY STUDENT ----------------
export const notifyAtRiskStudentService = async ({
  studentId,
  message,
  user
}) => {
  // ✅ Validate input
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid studentId");
  }

  if (!user || !user._id) {
    throw new Error("Sender user missing");
  }

  if (!message || message.trim().length < 5) {
    throw new Error("Message too short");
  }

  // ✅ Fetch student + user email
  const student = await StudentProfile.findById(studentId)
    .populate("user", "email")
    .lean();

  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.user || !student.user._id) {
    throw new Error("Student user not linked properly");
  }

  if (!student.user.email) {
    throw new Error("Student email not found");
  }

  // ✅ SEND EMAIL FIRST
  await sendEmail({
    to: student.user.email,
    subject: "Internship Application Reminder",
    html: `
      <p>Hi ${student.fullName},</p>
      <p>${message}</p>
      <br/>
      <p><b>Please apply for internships as soon as possible.</b></p>
      <br/>
      <p>Regards,<br/>InternStatus</p>
    `
  });

  // ✅ STORE NOTIFICATION (NO CRASH NOW)
  await Notification.create({
    recipient: student.user._id,
    recipientModel: "StudentProfile",

    sender: user._id,
    senderRole: user.role,

    title: "Internship Reminder",
    message,

    type: "AT_RISK",
    referenceId: student._id,
    referenceModel: "StudentProfile",

    channels: ["email", "in_app"],
    status: "sent",
    sentAt: new Date()
  });

  return { success: true };
};
