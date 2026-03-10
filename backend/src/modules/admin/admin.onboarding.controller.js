import {
  getPendingOnboardingsService,
  getVerifiedOnboardingsService,
  getOnboardingDetailsService
} from "./admin.onboarding.service.js";


/* =====================================================
   GET PENDING
   GET /api/admin/onboarding/pending?type=college|company
===================================================== */

export const getPending = async (req, res) => {
  try {

    const { type } = req.query;

    const data = await getPendingOnboardingsService(type);

    res.status(200).json({
      success: true,
      message: "Pending onboarding fetched",
      data
    });

  } catch (err) {
    console.error("Get Pending Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
};



/* =====================================================
   GET VERIFIED
   GET /api/admin/onboarding/verified?type=college|company
===================================================== */

export const getVerified = async (req, res) => {
  try {

    const { type } = req.query;

    const data = await getVerifiedOnboardingsService(type);

    res.status(200).json({
      success: true,
      message: "Verified onboarding fetched",
      data
    });

  } catch (err) {
    console.error("Get Verified Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
};



/* =====================================================
   GET DETAILS
   GET /api/admin/onboarding/:type/:id
===================================================== */

export const getDetails = async (req, res) => {
  try {

    const { type, id } = req.params;

    const data = await getOnboardingDetailsService(type, id);

    if (!data)
      return res.status(404).json({
        success: false,
        message: "Onboarding not found"
      });

    res.status(200).json({
      success: true,
      message: "Onboarding details fetched",
      data
    });

  } catch (err) {
    console.error("Get Details Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
};