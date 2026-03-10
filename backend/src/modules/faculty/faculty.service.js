import FacultyProfile from "../../models/FacultyProfile.js";

const EDITABLE_FIELDS = [
  "fullName",
  "phoneNo",
  "designation",
  "bio"
];

// =============================
// GET PROFILE
// =============================
export const getFacultyProfileService = async (user) => {
  const query = user.referenceId
    ? { _id: user.referenceId }
    : { user: user._id };


  const profile = await FacultyProfile.findOne(query)
    .populate("college", "name")
    .lean();

  if (!profile) {
    throw new Error("Faculty profile not found");
  }

  return profile;
};

// =============================
// UPDATE PROFILE
// =============================
export const updateFacultyProfileService = async (user, body) => {
  const query = user.referenceId
    ? { _id: user.referenceId }
    : { user: user._id };

  const profile = await FacultyProfile.findOne(query);
  if (!profile) {
    throw new Error("Faculty profile not found");
  }

  // whitelist update
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      const value =
        typeof body[field] === "string"
          ? body[field].trim()
          : body[field];

      profile[field] = value;
    }
  });

  // completion logic
  const required = [
    profile.fullName,
    profile.phoneNo,
    profile.designation
  ];

  const isComplete = required.every(Boolean);

  profile.profileStatus = isComplete
    ? "completed"
    : "pending";

  if (isComplete && !profile.profileCompletedAt) {
    profile.profileCompletedAt = new Date();
  }

  await profile.save();

  return profile;
};