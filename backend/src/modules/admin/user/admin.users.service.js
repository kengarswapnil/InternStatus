/**
 * admin.users.service.js
 * Pure business logic — no req/res here.
 * Production-grade admin user management for InternStatus.
 */

import crypto from "crypto";
import mongoose from "mongoose";
import User from "../../../models/User.js";
import StudentProfile from "../../../models/StudentProfile.js";
import FacultyProfile from "../../../models/FacultyProfile.js";
import MentorProfile from "../../../models/MentorProfile.js";
import College from "../../../models/College.js";
import Company from "../../../models/Company.js";
import Application from "../../../models/Application.js";
import StudentAcademicHistory from "../../../models/StudentAcademicHistory.js";
import FacultyEmploymentHistory from "../../../models/FacultyEmploymentHistory.js";
import MentorEmploymentHistory from "../../../models/MentorEmploymentHistory.js";
import Internship from "../../../models/Internship.js";
import  sendEmail  from "../../../utils/sendEmail.js"; // your existing email util
// your existing email util

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET ALL USERS (paginated, filtered, searchable)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = async (filters) => {
  const {
    page,
    limit,
    search,
    role,
    status,
    isVerified,
    isRegistered,
    sortBy,
    sortOrder,
  } = filters;

  const query = {};

  if (search) {
    query.email = { $regex: search, $options: "i" };
  }

  if (role) query.role = role;
  if (status) query.accountStatus = status;
  if (isVerified !== "") query.isVerified = isVerified === "true";
  if (isRegistered !== "") query.isRegistered = isRegistered === "true";

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("email role accountStatus isVerified isRegistered createdAt lastLoginAt referenceModel")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET USER FULL DETAILS (role-specific deep fetch)
// ─────────────────────────────────────────────────────────────────────────────
export const getUserDetails = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -passwordSetupToken -passwordSetupExpires")
    .lean();

  if (!user) return null;

  let profile = null;
  let organization = null;
  let analytics = null;
  let applications = [];
  let history = [];
  let related = {};

  // ─── STUDENT ───────────────────────────────────────────────────────────────
  if (user.role === "student") {
    profile = await StudentProfile.findOne({ user: userId })
      .populate("college", "name address website emailDomain logoUrl courses")
      .lean();

    if (profile) {
      organization = profile.college || null;

      // Academic history with college populated
      history = await StudentAcademicHistory.find({ student: profile._id })
        .populate("college", "name address")
        .populate("addedBy", "email role")
        .populate("endedBy", "email role")
        .sort({ startDate: -1 })
        .lean();

      // All applications with full details
      applications = await Application.find({ student: profile._id })
        .populate({
          path: "internship",
          select: "title mode locations durationMonths stipendType stipendAmount startDate applicationDeadline status skillsRequired",
          populate: { path: "company", select: "name logoUrl industry" },
        })
        .populate("company", "name logoUrl industry")
        .populate("mentor", "fullName designation")
        .populate("faculty", "fullName designation")
        .sort({ appliedAt: -1 })
        .lean();

      // Analytics aggregation
      const agg = await Application.aggregate([
        { $match: { student: profile._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const countMap = {};
      agg.forEach((a) => (countMap[a._id] = a.count));

      analytics = {
        totalApplications: applications.length,
        applied: countMap["applied"] || 0,
        shortlisted: countMap["shortlisted"] || 0,
        selected: countMap["selected"] || 0,
        offer_accepted: countMap["offer_accepted"] || 0,
        rejected: countMap["rejected"] || 0,
        withdrawn: countMap["withdrawn"] || 0,
        ongoing: countMap["ongoing"] || 0,
        completed: countMap["completed"] || 0,
        terminated: countMap["terminated"] || 0,
      };
    }
  }

  // ─── FACULTY ────────────────────────────────────────────────────────────────
  else if (user.role === "faculty") {
    profile = await FacultyProfile.findOne({ user: userId })
      .populate("college", "name address website emailDomain logoUrl courses")
      .lean();

    if (profile) {
      organization = profile.college || null;

      // Employment history
      history = await FacultyEmploymentHistory.find({ faculty: profile._id })
        .populate("college", "name address")
        .populate("addedBy", "email role")
        .populate("endedBy", "email role")
        .sort({ startDate: -1 })
        .lean();

      if (profile.college) {
        const [studentCount, facultyCount] = await Promise.all([
          StudentProfile.countDocuments({ college: profile.college._id }),
          FacultyProfile.countDocuments({ college: profile.college._id }),
        ]);

        analytics = {
          studentsInCollege: studentCount,
          facultyInCollege: facultyCount,
        };
      }
    }
  }

  // ─── MENTOR ────────────────────────────────────────────────────────────────
  else if (user.role === "mentor") {
    profile = await MentorProfile.findOne({ user: userId })
      .populate("company", "name logoUrl industry website locations")
      .lean();

    if (profile) {
      organization = profile.company || null;

      // Employment history
      history = await MentorEmploymentHistory.find({ mentor: profile._id })
        .populate("company", "name logoUrl")
        .populate("addedBy", "email role")
        .populate("endedBy", "email role")
        .sort({ startDate: -1 })
        .lean();

      if (profile.company) {
        // Interns this mentor is managing
        const [ongoingCount, completedCount] = await Promise.all([
          Application.countDocuments({
            mentor: profile._id,
            status: "ongoing",
          }),
          Application.countDocuments({
            mentor: profile._id,
            status: "completed",
          }),
        ]);

        // Recent applications under this mentor
        applications = await Application.find({ mentor: profile._id })
          .populate({
            path: "internship",
            select: "title mode durationMonths status",
          })
          .populate("student", "fullName prn")
          .sort({ appliedAt: -1 })
          .limit(20)
          .lean();

        analytics = {
          ongoingInterns: ongoingCount,
          completedInterns: completedCount,
          totalInterns: ongoingCount + completedCount,
        };
      }
    }
  }

  // ─── COLLEGE ────────────────────────────────────────────────────────────────
  else if (user.role === "college") {
    const college = await College.findById(user.referenceId).lean();
    profile = college;
    organization = college;

    if (college) {
      const [facultyCount, studentCount, activeFaculty, activeStudents] =
        await Promise.all([
          FacultyProfile.countDocuments({ college: college._id }),
          StudentProfile.countDocuments({ college: college._id }),
          FacultyProfile.countDocuments({ college: college._id, status: "active" }),
          StudentProfile.countDocuments({ college: college._id, status: "active" }),
        ]);

      // Faculty list
      related.faculty = await FacultyProfile.find({ college: college._id })
        .populate("user", "email accountStatus isVerified isRegistered")
        .select("fullName designation department employeeId status profileStatus")
        .sort({ fullName: 1 })
        .lean();

      // Student list (limited)
      related.students = await StudentProfile.find({ college: college._id })
        .populate("user", "email accountStatus isVerified isRegistered")
        .select("fullName prn courseName specialization status profileStatus")
        .sort({ fullName: 1 })
        .limit(50)
        .lean();

      analytics = {
        totalFaculty: facultyCount,
        totalStudents: studentCount,
        activeFaculty,
        activeStudents,
        inactiveFaculty: facultyCount - activeFaculty,
        inactiveStudents: studentCount - activeStudents,
      };
    }
  }

  // ─── COMPANY ────────────────────────────────────────────────────────────────
  else if (user.role === "company") {
    const company = await Company.findById(user.referenceId).lean();
    profile = company;
    organization = company;

    if (company) {
      const [mentorCount, activeMentorCount, totalInternships, openInternships] =
        await Promise.all([
          MentorProfile.countDocuments({ company: company._id }),
          MentorProfile.countDocuments({ company: company._id, status: "active" }),
          Internship.countDocuments({ company: company._id }),
          Internship.countDocuments({ company: company._id, status: "open" }),
        ]);

      // Ongoing and completed intern counts
      const internAgg = await Application.aggregate([
        { $match: { company: company._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const internMap = {};
      internAgg.forEach((a) => (internMap[a._id] = a.count));

      // Internship listings with applicant count
      const internships = await Internship.find({ company: company._id })
        .sort({ createdAt: -1 })
        .lean();

      // Attach application counts
      const internshipIds = internships.map((i) => i._id);
      const appCounts = await Application.aggregate([
        { $match: { internship: { $in: internshipIds } } },
        { $group: { _id: "$internship", count: { $sum: 1 } } },
      ]);
      const appCountMap = {};
      appCounts.forEach((a) => (appCountMap[a._id.toString()] = a.count));

      related.internships = internships.map((i) => ({
        ...i,
        applicantCount: appCountMap[i._id.toString()] || 0,
      }));

      // Mentor list
      related.mentors = await MentorProfile.find({ company: company._id })
        .populate("user", "email accountStatus isVerified isRegistered")
        .select("fullName designation department employeeId status")
        .lean();

      analytics = {
        totalMentors: mentorCount,
        activeMentors: activeMentorCount,
        totalInternships,
        openInternships,
        closedInternships: totalInternships - openInternships,
        ongoingInterns: internMap["ongoing"] || 0,
        completedInterns: internMap["completed"] || 0,
        totalApplications: Object.values(internMap).reduce((a, b) => a + b, 0),
      };
    }
  }

  // ─── ADMIN ──────────────────────────────────────────────────────────────────
  else if (user.role === "admin") {
    analytics = {
      note: "Admin account — no profile entity",
    };
  }

  return {
    user,
    profile,
    organization,
    analytics,
    applications,
    history,
    related,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. UPDATE USER STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const updateUserStatus = async (userId, accountStatus) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { accountStatus },
    { new: true }
  ).select("email role accountStatus isVerified isRegistered updatedAt");

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. RESEND INVITE
// ─────────────────────────────────────────────────────────────────────────────
export const resendInvite = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return { error: "User not found" };
  if (user.isRegistered) return { error: "User has already completed registration" };
  if (user.accountStatus === "deleted") return { error: "Cannot invite deleted user" };

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

  user.passwordSetupToken = hashedToken;
  user.passwordSetupExpires = expiry;
  await user.save();

  const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Complete Your InternStatus Registration",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to InternStatus</h2>
        <p>You've been invited as a <strong>${user.role}</strong>. Click the link below to set up your account.</p>
        <a href="${setupLink}" style="
          display: inline-block;
          background: #4F46E5;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          margin: 20px 0;
        ">Complete Registration</a>
        <p>This link expires in <strong>48 hours</strong>.</p>
        <p style="color: #888; font-size: 12px;">If you didn't expect this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return { message: `Invite sent to ${user.email}` };
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. UPDATE USER PROFILE (admin can patch profile fields)
// ─────────────────────────────────────────────────────────────────────────────
export const updateUserProfile = async (userId, body) => {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  const { role } = user;

  // Allowed fields per role (prevent mass assignment)
  const ALLOWED = {
    student: ["fullName", "phoneNo", "bio", "skills", "courseName", "specialization", "courseStartYear", "courseEndYear"],
    faculty: ["fullName", "phoneNo", "bio", "designation", "department", "joiningYear", "employeeId"],
    mentor: ["fullName", "phoneNo", "bio", "designation", "department", "employeeId"],
    college: ["name", "address", "phone", "website", "description"],
    company: ["name", "website", "industry", "companySize", "description"],
    admin: [],
  };

  const allowed = ALLOWED[role] || [];
  const updateData = {};
  allowed.forEach((field) => {
    if (body[field] !== undefined) updateData[field] = body[field];
  });

  if (Object.keys(updateData).length === 0) return { message: "No valid fields to update" };

  let updated;
  if (role === "student") {
    updated = await StudentProfile.findOneAndUpdate({ user: userId }, updateData, { new: true }).lean();
  } else if (role === "faculty") {
    updated = await FacultyProfile.findOneAndUpdate({ user: userId }, updateData, { new: true }).lean();
  } else if (role === "mentor") {
    updated = await MentorProfile.findOneAndUpdate({ user: userId }, updateData, { new: true }).lean();
  } else if (role === "college") {
    updated = await College.findByIdAndUpdate(user.referenceId, updateData, { new: true }).lean();
  } else if (role === "company") {
    updated = await Company.findByIdAndUpdate(user.referenceId, updateData, { new: true }).lean();
  }

  return updated;
};