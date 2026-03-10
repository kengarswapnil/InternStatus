import express from "express";
import {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCollegeProfile,
  updateCollegeProfile,
  getCollegeList,
  getCollegeFaculty,
  updateCollegeFaculty,
  removeFacultyFromCollege
} from "./college.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { getCollegeStudents, removeStudentFromCollege, updateCollegeStudent } from "./college.student.controller.js";

const router = express.Router();

// public list endpoint (used by registration form)
router.get("/list", getCollegeList);

// all other college routes require authenticated college users

router.get("/courses", authenticate, authorizeRoles("college"), getCourses);
router.post("/courses", authenticate, authorizeRoles("college"), addCourse);
router.patch("/courses/:courseName", authenticate, authorizeRoles("college"), updateCourse);
router.delete("/courses/:courseName", authenticate, authorizeRoles("college"), deleteCourse);

// ================= COLLEGE SELF =================

router.get(
  "/profile",
  authenticate,
  authorizeRoles("college", "admin"),
  getCollegeProfile
);

router.patch(
  "/profile",
  authenticate,
  authorizeRoles("college", "admin"),
  updateCollegeProfile
);


router.get(
  "/faculty",
  authenticate,
  authorizeRoles("college"),
  getCollegeFaculty
);

router.patch(
  "/faculty/:facultyId",
  authenticate,
  authorizeRoles("college"),
  updateCollegeFaculty
);

router.delete(
  "/faculty/:facultyId",
  authenticate,
  authorizeRoles("college"),
  removeFacultyFromCollege
);

router.get(
  "/students",
  authenticate,
  authorizeRoles("college"),
  getCollegeStudents
);

router.patch(
  "/students/:studentId",
  authenticate,
  authorizeRoles("college"),
  updateCollegeStudent
);

router.delete(
  "/students/:studentId",
  authenticate,
  authorizeRoles("college"),
  removeStudentFromCollege
);

// ================= ADMIN ACCESS ANY =================

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  getCollegeProfile
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  updateCollegeProfile
);

export default router;