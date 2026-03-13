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

  return {
    internship: application.internship,
    company: application.company,
    mentor: application.mentor,
    status: application.status,
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



/*
GET STUDENT INTERNSHIP STATS
*/
export const getStudentInternshipStatsService = async (studentId) => {

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const stats = await Application.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId)
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    applied: 0,
    shortlisted: 0,
    selected: 0,
    offer_accepted: 0,
    ongoing: 0,
    completed: 0,
    rejected: 0
  };

  stats.forEach(s => {
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
    .sort({ createdAt: -1 })
    .lean();

  return internships;
};