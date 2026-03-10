import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    country: String
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    locations: [locationSchema],

    logoUrl: String,

    website: String,

    emailDomain: String,

    industry: String,

    companySize: String,

    description: String,

    // profile completion tracking (added for consistency)
    profileStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    },
    profileCompletedAt: Date,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    approvedAt: Date
  },
  {
    timestamps: true
  }
);


const Company = mongoose.model("Company", companySchema);

export default Company;