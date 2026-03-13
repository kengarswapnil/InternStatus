import mongoose from "mongoose";
import Task from "../../models/Task.js";
import Application from "../../models/Application.js";

const TASK_TYPES = ["internal", "external"];

const STATUS_TRANSITIONS = {
  assigned: ["submitted", "cancelled"],
  submitted: ["under_review"],
  under_review: ["completed", "revision_requested"],
  revision_requested: ["submitted"],
  completed: [],
  cancelled: []
};


/*
CREATE TASK
*/
export const createTaskService = async (user, data) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors can create tasks");
  }

  const {
    application,
    title,
    description = "",
    deadline,
    resourceFiles = [],
    taskType = "internal",
    externalLink
  } = data;

  if (!mongoose.Types.ObjectId.isValid(application)) {
    throw new Error("Invalid application id");
  }

  const app = await Application.findById(application);

  if (!app) {
    throw new Error("Application not found");
  }

  /* Internship locked */
  if (app.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (app.mentor?.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized mentor");
  }

  if (!title || title.trim().length < 3) {
    throw new Error("Task title must be at least 3 characters");
  }

  if (!TASK_TYPES.includes(taskType)) {
    throw new Error("Invalid task type");
  }

  let deadlineDate = null;

  if (deadline) {

    deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      throw new Error("Invalid deadline date");
    }

    if (deadlineDate <= new Date()) {
      throw new Error("Deadline must be in the future");
    }

  }

  if (!Array.isArray(resourceFiles)) {
    throw new Error("resourceFiles must be an array");
  }

  const task = await Task.create({
    application,
    mentor: user.referenceId,
    title: title.trim(),
    description: description.trim(),
    deadline: deadlineDate,
    resourceFiles,
    taskType,
    externalLink: externalLink?.trim(),
    status: "assigned",
    assignedAt: new Date()
  });

  return task;

};



/*
GET ALL TASKS FOR APPLICATION
*/
export const getApplicationTasksService = async (user, applicationId) => {

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application id");
  }

  const application = await Application.findById(applicationId).lean();

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

  const tasks = await Task.find({ application: applicationId })
    .populate("resourceFiles")
    .sort({ createdAt: -1 })
    .lean();

  return tasks;

};



/*
UPDATE TASK STATUS
*/
export const updateTaskService = async (user, taskId, data) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors can update tasks");
  }

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

  /* Internship locked */
  if (application.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (task.mentor.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized mentor");
  }

  if (["completed", "cancelled"].includes(task.status)) {
    throw new Error("Finalized tasks cannot be modified");
  }

  const newStatus = data.status;

  if (!newStatus) {
    throw new Error("Status is required");
  }

  const allowedTransitions = STATUS_TRANSITIONS[task.status] || [];

  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${task.status} → ${newStatus}`
    );
  }

  task.status = newStatus;

  await task.save();

  return task;

};



/*
CANCEL TASK
*/
export const cancelTaskService = async (user, taskId) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors can cancel tasks");
  }

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

  /* Internship locked */
  if (application.status === "completed") {
    throw new Error("Internship already completed");
  }

  if (task.mentor.toString() !== user.referenceId.toString()) {
    throw new Error("Unauthorized mentor");
  }

  if (task.status !== "assigned") {
    throw new Error("Only unstarted tasks can be cancelled");
  }

  task.status = "cancelled";

  await task.save();

  return task;

};



/*
GET TASK DETAILS
*/
export const getTaskDetailsService = async (user, taskId) => {

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  const task = await Task.findById(taskId)
    .populate("mentor", "fullName email")
    .populate("resourceFiles")
    .lean();

  if (!task) {
    throw new Error("Task not found");
  }

  const application = await Application.findById(task.application).lean();

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

  return task;

};