import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      default: null // nullable until setup
    },

    role: {
      type: String,
      enum: ["admin", "college", "faculty", "student", "company", "mentor"],
      required: true,
      index: true
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isRegistered: {
      type: Boolean,
      default: false
    },

    resetOTP: String,
    resetOTPExpires: Date,

    passwordSetupToken: String,

    passwordSetupExpires: Date,


    resetPasswordToken: String,
    resetPasswordExpires: Date,

  
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
      index: true
    },

    referenceModel: {
      type: String,
      enum: [
        "StudentProfile",
        "FacultyProfile",
        "College",
        "Company",
        "MentorProfile"
      ]
    },

    lastLoginAt: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  {
    timestamps: true
  }
);

//
// 🔐 PASSWORD HASHING
//
userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

//
// 🔐 PASSWORD COMPARE METHOD
//
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;