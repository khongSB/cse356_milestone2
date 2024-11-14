const mongoose = require("mongoose");
const { Schema } = mongoose;

const InteractionSchema = new Schema({
  user_id: { type: String },
  video_id: { type: String },
  value: { type: Boolean, default: null },
});

module.exports = mongoose.model("Interaction", InteractionSchema);
