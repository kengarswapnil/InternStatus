import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import {
  getFacultyProfile,
  updateFacultyProfile
} from "./faculty.controller.js";
import { getFacultyStudents, updateFacultyStudent } from "./faculty.student.controller.js";

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  authorizeRoles("faculty"),
  getFacultyProfile
);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles("faculty"),
  updateFacultyProfile
);

router.get(
  "/students",
  authenticate,
  authorizeRoles("faculty"),
  getFacultyStudents
);

router.patch(
  "/students/:studentId",
  authenticate,
  authorizeRoles("faculty"),
  updateFacultyStudent
);

export default router;
