import express from "express";
import {
  assignMentor,
  getCompanyInterns,
  getCompanyMentors,
  getCompanyProfile,
  getInternProgressController,
  removeMentorFromCompany,
  updateCompanyMentor,
  updateCompanyProfile
} from "./company.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { upload } from "../../middleware/upload.js";

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  authorizeRoles("company"),
  getCompanyProfile
);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles("company"),
  upload.single("logo"),
  updateCompanyProfile
);

router.get(
  "/mentors",
  authenticate,
  authorizeRoles("company"),
  getCompanyMentors
);

router.patch(
  "/mentors/:mentorId",
  authenticate,
  authorizeRoles("company"),
  updateCompanyMentor
);

router.delete(
  "/mentors/:mentorId",
  authenticate,
  authorizeRoles("company"),
  removeMentorFromCompany
);

router.get(
  "/interns",
  authenticate,
  authorizeRoles("company"),
  getCompanyInterns
);

router.patch(
  "/:id/assign-mentor",
  authenticate,
  authorizeRoles("company"),
  assignMentor
);

router.get(
  "/interns/:id/progress",
  authenticate,
  authorizeRoles("company"),
  getInternProgressController
);

export default router;