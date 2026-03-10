import {
  createCollegeOnboardingService,
  getCollegeOnboardingsService,
  updateCollegeOnboardingStatusService,
  createCompanyOnboardingService,
  getCompanyOnboardingsService,
  updateCompanyOnboardingStatusService
} from "./onboarding.service.js";

export const createCollegeOnboarding = async (req, res) => {
  try {
    const data = await createCollegeOnboardingService({
      body: req.body,
      file: req.file
    });

    return res.status(201).json({
      message: "Onboarding request submitted",
      data
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

export const getCollegeOnboardings = async (req, res) => {
  try {
    const { status } = req.query;

    const data = await getCollegeOnboardingsService(status);

    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

export const updateCollegeOnboardingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const result = await updateCollegeOnboardingStatusService({
      onboardingId: id,
      status,
      rejectionReason,
      adminId: req.user._id
    });

    res.status(200).json({
      message: `Onboarding ${status} successfully`,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

/* ======================================
   CREATE COMPANY REQUEST
====================================== */

export const createCompanyOnboarding = async (req, res) => {
  try {
    const data = await createCompanyOnboardingService({
      body: req.body,
      file: req.file
    });

    res.status(201).json({
      message: "Company onboarding submitted",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ======================================
   ADMIN LIST
====================================== */

export const getCompanyOnboardings = async (req, res) => {
  try {
    const { status } = req.query;

    const data = await getCompanyOnboardingsService(status);

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ======================================
   APPROVE / REJECT
====================================== */

export const updateCompanyOnboardingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const data = await updateCompanyOnboardingStatusService({
      onboardingId: id,
      status,
      rejectionReason,
      adminId: req.user._id
    });

    res.json({
      message: `Company onboarding ${status}`,
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};