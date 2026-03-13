import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";

import {
  getStudentDetails,
  getStudentInternships,
  getStudentInternshipStats,
  getStudentInternshipTrackController
} from "./student.controller.js";

const router = express.Router();

router.get(
  "/internship/:applicationId/track",
  authenticate,
  authorizeRoles("student"),
  getStudentInternshipTrackController
);

router.get("/:studentId", getStudentDetails);

router.get("/:studentId/stats", getStudentInternshipStats);

router.get("/:studentId/internships", getStudentInternships);

export default router;