import express from "express";
import {
  createTaskController,
  getApplicationTasksController,
  updateTaskController,
  cancelTaskController,
  getTaskDetailsController
} from "./task.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();


/*
CREATE TASK
Mentor can upload resource files
*/
router.post(
  "/",
  authenticate,
  authorizeRoles("mentor"),
  upload.array("resources", 5),
  createTaskController
);


/*
GET TASKS FOR INTERNSHIP
Accessible by student, mentor, faculty, company
*/
router.get(
  "/application/:applicationId",
  authenticate,
  getApplicationTasksController
);


/*
GET SINGLE TASK DETAILS
*/
router.get(
  "/:taskId",
  authenticate,
  getTaskDetailsController
);


/*
UPDATE TASK STATUS
*/
router.patch(
  "/:taskId",
  authenticate,
  authorizeRoles("mentor"),
  updateTaskController
);


/*
CANCEL TASK (replaces delete)
*/
router.patch(
  "/:taskId/cancel",
  authenticate,
  authorizeRoles("mentor"),
  cancelTaskController
);


export default router;