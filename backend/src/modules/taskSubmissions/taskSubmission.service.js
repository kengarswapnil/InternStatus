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
STUDENT SUBMIT TASK
*/
export const submitTaskService = async (user, data, uploadedFiles = []) => {

  if (user.role !== "student") {
    throw new Error("Only students can submit tasks");
  }

  const { taskId, description = "", githubLink } = data;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  if (!description.trim()) {
    throw new Error("Submission description required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (["completed", "cancelled"].includes(task.status)) {
    throw new Error("This task is no longer accepting submissions");
  }

  const application = await Application.findById(task.application);

  if (!application) {
    throw new Error("Application not found");
  }

  /* Internship locked */
  if (application.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (application.student.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized student");
  }


  /*
  Determine submission attempt
  */

  const lastSubmission = await TaskSubmission
    .findOne({
      task: taskId,
      student: user.referenceId
    })
    .sort({ attempt: -1 });

  let attempt = 1;

  if (lastSubmission) {

    if (lastSubmission.status !== "revision_requested") {
      throw new Error("Task already submitted");
    }

    attempt = lastSubmission.attempt + 1;

  }


  /*
  Validate uploaded files
  */

  if (uploadedFiles.length > MAX_FILES) {
    throw new Error(`Maximum ${MAX_FILES} files allowed`);
  }


  /*
  Upload files to Cloudinary
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
    description: description.trim(),
    githubLink,
    files: uploadedResults,
    status: "submitted"
  });


  /*
  Update task status
  */

  task.status = "submitted";
  await task.save();

  return submission;

};



/*
GET SUBMISSIONS FOR TASK
*/
export const getTaskSubmissionsService = async (user, taskId) => {

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const application = await Application.findById(task.application);

  if (!application) {
    throw new Error("Application not found");
  }

  const ref = user.referenceId?.toString();

  const allowed =
    application.student?.toString() === ref ||
    application.mentor?.toString() === ref ||
    application.faculty?.toString() === ref ||
    (user.role === "company" &&
      application.company?.toString() === ref);

  if (!allowed) {
    throw new Error("Unauthorized access");
  }

  const submissions = await TaskSubmission
    .find({ task: taskId })
    .sort({ attempt: -1 })
    .lean();

  return submissions;

};


export const reviewSubmissionService = async (user, submissionId, data) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors can review submissions");
  }

  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new Error("Invalid submission id");
  }

  const submission = await TaskSubmission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  const task = await Task.findById(submission.task);

  if (!task) {
    throw new Error("Task not found");
  }

  const application = await Application.findById(task.application);

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (task.mentor.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized mentor");
  }

  const { status, mentorFeedback, score } = data;

  if (!["approved", "revision_requested"].includes(status)) {
    throw new Error("Invalid review status");
  }

  if (score !== undefined && (score < 0 || score > 10)) {
    throw new Error("Score must be between 0 and 10");
  }

  submission.status = status;
  submission.mentorFeedback = mentorFeedback || "";
  submission.score = score ?? null;
  submission.reviewedAt = new Date();

  await submission.save();

  /*
  UPDATE TASK STATUS
  */

  if (status === "approved") {
    task.status = "completed";
  }

  if (status === "revision_requested") {
    task.status = "revision_requested";
  }

  await task.save();


  /*
  AUTO CREATE PROGRESS LOG WHEN TASK APPROVED
  */

  if (status === "approved") {

    const logDate = new Date();

    await ProgressLog.updateOne(
      {
        application: task.application,
        logDate
      },
      {
        $setOnInsert: {
          application: task.application,
          student: application.student,
          mentor: user.referenceId,
          logDate,
          summary: `Completed task: ${task.title}`,
          technologiesUsed: [],
          evidenceLinks: [],
          attachments: [],
          status: "approved",
          reviewedAt: new Date()
        }
      },
      { upsert: true }
    );

  }

  return submission;

};