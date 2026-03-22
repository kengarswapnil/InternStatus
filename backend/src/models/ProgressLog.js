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

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    logDate: {
      type: Date,
      required: true,
      index: true
    },

    /*
      Actual meaningful content
      Comes from submission.description
    */
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

    status: {
      type: String,
      enum: ["approved"],
      default: "approved",
      index: true
    },

    reviewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/*
  Prevent duplicate logs per task
*/
progressLogSchema.index(
  { task: 1 },
  { unique: true }
);


const ProgressLog = mongoose.model("ProgressLog", progressLogSchema);

export default ProgressLog;