import express from "express";
import {
  getMentorProfile,
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

export default router;