import {
  inviteStudentService,
  inviteFacultyService,
  getSetupDataService,
  setupAccountService
} from "./users.service.js";
import {
  getStudentProfileService,
  updateStudentProfileService
} from "./student.service.js";



export const inviteStudent = async (req, res) => {
  try {
    const data = await inviteStudentService(req.body, req.user);

    res.status(201).json({
      message: "Student invited successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const inviteFaculty = async (req, res) => {
  try {
    const data = await inviteFacultyService(req.body, req.user);

    res.status(201).json({
      message: "Faculty invited successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSetupData = async (req, res) => {
  try {
    const data = await getSetupDataService(req.query.token);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const setupAccount = async (req, res) => {
  try {
    const data = await setupAccountService({
      body: req.body,
      files: req.files
    });

    res.json({
      message: "Account setup completed",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// =============================
// GET PROFILE
// =============================
export const getStudentProfile = async (req, res, next) => {
  try {

    const profile = await getStudentProfileService(req.user._id);

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (err) {
    next(err);
  }
};



// =============================
// UPDATE PROFILE
// =============================
// =============================
// UPDATE PROFILE
// =============================
export const updateStudentProfile = async (req, res, next) => {
  try {

    const profile = await updateStudentProfileService(
      req.user._id,
      req.body,
      req.file   // ✅ IMPORTANT — resume file
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