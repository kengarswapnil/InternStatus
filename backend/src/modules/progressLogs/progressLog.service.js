import mongoose from "mongoose";
import Application from "../../models/Application.js";
import Task from "../../models/Task.js";
import TaskSubmission from "../../models/TaskSubmission.js";

export const getInternshipProgressService = async (user, applicationId) => {

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application id");
  }

  const application = await Application
    .findById(applicationId)
    .populate("student", "fullName")
    .populate("mentor", "designation")
    .populate("internship", "title startDate durationMonths")
    .populate("company", "name")
    .lean();

  if (!application) {
    throw new Error("Application not found");
  }

  /*
  Access Control
  */

  const ref = user.referenceId?.toString();

  const allowed =
    application.student?._id?.toString() === ref ||
    application.mentor?._id?.toString() === ref ||
    application.faculty?.toString() === ref ||
    (user.role === "company" &&
      application.company?._id?.toString() === ref) ||
    user.role === "admin";

  if (!allowed) {
    throw new Error("Unauthorized access");
  }

  /*
  TASK PROGRESS
  */

  const tasks = await Task
    .find({ application: applicationId })
    .sort({ assignedAt: 1 })
    .lean();

  const submissions = await TaskSubmission
    .find({ application: applicationId })
    .sort({ attempt: -1 })
    .lean();

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;

  const taskProgress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  /*
  DURATION PROGRESS
  */

  let durationProgress = 0;

  if (application.internship?.startDate && application.internship?.durationMonths) {

    const start = new Date(application.internship.startDate);

    const end = new Date(start);
    end.setMonth(end.getMonth() + application.internship.durationMonths);

    const now = new Date();

    const totalDuration = end - start;
    const elapsed = now - start;

    durationProgress = Math.max(
      0,
      Math.min(100, Math.round((elapsed / totalDuration) * 100))
    );

  }

  /*
  TASK LIST (ROLE FILTERING)
  */

  let tasksView = [];

  tasksView = tasks.map((task, index) => {

    const latestSubmission = submissions.find(
      (s) => s.task.toString() === task._id.toString()
    );

    let title = task.title;

    /*
    Hide company project titles from faculty/college
    */

    if (user.role === "faculty") {
      title = `Task ${index + 1}`;
    }

    return {
      taskId: task._id,
      title,
      status: task.status,
      mentorFeedback: latestSubmission?.mentorFeedback || null
    };

  });

  return {

    student: application.student?.fullName,
    internship: application.internship?.title,
    company: application.company?.name,
    mentor: application.mentor?.designation,

    progress: {
      taskProgress,
      durationProgress,
      totalTasks,
      completedTasks
    },

    tasks: tasksView

  };

};