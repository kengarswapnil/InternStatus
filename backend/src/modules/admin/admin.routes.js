// routes/admin.routes.js
import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { getAdminDashboard } from "./admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("admin"),
  getAdminDashboard
);

export default router;