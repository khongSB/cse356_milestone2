const mongoose = require("mongoose");
const { Schema } = mongoose;

const ViewSchema = new Schema({
  user_id: { type: String },
  video_id: { type: String },
  viewed: { type: Boolean }, // redundant?
});

module.exports = mongoose.model("View", ViewSchema);
