import mongoose from "mongoose";

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true
    },

    designation: String,
    department: String,
    bio: String,
    phoneNo: String,

    employeeId: String,

    profileStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    },

    profileCompletedAt: Date,

    status: {
      type: String,
      enum: ["active", "unassigned", "inactive"],
      default: "unassigned"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  { timestamps: true }
);

mentorProfileSchema.index(
  { company: 1, employeeId: 1 },
  { unique: true, sparse: true }
);

const MentorProfile = mongoose.model(
  "MentorProfile",
  mentorProfileSchema
);

export default MentorProfile;