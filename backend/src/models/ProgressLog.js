import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
      index: true
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      required: true,
      index: true
    },

    logDate: {
      type: Date,
      required: true,
      index: true
    },

    summary: {
      type: String,
      required: true,
      trim: true
    },

    technologiesUsed: [
      {
        type: String,
        trim: true
      }
    ],

    evidenceLinks: [
      {
        type: String,
        trim: true
      }
    ],

    attachments: [
      {
        type: String
      }
    ],

    mentorFeedback: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["submitted", "approved", "revision_requested"],
      default: "submitted",
      index: true
    },

    reviewedAt: Date
  },
  {
    timestamps: true
  }
);

/*
  Prevent duplicate log entries for same day
*/
progressLogSchema.index(
  { application: 1, logDate: 1 },
  { unique: true }
);

const ProgressLog = mongoose.model(
  "ProgressLog",
  progressLogSchema
);

export default ProgressLog;