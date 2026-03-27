import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // 🎯 WHO RECEIVES
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    recipientModel: {
      type: String,
      enum: [
        "StudentProfile",
        "FacultyProfile",
        "College",
        "Company",
        "MentorProfile"
      ],
      required: true
    },

    // 🎯 WHO SENT
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // system can send
    },

    senderRole: {
      type: String,
      enum: ["admin", "college", "faculty", "system"],
      default: "system"
    },

    // 📩 CONTENT
    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    // 🔗 CONTEXT (VERY IMPORTANT)
    type: {
      type: String,
      enum: [
        "AT_RISK",
        "GENERAL",
        "REMINDER",
        "APPLICATION_UPDATE",
        "SYSTEM"
      ],
      index: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    referenceModel: {
      type: String,
      default: null
    },

    // 📡 CHANNEL
    channels: [
      {
        type: String,
        enum: ["email", "in_app"],
        default: "email"
      }
    ],

    // 📊 STATUS
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    sentAt: Date,
    readAt: Date,

    // 🧠 FUTURE: BULK SUPPORT
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  { timestamps: true }
);

// 🔥 Index for fast queries
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;