import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
{
  url: {
    type: String,
    required: true
  },

  fileName: {
    type: String,
    required: true
  },

  fileType: String,

  fileSize: Number,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: true
}
);

const File = mongoose.model("File", fileSchema);

export default File;