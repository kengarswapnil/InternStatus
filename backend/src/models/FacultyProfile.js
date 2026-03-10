import mongoose from "mongoose";

const facultyProfileSchema = new mongoose.Schema(
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

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
      index: true
    },

    // academic mapping
    courseName: String,        // from college.courses.name
    department: String,        // specialization from course.specializations

    designation: String,
    phoneNo: String,
    bio: String,

    joiningYear: String,
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
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  { timestamps: true }
);

// employeeId unique per college
facultyProfileSchema.index(
  { college: 1, employeeId: 1 },
  { unique: true, sparse: true }
);

const FacultyProfile = mongoose.model(
  "FacultyProfile",
  facultyProfileSchema
);

export default FacultyProfile;