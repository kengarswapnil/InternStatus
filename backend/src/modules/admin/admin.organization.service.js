import mongoose from "mongoose";
import College from "../../models/College.js";
import Company from "../../models/Company.js";


/* =====================================================
   COLLEGES
===================================================== */

export const getCollegesService = async () => {

  return College.find()
    .sort({ createdAt: -1 });
};



export const getCollegeByIdService = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid college id");

  const college = await College.findById(id);

  if (!college)
    throw new Error("College not found");

  return college;
};



export const createCollegeService = async (body, adminId) => {

  const {
    name,
    address,
    phone,
    website,
    emailDomain,
    description,
    courses
  } = body;

  if (!name)
    throw new Error("College name required");

  const exists = await College.findOne({
    name: name.trim()
  });

  if (exists)
    throw new Error("College already exists");


  const college = await College.create({
    name: name.trim(),
    address,
    phone,
    website,
    emailDomain: emailDomain?.toLowerCase(),
    description,
    courses: courses || [],
    createdBy: adminId,
    approvedAt: new Date()
  });

  return college;
};



export const updateCollegeService = async (id, body) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid college id");

  const college = await College.findById(id);

  if (!college)
    throw new Error("College not found");


  if (body.name) {

    const duplicate = await College.findOne({
      name: body.name,
      _id: { $ne: id }
    });

    if (duplicate)
      throw new Error("College with same name exists");
  }


  Object.assign(college, body);

  await college.save();

  return college;
};



export const updateCollegeStatusService = async (id, status) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid college id");

  if (!["active", "inactive"].includes(status))
    throw new Error("Invalid status");

  const college = await College.findById(id);

  if (!college)
    throw new Error("College not found");

  college.status = status;

  await college.save();

  return college;
};




/* =====================================================
   COMPANIES
===================================================== */

export const getCompaniesService = async () => {

  return Company.find()
    .sort({ createdAt: -1 });
};



export const getCompanyByIdService = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid company id");

  const company = await Company.findById(id);

  if (!company)
    throw new Error("Company not found");

  return company;
};



export const createCompanyService = async (body, adminId) => {

  const {
    name,
    locations,
    website,
    emailDomain,
    industry,
    companySize,
    description
  } = body;

  if (!name)
    throw new Error("Company name required");

  const exists = await Company.findOne({
    name: name.trim()
  });

  if (exists)
    throw new Error("Company already exists");


  const company = await Company.create({
    name: name.trim(),
    locations: locations || [],
    website,
    emailDomain: emailDomain?.toLowerCase(),
    industry,
    companySize,
    description,
    createdBy: adminId,
    approvedAt: new Date()
  });

  return company;
};



export const updateCompanyService = async (id, body) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid company id");

  const company = await Company.findById(id);

  if (!company)
    throw new Error("Company not found");


  if (body.name) {

    const duplicate = await Company.findOne({
      name: body.name,
      _id: { $ne: id }
    });

    if (duplicate)
      throw new Error("Company with same name exists");
  }


  Object.assign(company, body);

  await company.save();

  return company;
};



export const updateCompanyStatusService = async (id, status) => {

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid company id");

  if (!["active", "inactive"].includes(status))
    throw new Error("Invalid status");

  const company = await Company.findById(id);

  if (!company)
    throw new Error("Company not found");

  company.status = status;

  await company.save();

  return company;
};

