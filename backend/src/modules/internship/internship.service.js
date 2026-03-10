import Internship from "../../models/Internship.js";
import Company from "../../models/Company.js";
import Application from "../../models/Application.js";
import mongoose from "mongoose";

export const postInternshipService = async (user, body) => {

  if (user.role !== "company") {
    throw new Error("Only companies can post internships");
  }

  const {
    title,
    description,
    startDate,
    durationMonths,
    applicationDeadline,
    mode,
    skillsRequired,
    maxApplicants,
    positions,
    stipendType,
    stipendAmount,
    locations,
    eligibility
  } = body;

  /*
    REQUIRED FIELDS
  */
  if (
    !title ||
    !description ||
    !startDate ||
    !durationMonths ||
    !applicationDeadline ||
    !mode ||
    !positions ||
    !stipendType
  ) {
    throw new Error("Required fields missing");
  }

  const parsedLocations =
  mode === "remote"
    ? []
    : (locations || []).map((loc) => ({
        city: loc.trim()
      }));

  /*
    MODE VALIDATION
  */
  if (!["remote", "onsite", "hybrid"].includes(mode)) {
    throw new Error("Invalid internship mode");
  }

  /*
    STIPEND VALIDATION
  */
  if (!["paid", "unpaid", "performance_based"].includes(stipendType)) {
    throw new Error("Invalid stipend type");
  }

  if (stipendType === "paid") {
    if (!stipendAmount || Number(stipendAmount) <= 0) {
      throw new Error("Valid stipend amount required");
    }
  }

  /*
    DATE VALIDATION
  */
  const start = new Date(startDate);
  const deadline = new Date(applicationDeadline);
  const now = new Date();

  if (start <= now) {
    throw new Error("Start date must be in future");
  }

  if (deadline <= now) {
    throw new Error("Deadline must be in future");
  }

  if (deadline >= start) {
    throw new Error("Deadline must be before start date");
  }

  /*
    NUMERIC VALIDATION
  */
  const duration = Number(durationMonths);
  const pos = Number(positions);
  const max = maxApplicants ? Number(maxApplicants) : null;

  if (isNaN(duration) || duration <= 0) {
    throw new Error("Invalid duration");
  }

  if (isNaN(pos) || pos <= 0) {
    throw new Error("Invalid positions");
  }

  if (max && max < pos) {
    throw new Error("Max applicants cannot be less than positions");
  }

  /*
    SKILLS VALIDATION
  */
  if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
    throw new Error("At least one skill required");
  }

  /*
    LOCATION RULE
    remote → not required
    onsite/hybrid → required
  */
  if (mode !== "remote") {
    if (!locations || locations.length === 0) {
      throw new Error("Location required for onsite or hybrid");
    }
  }

  /*
    COMPANY VALIDATION
  */
  const companyProfile = await Company.findById(user.referenceId);

  if (!companyProfile) {
    throw new Error("Company profile not found");
  }

  /*
    CREATE
  */
  const internship = await Internship.create({
    title: title.trim(),
    description: description.trim(),
    company: companyProfile._id,
    createdBy: user._id,
    startDate: start,
    durationMonths: duration,
    applicationDeadline: deadline,
    mode,
    skillsRequired,
    positions: pos,
    maxApplicants: max,
    stipendType,
    stipendAmount:
      stipendType === "paid" ? Number(stipendAmount) : null,
    locations: mode === "remote" ? [] : parsedLocations,
    eligibility: eligibility || {},
    status: "open"
  });

  return internship;
};

/*
PRODUCTION BROWSE INTERNSHIPS
*/
export const browseInternshipsService = async (user) => {
  if (user.role !== "student") {
    throw new Error("Only students allowed");
  }

  const studentId = user.referenceId;
  const now = new Date();

  /*
    STEP 1 — GET INTERNSHIPS
  */
  const internships = await Internship.find({
    status: "open",
    applicationDeadline: { $gte: now },
    $expr: {
      $lt: ["$currentApplicants", "$maxApplicants"]
    }
  })
    .populate("company")
    .sort({ createdAt: -1 })
    .lean();

  /*
    STEP 2 — GET STUDENT APPLICATIONS
  */
  const applications = await Application.find({
    student: studentId
  }).select("internship");

  const appliedSet = new Set(
    applications.map(a => a.internship.toString())
  );

  /*
    STEP 3 — ADD alreadyApplied FLAG
  */
  const result = internships.map(i => ({
    ...i,
    alreadyApplied: appliedSet.has(i._id.toString())
  }));

  return result;
};

/*
GET SINGLE INTERNSHIP DETAILS
*/
export const getInternshipDetailsService = async (user, id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findById(id)
    .populate("company")
    .lean();

  if (!internship) {
    throw new Error("Internship not found");
  }

  /*
    COUNT APPLICATIONS (exclude withdrawn)
  */
  const applicationsCount = await Application.countDocuments({
    internship: id,
    status: { $ne: "withdrawn" }
  });

  /*
    CHECK IF STUDENT ALREADY APPLIED
  */
  let alreadyApplied = false;

  if (user.role === "student") {
    const app = await Application.findOne({
      student: user.referenceId,
      internship: id
    });

    alreadyApplied = !!app;
  }

  return {
    ...internship,
    applicationsCount,
    alreadyApplied
  };
};


