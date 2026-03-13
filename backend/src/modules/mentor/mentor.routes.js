import express from "express";
import {
  getMentorInternsController,
  getMentorProfile,
  updateMentorApplicationStatusController,
  updateMentorProfile
} from "./mentor.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  authorizeRoles("mentor"),
  getMentorProfile
);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles("mentor"),
  updateMentorProfile
);

router.get(
  "/interns",
  authenticate,
  authorizeRoles("mentor"),
  getMentorInternsController
);

router.patch(
  "/interns/:id/status",
  authenticate,
  authorizeRoles("mentor"),
  updateMentorApplicationStatusController
);

export default router;