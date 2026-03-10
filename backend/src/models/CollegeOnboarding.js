import mongoose from "mongoose";

const collegeOnboardingSchema = new mongoose.Schema(
  {
    requesterName: {
      type: String,
      required: true,
      trim: true
    },

    requesterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    requesterPhone: {
      type: String,
      trim: true
    },

    // 🔽 Name entered (used when "Other" selected)
    collegeName: {
      type: String,
      required: true,
      trim: true
    },

    // 🔽 Existing college selected from dropdown
    selectedCollege: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      index: true,
      default: null
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    emailDomain: {
      type: String,
      lowercase: true,
      trim: true
    },

    verificationDocumentUrl: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    reviewedAt: Date,

    rejectionReason: String,

    // 🔽 Final linked college after approval
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      index: true
    },

    // 🔽 Created login user after approval
    createdUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    notes: String
  },
  {
    timestamps: true
  }
);

const CollegeOnboarding = mongoose.model(
  "CollegeOnboarding",
  collegeOnboardingSchema
);

export default CollegeOnboarding;