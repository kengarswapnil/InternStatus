import express from "express";

import { getStudentProfile, inviteStudent, updateStudentProfile } from "./student.controller.js";
import { inviteFaculty } from "./faculty.controller.js";
import { inviteMentor } from "./mentor.controller.js";
import { getSetupData, setupAccount } from "./faculty.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";
import { upload } from "../../middleware/upload.js";
import { getMyProfile, getUnreadCount, getUserNotifications, markAllNotificationsRead, markNotificationRead } from "./users.controller.js";

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  getMyProfile
);

/* ================= INVITE ================= */

router.post(
  "/student/invite",
  authenticate,
  authorizeRoles("college", "faculty"),
  inviteStudent
);

router.post(
  "/faculty/invite",
  authenticate,
  authorizeRoles("college"),
  inviteFaculty
);


router.post(
  "/mentor/invite",
  authenticate,
  authorizeRoles("company"),
  inviteMentor
);
/* ================= SETUP ================= */

router.get("/setup-data", getSetupData);

router.post(
  "/setup-account",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "collegeIdCard", maxCount: 1 }
  ]),
  setupAccount
);

router.get(
  "/student/profile",
  authenticate,
  authorizeRoles("student"),
  getStudentProfile
);

router.patch(
  "/student/profile",
  authenticate,
  authorizeRoles("student"),
  upload.single("resume"),   // ✅ REQUIRED FOR FILE
  updateStudentProfile
);

router.get("/notifications", authenticate, getUserNotifications);

router.get("/notifications/unread-count", authenticate, getUnreadCount);

router.patch("/notifications/:id/read", authenticate, markNotificationRead);

router.patch("/notifications/read-all", authenticate, markAllNotificationsRead);

export default router;