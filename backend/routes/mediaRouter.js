const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const multer = require("multer");
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/root/milestone2/media/"); // Specify your directory here
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Retain the extension
  },
});

const upload = multer({ storage: storage });

const { exec } = require("child_process");

const interaction_table = require("../models/interaction");
const view_table = require("../models/view");
const uploaded_video_table = require("../models/uploaded-video");

const MEDIA_PATH = "/root/milestone2/media/processed-media";

router.post("/api/videos", (req, res) => {
  const count = req.body.count;
  const filePath = "/root/milestone2/media/m2.json";

  const videoData = JSON.parse(fs.readFileSync(filePath));

  //console.log(videoData);
  //console.log(Object.entries(videoData));
  //console.log(Object.entries(videoData).slice(0, count));
  // Slice the video entries to get only the requested number
  const selectedVideos = Object.entries(videoData)
    .slice(0, count) // Get the first `count` entries from the videoData dictionary
    .map(([id, description]) => ({
      id: id,
      title: id, // Use the key (file name) as the title
      description, // Use the value (description) from the JSON
    }));

  // Respond with the selected video metadata
  // console.log(selectedVideos);
  // console.log(selectedVideos.length);
  res.status(200).json({ status: "OK", videos: selectedVideos });
});

router.get("/api/manifest/:id", (req, res) => {
  // Get the video ID from the request parameters
  const videoId = req.params.id;

  // Construct the path to the manifest file
  const manifestPath = path.join(MEDIA_PATH, `/manifests/${videoId}`);

  // Send the manifest file as a response
  res.sendFile(manifestPath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).end();
    }
  });
});

router.get("/api/thumbnail/:id", (req, res) => {
  const fileName = req.params.id;
  const filePath = path.join(MEDIA_PATH, "thumbnails", fileName);
  console.log("sending: " + filePath);
  res.sendFile(filePath);
});

router.get("/play/:id", (req, res) => {
  res.sendFile("/root/milestone2/frontend/dist/index.html");
});

router.get("/random-video", (req, res) => {
  const filePath = "/root/milestone2/media/m2.json";
  const videoData = JSON.parse(fs.readFileSync(filePath));

  const videoTitles = Object.keys(videoData);
  const randomTitle =
    videoTitles[Math.floor(Math.random() * videoTitles.length)];
  const videoId = randomTitle.replace(".mp4", "");

  res.json({ id: videoId });
});

router.get("/upload", (req, res) => {
  res.sendFile("/root/milestone2/frontend/dist/index.html");
});

// router.post("/api/upload", upload.single("mp4File"), async (req, res) => {
//   const { user_id, video_id } = {
//     user_id: req.session.username,
//     video_id: path.basename(req.file.path),
//   };

//   const newUploadedVideo = new uploaded_video_table({
//     user_id,
//     video_id,
//     title: req.body.title,
//     author: req.body.author,
//   });

//   try {
//     // Saving entry in database
//     await newUploadedVideo.save();

//     const file = req.file;
//     const title = req.body.title;
//     const author = req.body.author;

//     console.log("File:", file);
//     console.log("Title:", title);
//     console.log("Author:", author);

//     const filePath = req.file.path;
//     console.log(
//       `new file saved as: ${filePath} | title: ${title} | author: ${author}`
//     );
//     const fileNameWithoutExt = path.basename(filePath);
//     exec(
//       `python3 process_video.py ${fileNameWithoutExt}`,
//       { cwd: "/root/milestone2/media" },
//       async (error, stdout, stderr) => {
//         if (error) {
//           console.error(`${title} could not be processed!`);
//         } else {
//           console.log(`${title} processed!`);
//           uploaded_video_table
//             .updateOne(
//               { user_id: user_id, video_id: video_id }, // Filter by user_id and video_id
//               { $set: { status: "complete" } } // Update status to "completed"
//             )
//             .then((result) => {
//               if (result.modifiedCount > 0) {
//                 console.log("New video status updated to 'complete'");
//               } else {
//                 console.log("No matching new video found or already updated");
//               }
//             })
//             .catch((error) => {
//               console.error("Error updating status of new video:", error);
//             });
//         }
//       }
//     );
//     res.status(200).json({ status: "OK", id: video_id });
//   } catch (error) {
//     res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: error.message });
//   }
// });

const { spawn } = require("child_process");

