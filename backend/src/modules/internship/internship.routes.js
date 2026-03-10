import express from "express";
import {
  browseInternships,
  getCompanyInternships,
  getInternshipDetails,
  postInternship,
  updateInternship,
  updateInternshipStatus
} from "./internship.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";

const router = express.Router();

/*
POST INTERNSHIP
*/
router.post(
  "/",
  authenticate,
  authorizeRoles("company"),
  postInternship
);

/*
BROWSE
*/
router.get(
  "/browse",
  authenticate,
  authorizeRoles("student"),
  browseInternships
);

/*
COMPANY INTERNSHIPS  ✅ MOVE ABOVE :id
*/
router.get(
  "/company",
  authenticate,
  authorizeRoles("company"),
  getCompanyInternships
);

/*
GET SINGLE INTERNSHIP
*/
router.get(
  "/:id",
  authenticate,
  getInternshipDetails
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("company"),
  updateInternshipStatus
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("company"),
  updateInternship
);
export default router;