const mongoose = require("mongoose");
const { Schema } = mongoose;

const UploadedVideoSchema = new Schema({
  user_id: String,
  video_id: String,
  title: String,
  author: String,
  description: String,
  status: {
    type: String,
    enum: ["processing", "complete"],
    default: "processing",
  },
});

module.exports = mongoose.model("UploadedVideo", UploadedVideoSchema);
