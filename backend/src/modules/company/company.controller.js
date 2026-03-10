import {
  getCompanyProfileService,
  updateCompanyProfileService,
    getCompanyMentorsService,
  updateCompanyMentorService,
  removeMentorFromCompanyService,
  getCompanyInternsService,
  assignMentorService
} from "./company.service.js";

export const getCompanyProfile = async (req, res, next) => {
  try {
    const profile = await getCompanyProfileService(req.user);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    const profile = await updateCompanyProfileService(
      req.user,
      req.body,
      req.file
    );

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};


export const getCompanyMentors = async (req, res, next) => {
  try {

    const data = await getCompanyMentorsService(req.user);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

export const updateCompanyMentor = async (req, res, next) => {
  try {

    const data = await updateCompanyMentorService(
      req.user,
      req.params.mentorId,
      req.body
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

export const removeMentorFromCompany = async (req, res, next) => {
  try {

    const data = await removeMentorFromCompanyService(
      req.user,
      req.params.mentorId
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

export const getCompanyInterns = async (req, res) => {
  try {

    const data = await getCompanyInternsService(req.user);

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

export const assignMentor = async (req, res) => {
  try {

    const data = await assignMentorService(
      req.user,
      req.params.id,
      req.body.mentorId
    );

    res.json({
      success: true,
      message: "Mentor assigned",
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};