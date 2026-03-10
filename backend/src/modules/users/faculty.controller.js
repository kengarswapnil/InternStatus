import {
  inviteFacultyService,
  getSetupDataService,
  setupAccountService
} from "./users.service.js";

/* ======================================
   INVITE FACULTY
====================================== */

export const inviteFaculty = async (req, res) => {
  try {
    const result = await inviteFacultyService(req.body, req.user);

    return res.status(201).json({
      message: "Faculty invited successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};


/* ======================================
   GET SETUP DATA (TOKEN BASED)
====================================== */

export const getSetupData = async (req, res) => {
  try {
    const { token } = req.query;

    const data = await getSetupDataService(token);

    return res.status(200).json(data);

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};


/* ======================================
   SETUP ACCOUNT (PASSWORD + PROFILE)
====================================== */

export const setupAccount = async (req, res) => {
  try {
    const result = await setupAccountService({
      body: req.body,
      files: req.files
    });

    return res.status(200).json({
      message: "Account setup completed",
      data: result
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};