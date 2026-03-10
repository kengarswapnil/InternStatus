import mongoose from "mongoose";

const mentorEmploymentHistorySchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      required: true,
      index: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    designation: String,
    department: String,

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active"
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const MentorEmploymentHistory = mongoose.model(
  "MentorEmploymentHistory",
  mentorEmploymentHistorySchema
);

export default MentorEmploymentHistory;