import express from "express";
import {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  resendInvite,
  updateUserProfile,
} from "./admin.users.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { authorizeRoles } from "../../../middleware/role.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorizeRoles("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserDetails);
router.patch("/:id/status", updateUserStatus);
router.post("/:id/resend-invite", resendInvite);
router.patch("/:id/profile", updateUserProfile);

export default router;