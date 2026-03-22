import Application from "../../models/Application.js";
import MentorProfile from "../../models/MentorProfile.js";
import mongoose from "mongoose";

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


export const getMentorInternsService = async (mentorUserId) => {

  if (!mongoose.Types.ObjectId.isValid(mentorUserId)) {
    throw new Error("Invalid mentor id");
  }

  const mentor = await MentorProfile.findOne({ user: mentorUserId })
    .select("_id status")
    .lean();

  if (!mentor) {
    throw new Error("Mentor not found");
  }

  const applications = await Application.find({
    mentor: mentor._id,
    status: { $in: ["offer_accepted", "ongoing", "completed"] }
  })
    .populate({
      path: "student",
      select: "fullName resumeUrl",
      populate: {
        path: "user",
        select: "email"
      }
    })
    .populate({
      path: "internship",
      select: "title mode locations"
    })
    .populate("report")
    .sort({ createdAt: -1 })
    .lean();

  const interns = applications.map(app => ({
    applicationId: app._id,

    studentName: app.student?.fullName,
    studentEmail: app.student?.user?.email,
    resumeUrl: app.resumeSnapshot || app.student?.resumeUrl,

    internshipTitle: app.internship?.title,
    mode: app.internship?.mode,
    location: app.internship?.locations?.[0]?.city || "Remote",

    startDate: app.internshipStartDate,
    endDate: app.internshipEndDate,

    status: app.status,
    evaluationScore: app.evaluationScore,
    report: app.report || null
  }));

  return interns;
};

export const updateMentorApplicationStatusService = async (
  user,
  applicationId,
  newStatus
) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors allowed");
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application id");
  }

  const allowedStatuses = ["ongoing", "completed", "terminated"];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const transitions = {
    offer_accepted: ["ongoing"],
    ongoing: ["completed", "terminated"]
  };

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const application = await Application.findById(applicationId)
      .session(session);

    if (!application) {
      throw new Error("Application not found");
    }

    /*
      Verify mentor assignment
    */
    if (!application.mentor) {
      throw new Error("Mentor not assigned");
    }

    if (application.mentor.toString() !== user.referenceId.toString()) {
      throw new Error("Unauthorized mentor");
    }

    const currentStatus = application.status;

    /*
      Terminal states lock
    */
    const terminalStates = [
      "completed",
      "terminated",
      "rejected",
      "withdrawn"
    ];

    if (terminalStates.includes(currentStatus)) {
      throw new Error(`Cannot change after ${currentStatus}`);
    }

    /*
      Transition validation
    */
    if (
      !transitions[currentStatus] ||
      !transitions[currentStatus].includes(newStatus)
    ) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${newStatus}`
      );
    }

    /*
      Status actions
    */

    if (newStatus === "ongoing") {
      application.internshipStartDate = new Date();
    }

    if (newStatus === "completed") {
      application.internshipEndDate = new Date();
      application.completionDate = new Date();
    }

    if (newStatus === "terminated") {
      application.terminationDate = new Date();
    }

    application.status = newStatus;

    await application.save({ session });

    await session.commitTransaction();

    return application;

  } catch (err) {

    await session.abortTransaction();
    throw err;

  } finally {

    session.endSession();

  }

};