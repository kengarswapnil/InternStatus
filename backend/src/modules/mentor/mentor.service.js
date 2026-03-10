import MentorProfile from "../../models/MentorProfile.js";

const EDITABLE_FIELDS = [
  "phoneNo",
  "designation",
  "department",
  "bio"
];

// =============================
// GET PROFILE
// =============================
export const getMentorProfileService = async (user) => {
  const query = user.referenceId
    ? { _id: user.referenceId }
    : { user: user._id };

  const profile = await MentorProfile.findOne(query)
    .populate("company", "name")
    .lean();

  if (!profile) {
    throw new Error("Mentor profile not found");
  }

  return profile;
};

// =============================
// UPDATE PROFILE
// =============================
export const updateMentorProfileService = async (user, body) => {
  const query = user.referenceId
    ? { _id: user.referenceId }
    : { user: user._id };

  const profile = await MentorProfile.findOne(query);

  if (!profile) {
    throw new Error("Mentor profile not found");
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
  const requiredFields = [
    profile.phoneNo,
    profile.designation
  ];

  const isComplete = requiredFields.every(Boolean);

  profile.profileStatus = isComplete
    ? "completed"
    : "pending";

  if (isComplete && !profile.profileCompletedAt) {
    profile.profileCompletedAt = new Date();
  }

  // activation logic
  if (isComplete && profile.status === "unassigned") {
    profile.status = "active";
  }

  await profile.save();

  return profile;
};