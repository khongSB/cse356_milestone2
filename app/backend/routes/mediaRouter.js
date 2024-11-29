const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Minio = require("minio");
const multer = require("multer");
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Uploading file to /usr/src/app/media"); // Add this line to check
    cb(null, "/usr/src/app/media"); // Specify your directory here
  },
  filename: (req, file, cb) => {
    console.log(`File uploaded: ${file.originalname}`);
    cb(null, file.originalname); // Retain the extension
  },
});

const upload = multer({ storage: storage });

const { exec } = require("child_process");

const interaction_table = require("../models/interaction");
const view_table = require("../models/view");
const uploaded_video_table = require("../models/uploaded-video");
const User = require("../models/user");
const MEDIA_PATH = "/usr/src/app/media/processed-media"; //"*"

// Configure MinIO Client
const minioClient = new Minio.Client({
  endPoint: "10.0.1.163",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "password",
});

// MinIO bucket name
const BUCKET_NAME = "processed-media";

// Ensure the bucket exists
minioClient.bucketExists(BUCKET_NAME, (err, exists) => {
  if (err) {
    console.error("Error checking bucket:", err);
    return;
  }

  if (exists) {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  } else {
    console.log(`Bucket "${BUCKET_NAME}" does not exist. Creating now...`);
    minioClient.makeBucket(BUCKET_NAME, "us-east-1", (err) => {
      if (err) {
        console.error("Error creating bucket:", err);
      } else {
        console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
      }
    });
  }
});

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     // Generate a random index from 0 to i
//     const j = Math.floor(Math.random() * (i + 1));
//     // Swap elements array[i] and array[j]
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// Load videos from m2.json
const filePath = "/usr/src/app/media/m2.json"; //"*"
let videoData = {};
try {
  videoData = JSON.parse(fs.readFileSync(filePath));
} catch (error) {
  console.error("Failed to load m2.json:", error);
}

// Helper function to get user ratings from interactions
async function getUserRatings(userId) {
  const interactions = await interaction_table.find({ user_id: userId });
  const ratings = {};
  interactions.forEach((interaction) => {
    ratings[interaction.video_id] = interaction.value ? 1 : -1; // Like as +1, Dislike as -1
  });
  return ratings;
}

// Helper function to get viewed videos from views
async function getUserViews(userId) {
  const views = await view_table.find({ user_id: userId });
  return views.map((view) => view.video_id);
}

// Cosine similarity function
function computeCosineSimilarity(ratingsA, ratingsB) {
  const commonVideos = Object.keys(ratingsA).filter(
    (videoId) => videoId in ratingsB
  );
  if (commonVideos.length === 0) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  commonVideos.forEach((videoId) => {
    const ratingA = ratingsA[videoId];
    const ratingB = ratingsB[videoId];
    dotProduct += ratingA * ratingB;
    magnitudeA += ratingA * ratingA;
    magnitudeB += ratingB * ratingB;
  });

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  return magnitudeA === 0 || magnitudeB === 0
    ? 0
    : dotProduct / (magnitudeA * magnitudeB);
}

// Predict ratings based on top similar users
async function predictRatings(activeUserRatings, topUsers) {
  const predictedRatings = {};

  for (const { userId, similarity } of topUsers) {
    const userRatings = await getUserRatings(userId);
    for (const [videoId, rating] of Object.entries(userRatings)) {
      if (!(videoId in activeUserRatings)) {
        if (!(videoId in predictedRatings)) {
          predictedRatings[videoId] = { weightedSum: 0, sumOfWeights: 0 };
        }
        predictedRatings[videoId].weightedSum += similarity * rating;
        predictedRatings[videoId].sumOfWeights += Math.abs(similarity);
      }
    }
  }

  for (const videoId in predictedRatings) {
    const { weightedSum, sumOfWeights } = predictedRatings[videoId];
    predictedRatings[videoId] =
      sumOfWeights !== 0 ? weightedSum / sumOfWeights : 0;
  }

  return predictedRatings;
}

