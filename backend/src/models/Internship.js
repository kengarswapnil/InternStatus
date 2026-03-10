import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    country: String
  },
  { _id: false }
);

const eligibilitySchema = new mongoose.Schema(
  {
    courses: [String],
    specializations: [String],
    minYear: Number,
    maxYear: Number
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    locations: [locationSchema],

    mode: {
      type: String,
      enum: ["remote", "onsite", "hybrid"]
    },

    startDate: Date,

    durationMonths: Number,

    applicationDeadline: Date,

    stipendType: {
      type: String,
      enum: ["paid", "unpaid", "performance_based"]
    },

    stipendAmount: Number,

    positions: Number,

    skillsRequired: [String],

    eligibility: eligibilitySchema,

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true
    },

    maxApplicants: Number
  },
  {
    timestamps: true
  }
);

internshipSchema.index({ applicationDeadline: 1 });

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;