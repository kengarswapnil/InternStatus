import mongoose from "mongoose";

const facultyEmploymentHistorySchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyProfile",
      required: true,
      index: true
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
    },

    courseName: String,

    specialization: String,

    designation: String,

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
      default: "active",
      index: true
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: String
  },
  {
    timestamps: true
  }
);


const FacultyEmploymentHistory = mongoose.model(
  "FacultyEmploymentHistory",
  facultyEmploymentHistorySchema
);

export default FacultyEmploymentHistory;