// Select top videos from predicted ratings
async function selectTopVideos(predictedRatings, activeUserViews, count) {
  const videoIds = Object.keys(predictedRatings);
  const unviewedVideoIds = videoIds.filter(
    (videoId) => !activeUserViews.includes(videoId)
  );
  unviewedVideoIds.sort((a, b) => predictedRatings[b] - predictedRatings[a]);

  // If more videos are needed, add some from m2.json
  let recommendedVideoIds = unviewedVideoIds.slice(0, count);

  if (recommendedVideoIds.length < count) {
    const needed = count - recommendedVideoIds.length;
    const additionalVideoIds = Object.keys(videoData)
      .filter(
        (id) =>
          !recommendedVideoIds.includes(id.replace(".mp4", "")) &&
          !activeUserViews.includes(id.replace(".mp4", ""))
      )
      .slice(0, needed);

    recommendedVideoIds = recommendedVideoIds.concat(additionalVideoIds);
  }

  console.log("recommended videos: " + JSON.stringify(recommendedVideoIds));
  return recommendedVideoIds;
}

// Format videos for response
async function formatVideosResponse(videoIds, activeUserId) {
  const uploadedVideos = await uploaded_video_table.find({
    video_id: { $in: videoIds },
  });
  const uploadedVideoMap = uploadedVideos.reduce((acc, video) => {
    acc[video.video_id] = {
      id: video.video_id,
      title: video.title,
      description: video.description || "",
      fromUpload: true,
    };
    return acc;
  }, {});

  return videoIds
    .map((videoId) => {
      if (uploadedVideoMap[videoId]) {
        return uploadedVideoMap[videoId];
      } else if (videoData[videoId]) {
        return {
          id: videoId.replace(".mp4", ""),
          title: videoId,
          description: videoData[videoId],
          fromUpload: false,
        };
      }
      return null;
    })
    .filter((video) => video !== null);
}

// Main recommendation endpoint
router.post("/api/videos", async (req, res) => {
  console.log("| [recommendation]: start");
  const { videoId } = req.body;
  const count = req.body.count;
  const activeUserId = req.session.username;
  const numTopUsersConsidered = 5;

  if (!count) {
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "Missing count parameter",
    });
  }

  console.log("| [recommendation]: count:" + count + " videoId:" + videoId);

  if (!videoId) {
    console.log("| [recommendation]: old rec system");

    try {
      const activeUserRatings = await getUserRatings(activeUserId);
      const activeUserViews = await getUserViews(activeUserId);

      console.log(activeUserViews);

      const otherUsers = await User.find({ user_id: { $ne: activeUserId } });
      const similarities = [];

      for (const user of otherUsers) {
        const otherUserRatings = await getUserRatings(user.user_id);
        const similarity = computeCosineSimilarity(
          activeUserRatings,
          otherUserRatings
        );
        if (similarity > 0) {
          similarities.push({ userId: user_id, similarity });
        }
      }

      similarities.sort((a, b) => b.similarity - a.similarity);
      const topUsers = similarities.slice(0, numTopUsersConsidered);

      const predictedRatings = await predictRatings(
        activeUserRatings,
        topUsers
      );
      const recommendedVideoIds = await selectTopVideos(
        predictedRatings,
        activeUserViews,
        count
      );
      const responseVideos = await formatVideosResponse(
        recommendedVideoIds,
        activeUserId
      );

      return res.status(200).json({ status: "OK", videos: responseVideos });
    } catch (e) {
      console.error("Error in /api/videos:", e);
      return res
        .status(500)
        .json({ status: "ERROR", error: true, message: e.message });
    }
  } else {
    try {
      console.log("| [recommendation]: videoId:" + videoId + "new rec system");

      // Retrieve all interactions for the specified video
      const interactionsForVideo = await interaction_table.find({
        video_id: videoId,
      });
      const userIdsForVideo = interactionsForVideo.map(
        (interaction) => interaction.user_id
      );

      // Retrieve all interactions for these users
      const allInteractionsForUsers = await interaction_table.find({
        user_id: { $in: userIdsForVideo },
      });

      // Group interactions by video
      const videoInteractionMap = {};
      allInteractionsForUsers.forEach((interaction) => {
        if (!videoInteractionMap[interaction.video_id]) {
          videoInteractionMap[interaction.video_id] = [];
        }
        videoInteractionMap[interaction.video_id].push(interaction);
      });

      // Compute similarity scores for each video
      const similarityScores = {};
      const targetVideoInteractions = videoInteractionMap[videoId] || [];

      for (const [otherVideoId, interactions] of Object.entries(
        videoInteractionMap
      )) {
        if (otherVideoId === videoId) continue;

        // Compare interaction patterns between the target video and this video
        const targetLikes = new Set(
          targetVideoInteractions
            .filter((interaction) => interaction.value === true)
            .map((interaction) => interaction.user_id)
        );

        const otherLikes = new Set(
          interactions
            .filter((interaction) => interaction.value === true)
            .map((interaction) => interaction.user_id)
        );

        // Calculate Jaccard similarity for simplicity
        const intersection = new Set(
          [...targetLikes].filter((x) => otherLikes.has(x))
        );
        const union = new Set([...targetLikes, ...otherLikes]);
        const similarity = union.size > 0 ? intersection.size / union.size : 0;

        similarityScores[otherVideoId] = similarity;
      }

      // Sort videos by similarity score
      const sortedSimilarVideos = Object.keys(similarityScores).sort(
        (a, b) => similarityScores[b] - similarityScores[a]
      );

      // Check which videos are already watched by the user
      const activeUserViews = await getUserViews(req.session.username);

      // Filter out already watched videos
      const unviewedVideos = sortedSimilarVideos.filter(
        (videoId) => !activeUserViews.includes(videoId)
      );

      // Limit recommendations to the count requested
      const recommendedVideoIds = unviewedVideos.slice(0, count);

      // Format the video data for the response
      const formattedVideos = await Promise.all(
        recommendedVideoIds.map(async (videoId) => {
          const likedInteraction = await interaction_table.findOne({
            user_id: req.session.username,
            video_id: videoId,
          });
          const liked = likedInteraction ? likedInteraction.value : null;

          const uploadedVideo = await uploaded_video_table.findOne({
            video_id: videoId,
          });
          const title = uploadedVideo?.title || "Untitled";
          const description = uploadedVideo?.description || "No description";

          const likeValues = await interaction_table.countDocuments({
            video_id: videoId,
            value: true,
          });

          return {
            id: videoId,
            title,
            description,
            watched: false, // By definition, these videos are unviewed
            liked,
            likevalues: likeValues,
          };
        })
      );

      console.log(
        "| [recommendation]: new rec system return: " +
          JSON.stringify(recommendedVideoIds)
      );
      return res.status(200).json({ status: "OK", videos: formattedVideos });
    } catch (e) {
      console.error("Error in /api/videos:", e);
      return res
        .status(500)
        .json({ status: "ERROR", error: true, message: e.message });
    }
  }
});

