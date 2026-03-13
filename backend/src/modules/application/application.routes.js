import express from "express";
import {
  applyInternship,
  getApplicationsForInternship,
  getMyApplications,
  offerDecisionController,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,   
} from "./application.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { getAcademicInternshipTrackController } from "./application.academic.controller.js";

const router = express.Router();

router.post(
  "/apply/:id",
  authenticate,
  authorizeRoles("student"),
  applyInternship
);

router.get(
  "/my",
  authenticate,
  authorizeRoles("student"),
  getMyApplications
);

router.get(
  "/internship/:id",
  authenticate,
  authorizeRoles("company"),
  getApplicationsForInternship
);

/*
  NEW ROUTE
*/
router.get(
  "/:id",
  authenticate,
  getApplicationById
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("company"),
  updateApplicationStatus
);

router.patch(
  "/:id/offer",
  authenticate,
  authorizeRoles("student"),
  offerDecisionController
);

router.patch(
  "/:id/withdraw",
  authenticate,
  authorizeRoles("student"),
  withdrawApplication
);

router.get(
  "/:applicationId/academic-track",
  authenticate,
  authorizeRoles("faculty","college"),
  getAcademicInternshipTrackController
);

export default router;