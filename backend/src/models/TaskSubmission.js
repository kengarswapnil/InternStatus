import mongoose from "mongoose";

const taskSubmissionSchema = new mongoose.Schema(
{
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    index: true
  },

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

  attempt: {
    type: Number,
    required: true,
    default: 1
  },

  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  /*
   Files uploaded by student
  */
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File"
    }
  ],

  githubLink: {
    type: String,
    trim: true
  },

  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  mentorFeedback: {
    type: String,
    trim: true,
    maxlength: 2000
  },

  score: {
    type: Number,
    min: 0,
    max: 10
  },

  status: {
    type: String,
    enum: [
      "submitted",
      "under_review",
      "approved",
      "revision_requested"
    ],
    default: "submitted",
    index: true
  },

  reviewedAt: Date

},
{
  timestamps: true
}
);

/*
 Prevent duplicate attempt numbers
*/
taskSubmissionSchema.index(
  { task: 1, student: 1, attempt: 1 },
  { unique: true }
);

/*
 Fast query for latest submission
*/
taskSubmissionSchema.index(
  { task: 1, student: 1, submittedAt: -1 }
);

taskSubmissionSchema.index({
  student: 1,
  application: 1,
  createdAt: -1
});

const TaskSubmission = mongoose.model(
  "TaskSubmission",
  taskSubmissionSchema
);

export default TaskSubmission;