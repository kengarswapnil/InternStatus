import {
  getMentorProfileService,
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