//----------------------------------------------------------------------------

// Added bc stupid grading script
// router.get("/media/:file", (req, res) => {
//   res.sendFile(path.join(MEDIA_PATH, "manifests", req.params.file), (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//       res.status(err.status).end();
//     }
//   });
// });
router.get("/media/:file", (req, res) => {
  const fileName = req.params.file;
  const manifestPath = `manifests/${fileName}`; // Construct the manifest file path in MinIO

  // Use MinIO client to get the manifest file
  minioClient.getObject(BUCKET_NAME, manifestPath, (err, stream) => {
    if (err) {
      console.error("Error retrieving manifest from MinIO:", err);
      return res
        .status(500)
        .json({ status: "ERROR", message: "Error retrieving file from MinIO" });
    }

    // Set appropriate headers for manifest file
    stream.pipe(res); // Pipe the stream directly to the response
  });
});

router.get("/api/manifest/:id", async (req, res) => {
  // Get the video ID or file name from the request parameters
  const videoId = req.params.id;

  // Determine if an .mpd manifest or a specific file is being requested
  const isMpdRequired = !videoId.includes(".");
  const fileName = isMpdRequired ? `${videoId}.mpd` : videoId;

  // Construct the MinIO object path
  const key = `manifests/${fileName}`;
  console.log("Fetching manifest or segment from MinIO:", key);

  try {
    // Check if the requested object exists in MinIO
    const exists = await minioClient.statObject(BUCKET_NAME, key);

    if (exists) {
      // Stream the file from MinIO to the response
      minioClient.getObject(BUCKET_NAME, key, (err, stream) => {
        if (err) {
          console.error("Error streaming manifest/segment:", err);
          res.status(500).json({ error: "Failed to fetch manifest/segment" });
          return;
        }

        // Set appropriate headers based on file type
        if (fileName.endsWith(".mpd")) {
          res.setHeader("Content-Type", "application/dash+xml");
        } else if (fileName.endsWith(".m4s")) {
          res.setHeader("Content-Type", "video/mp4");
        } else {
          res.setHeader("Content-Type", "application/octet-stream");
        }

        // Pipe the stream to the response
        stream.pipe(res);
      });
    }
  } catch (error) {
    console.error("Error retrieving manifest or segment:", error);
    res.status(404).json({ error: "Manifest or segment not found" });
  }
});

