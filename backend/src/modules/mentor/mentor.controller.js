import {
  getMentorInternsService,
  getMentorProfileService,
  updateMentorApplicationStatusService,
  updateMentorProfileService
} from "./mentor.service.js";

export const getMentorProfile = async (req, res, next) => {
  try {
    const profile = await getMentorProfileService(req.user);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

export const updateMentorProfile = async (req, res, next) => {
  try {
    const profile = await updateMentorProfileService(
      req.user,
      req.body
    );

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

export const getMentorInternsController = async (req, res) => {
  try {

    const user = req.user;
    console.log("REQ USER:", req.user);

    const interns = await getMentorInternsService(user);

    return res.status(200).json({
      success: true,
      message: "Mentor interns fetched successfully",
      data: interns
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch mentor interns"
    });

  }
};

export const updateMentorApplicationStatusController = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const application = await updateMentorApplicationStatusService(
      req.user,
      id,
      status
    );

    res.status(200).json({
      success: true,
      message: "Internship status updated",
      data: application
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update internship status"
    });

  }
};

