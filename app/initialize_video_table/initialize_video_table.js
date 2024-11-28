const mongoose = require("mongoose");
const fs = require("fs");

const mongoURI = "mongodb://data:27017/CSE356";

const uploaded_video_table = require("../backend/models/uploaded-video");

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Read the JSON file
fs.readFile("../media/m2.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Parse the JSON data
  const videos = JSON.parse(data);

  // Process each entry in the JSON file
  Object.keys(videos).forEach(async (key) => {
    const video = {
      user_id: "bob", // Static user_id
      video_id: key.replace(".mp4", ""), // Remove .mp4 suffix
      title: key.replace(".mp4", ""), // Same as video_id
      author: "bob", // Static author
      description: videos[key], // Description is the value in the JSON
      status: "complete", // Set status as 'complete'
    };

    // Create and save a new video entry
    try {
      const newVideo = new uploaded_video_table(video);
      await newVideo.save();
      console.log(`Inserted: ${video.title}`);
    } catch (error) {
      console.error(`Error inserting ${video.title}:`, error);
    }
  });
});
