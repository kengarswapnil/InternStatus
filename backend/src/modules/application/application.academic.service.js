import mongoose from "mongoose";
import Application from "../../models/Application.js";
import Task from "../../models/Task.js";
import ProgressLog from "../../models/ProgressLog.js";

export const getAcademicInternshipTrackService = async (applicationId) => {

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application id");
  }

  const application = await Application.findById(applicationId)
    .populate("student", "fullName")
    .populate("company", "name")
    .populate("mentor", "fullName")
    .populate("internship", "title")
    .lean();

  if (!application) {
    throw new Error("Application not found");
  }

  const tasks = await Task.find({ application: applicationId })
    .select("status createdAt")
    .sort({ createdAt: 1 })
    .lean();

  const logs = await ProgressLog.find({
    application: applicationId
  })
    .select("logDate status")
    .sort({ logDate: -1 })
    .lean();

  const anonymizedTasks = tasks.map((t, index) => ({
    label: `Task ${index + 1}`,
    status: t.status,
    createdAt: t.createdAt
  }));

  return {
    student: application.student,
    company: application.company,
    mentor: application.mentor,
    internship: application.internship,
    status: application.status,
    tasks: anonymizedTasks,
    logs
  };
};