router.post("/api/upload", upload.single("mp4File"), async (req, res) => {
  const { user_id, video_id } = {
    user_id: req.session.username,
    video_id: path.basename(req.file.path),
  };

  const newUploadedVideo = new uploaded_video_table({
    user_id,
    video_id,
    title: req.body.title,
    author: req.body.author,
  });

  try {
    // Saving entry in database
    await newUploadedVideo.save();

    const file = req.file;
    const title = req.body.title;
    const author = req.body.author;

    console.log("File:", file);
    console.log("Title:", title);
    console.log("Author:", author);

    const filePath = req.file.path;
    console.log(
      `new file saved as: ${filePath} | title: ${title} | author: ${author}`
    );

    const fileNameWithoutExt = path.basename(filePath);

    // Using spawn instead of exec
    const process = spawn("python3", ["process_video.py", fileNameWithoutExt], {
      cwd: "/root/milestone2/media",
    });
    res.status(200).json({ status: "OK", id: video_id });

    // Listening to the output of the process
    process.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
    });

    process.stderr.on("data", (data) => {
      // console.error(`stderr: ${data}`);
    });

    process.on("close", async (code) => {
      if (code === 0) {
        console.log(`${title} processed!`);
        try {
          const result = await uploaded_video_table.updateOne(
            { user_id: user_id, video_id: video_id }, // Filter by user_id and video_id
            { $set: { status: "complete" } } // Update status to "completed"
          );
          if (result.modifiedCount > 0) {
            console.log("New video status updated to 'complete'");
          } else {
            console.log("No matching new video found or already updated");
          }
        } catch (error) {
          console.error("Error updating status of new video:", error);
        }
      } else {
        console.error(`${title} could not be processed!`);
      }
    });
  } catch (error) {
    res
      .status(200)
      .json({ status: "ERROR", error: true, message: error.message });
  }
});

router.get("/api/processing-status", async (req, res) => {
  const user_id = req.session.username;
  const uploadedVideos = await uploaded_video_table.find({ user_id });

  const videos = uploadedVideos.map(({ video_id, title, status }) => ({
    id: video_id,
    title: title,
    status: status,
  }));

  res.status(200).json({ status: "OK", videos: videos });
});

// POST /api/like {id, value}
// Allow a logged in user to “like” a post specified by id. value = true if thumbs up, value = false if thumbs down and null if the user did not “like” or “dislike” the video.
// Response format: {likes: number} which is the number of likes on the post. This api should return an error if the new “value” is the same as was already previously set.

router.post("/api/like", async (req, res) => {
  const user_id = req.session.username;
  const { id, value } = req.body;
  const interaction = await interaction_table.findOne({
    user_id,
    video_id: id,
  });

  if (interaction) {
    // console.log("interaction.value:", interaction.value);
    // console.log("value:", value);
    // console.log("Equal:", interaction.value === value);
    if (interaction.value === value) {
      console.log("User already liked/disliked this video");
      return res.status(200).json({
        status: "ERROR",
        error: true,
        message: "User already liked/disliked this video",
      });
    }

    interaction.value = value;
    await interaction.save();
  } else {
    const newInteraction = new interaction_table({
      user_id,
      video_id: id,
      value: value,
    });

    await newInteraction.save();
  }

  const likes = await interaction_table.countDocuments({
    video_id: id,
    value: true,
  });

  res.status(200).json({ status: "OK", likes });
});

router.post("/api/view", async (req, res) => {
  const video_id = req.body.id;
  console.log("viewing " + video_id);

  const user_id = req.session.username;

  let prev_viewed = false;

  const result = await view_table.findOne({ user_id, video_id });
  if (result) {
    console.log("old entry: " + result);
    console.log("entry found with prev_viewed " + result.viewed);
    prev_viewed = result.viewed;
  }
  view_table
    .updateOne(
      { user_id, video_id }, // Filter: Find by user_id and video_id
      { $set: { viewed: true } }, // Update: Set watched status
      { upsert: true } // Option: Insert if not found
    )
    .then((result) => {
      if (result.upsertedCount > 0) {
        // console.log("New document created with ID:", result.upserted[0]._id);
      } else {
        // console.log("Document updated.");
      }
    })
    .catch((error) => {
      // console.error("Error:", error);
    });
  console.log(prev_viewed);
  res.status(200).json({ status: "OK", viewed: prev_viewed });
});

module.exports = router;
