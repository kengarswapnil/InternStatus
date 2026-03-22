import express from "express";


import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { approveReport, download, generateReport, getReport, submitReport } from "./internshipReport.controller.js";

const router = express.Router();

// ─────────────────────────────────────────────
// GENERATE (ONLY STUDENT)
// ─────────────────────────────────────────────
router.post(
  "/generate/:applicationId",
  authenticate,
  authorizeRoles("student"),
  generateReport
);

// ─────────────────────────────────────────────
// SUBMIT (ONLY STUDENT)
// ─────────────────────────────────────────────
router.post(
  "/submit/:applicationId",
  authenticate,
  authorizeRoles("student"),
  submitReport
);

// ─────────────────────────────────────────────
// VIEW REPORT (ALL RELATED ROLES)
// ─────────────────────────────────────────────
router.get(
  "/:applicationId",
  authenticate,
  authorizeRoles("student", "mentor", "company", "faculty", "admin"),
  getReport
);

// ─────────────────────────────────────────────
// DOWNLOAD PDF (ALL RELATED ROLES)
// ─────────────────────────────────────────────
router.get(
  "/download/:applicationId",
  authenticate,
  authorizeRoles("student", "mentor", "company", "faculty", "admin"),
  download
);


router.post(
  "/approve/:applicationId",
  authenticate,
  authorizeRoles("faculty", "college"),
  approveReport
);


export default router;