import { applyInternshipService, getApplicationByIdService, getApplicationsForInternshipService, getMyApplicationsService, offerDecisionService, updateApplicationStatusService, withdrawApplicationService } from "./application.service.js";

export const applyInternship = async (req, res) => {
  try {
    const data = await applyInternshipService(
      req.user,
      req.params.id
    );

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const data = await getMyApplicationsService(req.user);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getApplicationsForInternship = async (req, res) => {
  try {
    const data = await getApplicationsForInternshipService(
      req.user,
      req.params.id
    );

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const data = await updateApplicationStatusService(
      req.user,
      req.params.id,
      status
    );

    res.json({
      success: true,
      message: "Status updated",
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const offerDecisionController = async (req, res) => {
  try {

    const { decision } = req.body; // "accept" | "decline"

    const application = await offerDecisionService(
      req.user,
      req.params.id,
      decision
    );

    return res.status(200).json({
      success: true,
      message:
        decision === "accept"
          ? "Offer accepted successfully"
          : "Offer declined successfully",
      data: application
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message
    });

  }
};

export const withdrawApplication = async (req, res) => {
  try {

    const data = await withdrawApplicationService(
      req.user,
      req.params.id
    );

    res.json({
      success: true,
      message: "Application withdrawn",
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};

export const getApplicationById = async (req, res) => {
  try {

    const data = await getApplicationByIdService(
      req.user,
      req.params.id
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};