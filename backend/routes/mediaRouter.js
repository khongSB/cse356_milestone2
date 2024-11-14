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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


//----------------------------------------------------------------------------

router.post("/api/videos", (req, res) => {
  const count = req.body.count;
  const filePath = "/root/milestone2/media/m2.json";

  const videoData = JSON.parse(fs.readFileSync(filePath));

  //console.log(videoData);
  //console.log(Object.entries(videoData));
  //console.log(Object.entries(videoData).slice(0, count));
  // Slice the video entries to get only the requested number
  const selectedVideos = shuffleArray(Object.entries(videoData))
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

// const express = require("express");
// const fs = require("fs");
// const shuffleArray = require("lodash.shuffle"); // Assuming you have a shuffle function like lodash's shuffle
// const UploadedVideo = require("./models/uploaded-video"); // Update with correct path
// const User = require("./models/user"); // Update with correct path

// async function getUserRatings(username) {
//   const likedVideos = await UploadedVideo.find({ 'likes.userId': username });
//   const ratings = {};
//   likedVideos.forEach(video => {
//     const likeEntry = video.likes.find(like => like.userId === username);
//     if (likeEntry) {
//       ratings[video.video_id] = likeEntry.value ? 1 : -1;
//     }
//   });
//   return ratings;
// }

// async function getUserViews(username) {
//   const viewedVideos = await UploadedVideo.find({ 'views.userId': username });
//   return viewedVideos.map(video => video.video_id);
// }

// function computeCosineSimilarity(ratingsA, ratingsB) {
//   const commonVideos = Object.keys(ratingsA).filter(videoId => videoId in ratingsB);
//   if (commonVideos.length === 0) return 0;

//   let dotProduct = 0;
//   let magnitudeA = 0;
//   let magnitudeB = 0;

//   commonVideos.forEach(videoId => {
//     const ratingA = ratingsA[videoId];
//     const ratingB = ratingsB[videoId];
//     dotProduct += ratingA * ratingB;
//     magnitudeA += ratingA * ratingA;
//     magnitudeB += ratingB * ratingB;
//   });

//   magnitudeA = Math.sqrt(magnitudeA);
//   magnitudeB = Math.sqrt(magnitudeB);

//   return magnitudeA === 0 || magnitudeB === 0 ? 0 : dotProduct / (magnitudeA * magnitudeB);
// }

// async function predictRatings(activeUserRatings, topUsers) {
//   const predictedRatings = {};

//   for (const { username, similarity } of topUsers) {
//     const userRatings = await getUserRatings(username);
//     for (const [videoId, rating] of Object.entries(userRatings)) {
//       if (!(videoId in activeUserRatings)) {
//         if (!(videoId in predictedRatings)) {
//           predictedRatings[videoId] = { weightedSum: 0, sumOfWeights: 0 };
//         }
//         predictedRatings[videoId].weightedSum += similarity * rating;
//         predictedRatings[videoId].sumOfWeights += Math.abs(similarity);
//       }
//     }
//   }

//   for (const videoId in predictedRatings) {
//     const { weightedSum, sumOfWeights } = predictedRatings[videoId];
//     predictedRatings[videoId] = sumOfWeights !== 0 ? (weightedSum / sumOfWeights) : 0;
//   }

//   return predictedRatings;
// }

// async function selectTopVideos(predictedRatings, activeUserViews, count) {
//   const videoIds = Object.keys(predictedRatings);
//   const unviewedVideoIds = videoIds.filter(videoId => !activeUserViews.includes(videoId));
//   unviewedVideoIds.sort((a, b) => predictedRatings[b] - predictedRatings[a]);

//   return unviewedVideoIds.slice(0, count);
// }

// async function formatVideosResponse(videoIds, activeUsername) {
//   const videos = await UploadedVideo.find({ video_id: { $in: videoIds } });
//   return videos.map(video => {
//     const userLikeEntry = video.likes.find(like => like.userId === activeUsername);
//     const liked = userLikeEntry ? (userLikeEntry.value === true) : null;
//     const watched = video.views.some(view => view.userId === activeUsername);

//     return {
//       id: video.video_id,
//       title: video.title,
//       description: '', // Adjust if a description field is present
//       watched,
//       liked,
//       likevalues: video.likes.filter(like => like.value === true).length,
//     };
//   });
// }

// router.post("/api/videos", async (req, res) => {
//   const count = req.body.count;
//   const activeUsername = req.session.username;
//   const N = 5;

//   if (!count) {
//     return res.status(200).json({ status: "ERROR", error: true, message: "Missing count parameter" });
//   }

//   try {
//     const activeUserRatings = await getUserRatings(activeUsername);
//     const activeUserViews = await getUserViews(activeUsername);

//     const otherUsers = await User.find({ username: { $ne: activeUsername } });
//     const similarities = [];

//     for (const user of otherUsers) {
//       const otherUserRatings = await getUserRatings(user.username);
//       const similarity = computeCosineSimilarity(activeUserRatings, otherUserRatings);
//       if (similarity > 0) {
//         similarities.push({ username: user.username, similarity });
//       }
//     }

//     similarities.sort((a, b) => b.similarity - a.similarity);
//     const topUsers = similarities.slice(0, N);

//     const predictedRatings = await predictRatings(activeUserRatings, topUsers);
//     const recommendedVideoIds = await selectTopVideos(predictedRatings, activeUserViews, count);
//     const responseVideos = await formatVideosResponse(recommendedVideoIds, activeUsername);

//     return res.status(200).json({ status: "OK", videos: responseVideos });
//   } catch (e) {
//     console.error("Error in /api/videos:", e);
//     return res.status(500).json({ status: "ERROR", error: true, message: e.message });
//   }
// });




//----------------------------------------------------------------------------

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
