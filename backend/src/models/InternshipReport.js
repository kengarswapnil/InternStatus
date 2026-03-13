import mongoose from "mongoose";

const internshipReportSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
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

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    reportUrl: {
      type: String,
      required: true
    },

    generatedAt: {
      type: Date,
      default: Date.now
    },

    totalTasks: {
      type: Number,
      default: 0
    },

    tasksCompleted: {
      type: Number,
      default: 0
    },

    completionRate: {
      type: Number,
      min: 0,
      max: 100
    },

    mentorScore: {
      type: Number,
      min: 0,
      max: 10
    },

    facultyScore: {
      type: Number,
      min: 0,
      max: 10
    },

    creditsEarned: {
      type: Number
    },

    mentorRemarks: String,

    facultyRemarks: String,

    status: {
      type: String,
      enum: ["generated", "faculty_approved"],
      default: "generated",
      index: true
    }
  },
  {
    timestamps: true
  }
);

const InternshipReport = mongoose.model(
  "InternshipReport",
  internshipReportSchema
);

export default InternshipReport;