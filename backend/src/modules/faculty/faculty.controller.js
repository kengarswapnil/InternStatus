import {
  getFacultyProfileService,
  updateFacultyProfileService
} from "./faculty.service.js";

export const getFacultyProfile = async (req, res, next) => {
  try {
    const profile = await getFacultyProfileService(req.user);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const updateFacultyProfile = async (req, res, next) => {
  try {
    const profile = await updateFacultyProfileService(
      req.user,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (err) {
    next(err);
  }
};
