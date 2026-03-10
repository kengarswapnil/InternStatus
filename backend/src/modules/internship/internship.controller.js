import { browseInternshipsService, getCompanyInternshipsService, getInternshipDetailsService, postInternshipService, updateInternshipService, updateInternshipStatusService } from "./internship.service.js";

/*
POST INTERNSHIP CONTROLLER
*/
export const postInternship = async (req, res) => {
  try {
    const internship = await postInternshipService(
      req.user,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Internship posted successfully",
      data: internship
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const browseInternships = async (req, res) => {
  try {
    const data = await browseInternshipsService(req.user);

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

export const getInternshipDetails = async (req, res) => {
  try {
    const data = await getInternshipDetailsService(
      req.user,
      req.params.id
    );

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

export const getCompanyInternships = async (req, res) => {
  try {
    const data = await getCompanyInternshipsService(req.user);

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

export const updateInternshipStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const data = await updateInternshipStatusService(
      req.user,
      req.params.id,
      status
    );

    return res.json({
      success: true,
      message: `Internship ${status} successfully`,
      data
    });

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message
    });

  }
};

export const updateInternship = async (req, res) => {
  try {

    const data = await updateInternshipService(
      req.user,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Internship updated successfully",
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};