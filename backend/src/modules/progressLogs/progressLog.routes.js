import express from "express";
import { getInternshipProgress } from "./progressLog.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get(
  "/:applicationId",
  authenticate,
  getInternshipProgress
);

export default router;