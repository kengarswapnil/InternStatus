import * as service from "./admin.organization.service.js";


/* =====================================================
   COLLEGES
===================================================== */

export const getColleges = async (req, res) => {
  try {

    const data = await service.getCollegesService();

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Get Colleges Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const getCollegeById = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.getCollegeByIdService(id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Get College Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const createCollege = async (req, res) => {
  try {

    const adminId = req.user._id;

    const data = await service.createCollegeService(
      req.body,
      adminId
    );

    res.status(201).json({
      success: true,
      message: "College created",
      data
    });

  } catch (err) {
    console.error("Create College Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const updateCollege = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.updateCollegeService(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "College updated",
      data
    });

  } catch (err) {
    console.error("Update College Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const updateCollegeStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const data = await service.updateCollegeStatusService(
      id,
      status
    );

    res.status(200).json({
      success: true,
      message: "College status updated",
      data
    });

  } catch (err) {
    console.error("Update College Status Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};




/* =====================================================
   COMPANIES
===================================================== */

export const getCompanies = async (req, res) => {
  try {

    const data = await service.getCompaniesService();

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Get Companies Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const getCompanyById = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.getCompanyByIdService(id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Get Company Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const createCompany = async (req, res) => {
  try {

    const adminId = req.user._id;

    const data = await service.createCompanyService(
      req.body,
      adminId
    );

    res.status(201).json({
      success: true,
      message: "Company created",
      data
    });

  } catch (err) {
    console.error("Create Company Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const updateCompany = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.updateCompanyService(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Company updated",
      data
    });

  } catch (err) {
    console.error("Update Company Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



export const updateCompanyStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const data = await service.updateCompanyStatusService(
      id,
      status
    );

    res.status(200).json({
      success: true,
      message: "Company status updated",
      data
    });

  } catch (err) {
    console.error("Update Company Status Error:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};