import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
{
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
    index: true
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MentorProfile",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  deadline: {
    type: Date
  },

  /*
   Mentor uploaded resources
  */
  resourceFiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File"
    }
  ],

  taskType: {
    type: String,
    enum: ["internal", "external"],
    default: "internal"
  },

  externalLink: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: [
      "assigned",
      "submitted",
      "under_review",
      "revision_requested",
      "completed",
      "cancelled"
    ],
    default: "assigned",
    index: true
  },

  assignedAt: {
    type: Date,
    default: Date.now
  }

},
{
  timestamps: true
}
);

/*
 Faster lookup for internship tasks
*/
taskSchema.index({
  application: 1,
  status: 1
});

const Task = mongoose.model("Task", taskSchema);

export default Task;