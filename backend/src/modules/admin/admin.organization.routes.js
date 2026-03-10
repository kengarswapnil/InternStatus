
import express from "express";
import * as controller from "./admin.organization.controller.js";

import { authenticate } from "../../middleware/auth.js";
import { authorizeRoles } from "../../middleware/role.js";

const router = express.Router();


/* =====================================================
   COLLEGES
===================================================== */

router.get(
  "/colleges",
  authenticate,
  authorizeRoles("admin"),
  controller.getColleges
);

router.get(
  "/colleges/:id",
  authenticate,
  authorizeRoles("admin"),
  controller.getCollegeById
);

router.post(
  "/colleges",
  authenticate,
  authorizeRoles("admin"),
  controller.createCollege
);

router.put(
  "/colleges/:id",
  authenticate,
  authorizeRoles("admin"),
  controller.updateCollege
);

router.patch(
  "/colleges/:id/status",
  authenticate,
  authorizeRoles("admin"),
  controller.updateCollegeStatus
);



/* =====================================================
   COMPANIES
===================================================== */

router.get(
  "/companies",
  authenticate,
  authorizeRoles("admin"),
  controller.getCompanies
);

router.get(
  "/companies/:id",
  authenticate,
  authorizeRoles("admin"),
  controller.getCompanyById
);

router.post(
  "/companies",
  authenticate,
  authorizeRoles("admin"),
  controller.createCompany
);

router.put(
  "/companies/:id",
  authenticate,
  authorizeRoles("admin"),
  controller.updateCompany
);

router.patch(
  "/companies/:id/status",
  authenticate,
  authorizeRoles("admin"),
  controller.updateCompanyStatus
);


export default router;