import StudentProfile from "../../models/StudentProfile.js";
import {uploadToCloudinary} from "../../utils/uploadToCloudinary.js";


// =============================
// GET PROFILE
// =============================
// =============================
// GET PROFILE (STUDENT)
// =============================
export const getStudentProfileService = async (userId) => {

  const profile = await StudentProfile
    .findOne({ user: userId })
    .select(`
      fullName
      phoneNo
      skills
      bio
      resumeUrl
      prn
      abcId
      Year
      courseName
      specialization
      courseStartYear
      courseEndYear
      status
      profileStatus
    `)
    .populate({
      path: "college",
      select: "name"
    });

  if (!profile) {
    throw new Error("Student profile not found");
  }

  return profile;
};


// =============================
// UPDATE PROFILE (STUDENT SELF)
// =============================
export const updateStudentProfileService = async (userId, body, file) => {

  const profile = await StudentProfile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Student profile not found");
  }

  // =============================
  // SAFE FIELD UPDATES
  // =============================

  if (body.phoneNo !== undefined) {
    profile.phoneNo = body.phoneNo;
  }

  if (body.bio !== undefined) {
    profile.bio = body.bio;
  }

  // 🔥 FIX SKILLS HERE
  if (body.skills !== undefined) {
    try {
      // If coming from multipart, it's string
      profile.skills =
        typeof body.skills === "string"
          ? JSON.parse(body.skills)
          : body.skills;
    } catch {
      profile.skills = [];
    }
  }

  // =============================
  // Resume Upload
  // =============================
  if (file) {
    const upload = await uploadToCloudinary(
      file,
      "student-resumes"
    );
    profile.resumeUrl = upload.secure_url;
  }

  // =============================
  // Profile Completion Logic
  // =============================
  const requiredFields = [
    profile.phoneNo,
    profile.resumeUrl,
    profile.abcId
  ];

  const isComplete = requiredFields.every(Boolean);

  if (isComplete && profile.profileStatus !== "completed") {
    profile.profileStatus = "completed";
    profile.profileCompletedAt = new Date();
  }

  await profile.save();

  return profile;
};