export const getCompanyInternshipsService = async (user) => {
  if (user.role !== "company") {
    throw new Error("Only company allowed");
  }

  const companyId = user.referenceId;

  const internships = await Internship.find({
    company: companyId
  })
    .sort({ createdAt: -1 })
    .lean();

  return internships;
};

export const updateInternshipStatusService = async (
  user,
  internshipId,
  status
) => {

  if (user.role !== "company") {
    throw new Error("Only company allowed");
  }

  if (!["open", "closed"].includes(status)) {
    throw new Error("Invalid status");
  }

  const internship = await Internship.findOne({
    _id: internshipId,
    company: user.referenceId
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  internship.status = status;
  await internship.save();

  return internship;
};

export const updateInternshipService = async (
  user,
  internshipId,
  updateData
) => {

  if (user.role !== "company") {
    throw new Error("Only company allowed");
  }

  if (!mongoose.Types.ObjectId.isValid(internshipId)) {
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findOne({
    _id: internshipId,
    company: user.referenceId
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  if (internship.status === "closed") {
    throw new Error("Cannot edit closed internship");
  }

  /*
    COUNTS
  */
  const totalApplications = await Application.countDocuments({
    internship: internship._id,
    status: { $ne: "withdrawn" }
  });

  const selectedCount = await Application.countDocuments({
    internship: internship._id,
    status: "selected"
  });

  const hasApplications = totalApplications > 0;

  /*
    RULES AFTER APPLICATIONS EXIST
  */
  if (hasApplications) {

    // POSITIONS → cannot go below selected students
    if (updateData.positions !== undefined) {
      const newPositions = Number(updateData.positions);

      if (newPositions < selectedCount) {
        throw new Error(
          `Cannot reduce positions below selected students (${selectedCount})`
        );
      }
    }

    // STIPEND → cannot decrease
    if (updateData.stipendAmount !== undefined) {
      const newStipend = Number(updateData.stipendAmount || 0);
      const oldStipend = Number(internship.stipendAmount || 0);

      if (newStipend < oldStipend) {
        throw new Error(
          "Cannot decrease stipend after students have applied"
        );
      }
    }

    // STIPEND TYPE LOCK
    if (
      updateData.stipendType !== undefined &&
      updateData.stipendType !== internship.stipendType
    ) {
      throw new Error(
        "Cannot change stipend type after students have applied"
      );
    }

    // MODE LOCK
    if (
      updateData.mode !== undefined &&
      updateData.mode !== internship.mode
    ) {
      throw new Error(
        "Cannot change mode after students have applied"
      );
    }

    // DURATION LOCK
    if (
      updateData.durationMonths !== undefined &&
      updateData.durationMonths !== internship.durationMonths
    ) {
      throw new Error(
        "Cannot change duration after students have applied"
      );
    }

    // START DATE LOCK
    if (
      updateData.startDate !== undefined &&
      new Date(updateData.startDate).getTime() !==
        new Date(internship.startDate).getTime()
    ) {
      throw new Error(
        "Cannot change start date after students have applied"
      );
    }
  }

  /*
    DEADLINE VALIDATION
  */
  if (updateData.applicationDeadline !== undefined) {
    const deadline = new Date(updateData.applicationDeadline);

    if (deadline < new Date()) {
      throw new Error("Deadline cannot be in past");
    }

    updateData.applicationDeadline = deadline;
  }

  /*
    MAX APPLICANTS VALIDATION
  */
  if (updateData.maxApplicants !== undefined) {

    const newMax = Number(updateData.maxApplicants);

    if (isNaN(newMax) || newMax < 1) {
      throw new Error("Invalid maxApplicants value");
    }

    if (newMax < totalApplications) {
      throw new Error(
        `Cannot reduce maxApplicants below current applications (${totalApplications})`
      );
    }

    updateData.maxApplicants = newMax;
  }

  /*
    POSITIONS VALIDATION
  */
  if (updateData.positions !== undefined) {

    const newPositions = Number(updateData.positions);

    if (isNaN(newPositions) || newPositions < 1) {
      throw new Error("Invalid positions value");
    }

    updateData.positions = newPositions;
  }

  /*
    SAFE FIELD UPDATE
  */
  const allowedFields = [
    "title",
    "description",
    "positions",
    "maxApplicants",
    "applicationDeadline",
    "mode",
    "stipendType",
    "stipendAmount",
    "skillsRequired",
    "startDate",
    "durationMonths",
    "eligibility"
  ];

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      internship[field] = updateData[field];
    }
  });

  await internship.save();

  /*
    AUTO REOPEN IF CAPACITY INCREASED
  */
  if (internship.status === "closed" && internship.maxApplicants) {

    const total = await Application.countDocuments({
      internship: internship._id,
      status: { $ne: "withdrawn" }
    });

    if (total < internship.maxApplicants) {
      internship.status = "open";
      await internship.save();
    }
  }

  return internship;
};