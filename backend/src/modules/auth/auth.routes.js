import express from "express";
import {
  login,
  setPassword,
  logout,
  getMe,
  sendResetOTP,
  resetPassword
} from "./auth.controller.js";

import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/set-password", setPassword);
router.post("/logout", logout);
router.post("/forgot-password", sendResetOTP);
router.post("/reset-password", resetPassword);

router.get("/me", authenticate, getMe);

export default router;