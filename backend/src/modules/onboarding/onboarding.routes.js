import express from "express";
import {
  createCollegeOnboarding,
  getCollegeOnboardings,
  updateCollegeOnboardingStatus,
    createCompanyOnboarding,
    getCompanyOnboardings,
    updateCompanyOnboardingStatus
} from "./onboarding.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

/* ================= CREATE REQUEST ================= */

router.post(
  "/college",
  upload.single("verificationDocument"),
  createCollegeOnboarding
);

/* ================= ADMIN ================= */

router.get(
  "/college",
  authenticate,
  authorizeRoles("admin"),
  getCollegeOnboardings
);

router.patch(
  "/college/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateCollegeOnboardingStatus
);

/* ================= COMPANY ================= */

router.post(
  "/company",
  upload.single("verificationDocument"),
  createCompanyOnboarding
);

router.get(
  "/company",
  authenticate,
  authorizeRoles("admin"),
  getCompanyOnboardings
);

router.patch(
  "/company/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateCompanyOnboardingStatus
);

export default router;