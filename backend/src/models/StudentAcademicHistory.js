import mongoose from "mongoose";

const studentAcademicHistorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
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

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      default: null
    },

   Year: {
      type: Number,
      required: true,
      min: 1,
      index: true
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

const StudentAcademicHistory = mongoose.model(
  "StudentAcademicHistory",
  studentAcademicHistorySchema
);

export default StudentAcademicHistory;