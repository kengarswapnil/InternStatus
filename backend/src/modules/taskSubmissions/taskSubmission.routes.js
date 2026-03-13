import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { upload } from "../../middleware/upload.js";

import {
  submitTaskController,
  getTaskSubmissionsController,
  reviewSubmissionController
} from "./taskSubmission.controller.js";

const router = express.Router();


/*
STUDENT SUBMITS TASK
*/
router.post(
  "/",
  authenticate,
  authorizeRoles("student"),
  upload.array("files", 5),   // supports single or multiple files
  submitTaskController
);


/*
GET SUBMISSIONS FOR A TASK
Allowed roles:
- mentor
- student
- faculty
*/
router.get(
  "/task/:taskId",
  authenticate,
  authorizeRoles("mentor", "student", "faculty"),
  getTaskSubmissionsController
);


/*
MENTOR REVIEW SUBMISSION
*/
router.patch(
  "/:submissionId/review",
  authenticate,
  authorizeRoles("mentor"),
  reviewSubmissionController
);

export default router;