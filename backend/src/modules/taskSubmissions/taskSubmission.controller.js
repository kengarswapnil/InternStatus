import {
  submitTaskService,
  getTaskSubmissionsService,
  reviewSubmissionService
} from "./taskSubmission.service.js";

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDENT SUBMIT TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const submitTaskController = async (req, res) => {
  try {
    const submission = await submitTaskService(
      req.user,
      req.body,
      req.files || []
    );

    res.status(201).json({
      success: true,
      data: submission
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET SUBMISSIONS (WITH FILTER SUPPORT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getTaskSubmissionsController = async (req, res) => {
  try {
    const { latestOnly } = req.query;

    const submissions = await getTaskSubmissionsService(
      req.user,
      req.params.taskId,
      {
        latestOnly: latestOnly === "true"
      }
    );

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MENTOR REVIEW SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const reviewSubmissionController = async (req, res) => {
  try {
    const submission = await reviewSubmissionService(
      req.user,
      req.params.submissionId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: submission
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};