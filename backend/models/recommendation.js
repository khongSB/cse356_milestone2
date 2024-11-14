const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecommendationSchema = new Schema({
  user_id: { type: String, required: true },            // ID of the user receiving recommendations
  recommended_videos: [{ type: String, required: true }] // Array of recommended video IDs
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