router.get("/api/thumbnail/:id", async (req, res) => {
  // const fileName = req.params.id + ".jpg";
  // const filePath = path.join(MEDIA_PATH, "thumbnails", fileName);
  // console.log("sending: " + filePath);
  // res.setHeader("Content-Type", "image/jpeg");
  // res.sendFile(filePath);
  const fileName = req.params.id + ".jpg";
  const key = `thumbnails/${fileName}`;

  console.log("Fetching thumbnail from MinIO:", key);

  try {
    // Check if the thumbnail exists in MinIO
    const exists = await minioClient.statObject(BUCKET_NAME, key);

    if (exists) {
      // Stream the file from MinIO
      res.setHeader("Content-Type", "image/jpeg");
      minioClient.getObject(BUCKET_NAME, key, (err, stream) => {
        if (err) {
          console.error("Error streaming thumbnail:", err);
          res.status(500).json({ error: "Failed to fetch thumbnail" });
          return;
        }

        // Pipe the stream to the response
        stream.pipe(res);
      });
    }
  } catch (error) {
    console.error("Error retrieving thumbnail:", error);
    res.status(404).json({ error: "Thumbnail not found" });
  }
});

router.get("/play/:id", (req, res) => {
  res.sendFile("/usr/src/app/frontend/dist/index.html"); //"*"
});

router.get("/random-video", (req, res) => {
  const filePath = "/usr/src/app/media/m2.json"; //"*"
  const videoData = JSON.parse(fs.readFileSync(filePath));

  const videoTitles = Object.keys(videoData);
  const randomTitle =
    videoTitles[Math.floor(Math.random() * videoTitles.length)];
  const videoId = randomTitle.replace(".mp4", "");

  res.json({ id: videoId });
});

router.get("/upload", (req, res) => {
  res.sendFile("/usr/src/app/frontend/dist/index.html"); //"*"
});

const { spawn } = require("child_process");

router.post("/api/upload", upload.single("mp4File"), async (req, res) => {
  const { user_id, video_id } = {
    user_id: req.session.username,
    video_id: path.basename(req.file.path).replace(".mp4", ""),
  };

  const newUploadedVideo = new uploaded_video_table({
    user_id,
    video_id,
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  });

  try {
    // Saving entry in database
    await newUploadedVideo.save();

    const file = req.file;
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;

    console.log("File:", file);
    console.log("Title:", title);
    console.log("Author:", author);
    console.log("Description:", description);

    const filePath = req.file.path;
    console.log(
      `new file saved as: ${filePath} | title: ${title} | author: ${author} | description: ${description}`
    );

    const fileNameWithoutExt = path.basename(filePath);

    // Using spawn instead of exec
    const process = spawn("python3", ["process_video.py", fileNameWithoutExt], {
      cwd: "/usr/src/app/media", //"*"
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
          const processedMediaPath = "/usr/src/app/media/processed-media";

          // Paths to process
          const manifestsPath = path.join(processedMediaPath, "manifests");
          const thumbnailsPath = path.join(processedMediaPath, "thumbnails");

          // Helper function to upload files filtered by video_id
          const uploadFilteredFiles = async (dirPath, bucketDir) => {
            const files = fs.readdirSync(dirPath).filter(
              (file) => file.startsWith(video_id) // Only include files starting with the video_id
            );

            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const key = `${bucketDir}/${file}`;
              await minioClient.fPutObject(BUCKET_NAME, key, filePath);
              console.log(`Uploaded ${bucketDir}: ${file}`);
            }
          };

          // Upload filtered files from the manifests folder (includes segments)
          await uploadFilteredFiles(manifestsPath, "manifests");

          // Upload filtered thumbnail files
          await uploadFilteredFiles(thumbnailsPath, "thumbnails");

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
