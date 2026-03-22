import mongoose from "mongoose";
import TaskSubmission from "../../models/TaskSubmission.js";
import Task from "../../models/Task.js";
import Application from "../../models/Application.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import File from "../../models/File.js";
import ProgressLog from "../../models/ProgressLog.js";

const MAX_FILES = 5;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/zip"
];

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HELPER: CLEAN TECHNOLOGIES INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
const parseTechnologies = (rawTech) => {
  if (!rawTech) return [];

  try {
    const parsed = JSON.parse(rawTech);
    if (Array.isArray(parsed)) {
      return parsed.map(t => t.trim()).filter(Boolean);
    }
    return [String(parsed).trim()];
  } catch {
    return [String(rawTech).trim()];
  }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDENT SUBMIT TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const submitTaskService = async (user, data, uploadedFiles = []) => {
  if (user.role !== "student") {
    throw new Error("Only students can submit tasks");
  }

  const { taskId, workSummary = "", githubLink } = data;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  if (!workSummary.trim()) {
    throw new Error("Work summary is required");
  }

  const cleanedTech = parseTechnologies(data.technologiesUsed);

  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  if (["completed", "cancelled"].includes(task.status)) {
    throw new Error("Task is closed");
  }

  const application = await Application.findById(task.application);
  if (!application) throw new Error("Application not found");

  if (application.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (application.student.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized student");
  }

  /*
  Attempt logic
  */
  const lastSubmission = await TaskSubmission
    .findOne({ task: taskId, student: user.referenceId })
    .sort({ attempt: -1 });

  let attempt = 1;

  if (lastSubmission) {
    if (lastSubmission.status !== "revision_requested") {
      throw new Error("Task already submitted");
    }
    attempt = lastSubmission.attempt + 1;
  }

  /*
  File validation
  */
  if (uploadedFiles.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} files allowed`);
  }

  for (const file of uploadedFiles) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}`);
    }
  }

  /*
  Upload files
  */
  const uploadedResults = await Promise.all(
    uploadedFiles.map(async (file) => {
      const result = await uploadToCloudinary(
        file,
        "internstatus/task-submissions"
      );

      const fileDoc = await File.create({
        url: result.secure_url,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedBy: user._id
      });

      return fileDoc._id;
    })
  );

  /*
  Create submission
  */
  const submission = await TaskSubmission.create({
    task: taskId,
    application: task.application,
    student: user.referenceId,
    attempt,
    workSummary: workSummary.trim(),
    githubLink,
    files: uploadedResults,
    technologiesUsed: cleanedTech,
    status: "submitted"
  });

  task.status = "submitted";
  await task.save();

  return submission;
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MENTOR REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const reviewSubmissionService = async (user, submissionId, data) => {
  if (user.role !== "mentor") {
    throw new Error("Only mentors can review submissions");
  }

  const submission = await TaskSubmission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  const task = await Task.findById(submission.task);
  const application = await Application.findById(task.application);

  if (task.mentor.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized mentor");
  }

  const { status, mentorFeedback, score } = data;

  if (!["approved", "revision_requested"].includes(status)) {
    throw new Error("Invalid review status");
  }

  submission.status = status;
  submission.mentorFeedback = mentorFeedback || "";
  submission.score = score ?? null;
  submission.reviewedAt = new Date();

  await submission.save();

  task.status = status === "approved"
    ? "completed"
    : "revision_requested";

  await task.save();

  /*
  Progress Log (ONLY approved)
  */
  if (status === "approved") {
    await ProgressLog.updateOne(
      { task: task._id },
      {
        $set: {
          application: task.application,
          student: application.student,
          mentor: user.referenceId,
          task: task._id,
          logDate: new Date(),
          summary: submission.workSummary,
          technologiesUsed: submission.technologiesUsed || [],
          status: "approved",
          reviewedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  return submission;
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 CORE: FINAL APPROVED SUBMISSIONS
(single source of truth)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getFinalApprovedSubmissionsByApplication = async (applicationId) => {

  return await TaskSubmission.aggregate([
    {
      $match: {
        application: new mongoose.Types.ObjectId(applicationId),
        status: "approved"
      }
    },
    {
      $sort: { submittedAt: -1 }
    },
    {
      $group: {
        _id: "$task",
        submission: { $first: "$$ROOT" }
      }
    },
    {
      $replaceRoot: { newRoot: "$submission" }
    }
  ]);
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 CORE: REPORT INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getSubmissionInsightsForReport = async (applicationId) => {

  const submissions = await getFinalApprovedSubmissionsByApplication(applicationId);

  const totalTasks = await Task.countDocuments({
    application: applicationId
  });

  const tasksCompleted = submissions.length;

  const completionRate = totalTasks === 0
    ? 0
    : Math.round((tasksCompleted / totalTasks) * 100);

  /*
  Avg Score
  */
  const scores = submissions
    .map(s => s.score)
    .filter(s => typeof s === "number");

  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
    : 0;

  /*
  Tech aggregation
  */
  const techSet = new Set();

  submissions.forEach(sub => {
    (sub.technologiesUsed || []).forEach(t => {
      if (t) techSet.add(t.toLowerCase());
    });
  });

  /*
  Work summary aggregation
  */
  const combinedSummary = submissions
    .map(s => s.workSummary)
    .join("\n\n");

  return {
    totalTasks,
    tasksCompleted,
    completionRate,
    mentorScore: Number(avgScore),
    technologies: Array.from(techSet),
    finalSummary: combinedSummary,
    submissions
  };
};

export const getTaskSubmissionsService = async (
  user,
  taskId,
  options = {}
) => {
  const { latestOnly = false } = options;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const application = await Application.findById(task.application);
  if (!application) throw new Error("Application not found");

  const ref = user.referenceId?.toString();

  const isAllowed =
    application.student?.toString() === ref ||
    application.mentor?.toString() === ref ||
    application.faculty?.toString() === ref ||
    (user.role === "company" &&
      application.company?.toString() === ref);

  if (!isAllowed) {
    throw new Error("Unauthorized access");
  }

  /*
  🔥 MODE 1: FULL HISTORY (default)
  */
  if (!latestOnly) {
    const submissions = await TaskSubmission.find({ task: taskId })
      .populate("files")
      .sort({ attempt: -1, createdAt: -1 })
      .lean();

    return submissions;
  }

  /*
  🔥 MODE 2: ONLY LATEST PER STUDENT
  (important for faculty/company clean view)
  */
  const submissions = await TaskSubmission.aggregate([
    {
      $match: {
        task: new mongoose.Types.ObjectId(taskId)
      }
    },
    {
      $sort: { attempt: -1, submittedAt: -1 }
    },
    {
      $group: {
        _id: "$student",
        submission: { $first: "$$ROOT" }
      }
    },
    {
      $replaceRoot: { newRoot: "$submission" }
    },
    {
      $sort: { submittedAt: -1 }
    }
  ]);

  return submissions;
};