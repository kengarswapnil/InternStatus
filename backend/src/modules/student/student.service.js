import mongoose from "mongoose";
import Application from "../../models/Application.js";
import Task from "../../models/Task.js";
import StudentProfile from "../../models/StudentProfile.js";

export const getStudentInternshipTrackService = async (user, applicationId) => {

  if (user.role !== "student") {
    throw new Error("Only students allowed");
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application id");
  }

  const application = await Application.findOne({
    _id: applicationId,
    student: user.referenceId
  })
    .populate("company", "name")
    .populate("mentor", "fullName")
    .populate("internship", "title mode")
    .lean();

  if (!application) {
    throw new Error("Application not found");
  }

  const tasks = await Task.find({
    application: applicationId
  })
    .sort({ createdAt: -1 })
    .lean();

  // ✅ FIX: include certificateUrl
  return {
    internship: application.internship,
    company: application.company,
    mentor: application.mentor,
    status: application.status,
    certificateUrl: application.certificateUrl,   // 🔥 THIS LINE FIXES YOUR ISSUE
    tasks
  };
};

/*
GET STUDENT DETAILS
*/
export const getStudentDetailsService = async (studentId) => {

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const student = await StudentProfile
    .findById(studentId)
    .populate("user", "email")
    .lean();

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};


export const getStudentInternshipStatsService = async (studentId) => {

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const objectId = new mongoose.Types.ObjectId(studentId);

  const stats = await Application.aggregate([

    {
      $match: {
        student: objectId
      }
    },

    {
      $facet: {

        // ✅ TOTAL APPLICATIONS
        totalApplied: [
          { $count: "count" }
        ],

        // ✅ STATUS COUNTS
        statusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]

      }
    }

  ]);

  const result = {
    totalApplied: 0,
    applied: 0,              // 🔥 ADD THIS
    shortlisted: 0,
    selected: 0,
    offer_accepted: 0,
    ongoing: 0,
    completed: 0,
    rejected: 0
  };

  // ✅ TOTAL
  result.totalApplied = stats[0].totalApplied[0]?.count || 0;

  // ✅ STATUS
  stats[0].statusCounts.forEach(s => {
    result[s._id] = s.count;
  });

  return result;
};

/*
GET STUDENT INTERNSHIPS
*/
export const getStudentInternshipsService = async (studentId) => {

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const internships = await Application
    .find({ student: studentId })
    .populate("internship", "title startDate durationMonths")
    .populate("company", "name")
    .populate("mentor", "designation")
    .populate("report") 
    .sort({ createdAt: -1 })
    .lean();

  return internships;
};