const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 5200;
const groupID = "66ec8b14f0bdfe0b614224f9";
const mongoURI = "mongodb://data:27017/CSE356";

const userRouter = require("./routes/userRouter.js");
const mediaRouter = require("./routes/mediaRouter.js");

mongoose.connect(mongoURI);
const db = mongoose.connection;

const { exec } = require('child_process');
const fs = require("fs");

const uploaded_video_table = require("./models/uploaded-video");

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
})

// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 30, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Add X-CSE356 header
app.use((req, res, next) => {
  res.header("X-CSE356", groupID);
  next();
});

// Configure express-session with MongoStore
app.use(
  session({
    name: "token", // changes name of cookie
    secret: "bubbleguppies",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI }),
    cookie: {
      maxAge: null, // 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Parse json payloads
app.use(express.json());
// Parse post forms
app.use(express.urlencoded({ extended: true }));

const REACT_APP_PATH = "/usr/src/app/frontend/dist/index.html"; //"*"

// Middleware to check if the user is authenticated
const requireLogin = (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect(
      302,
      "https://bubbleguppies.cse356.compas.cs.stonybrook.edu/login"
    );
  }
  next(); // Continue to the next middleware or route handler if authenticated
};

// Middleware to log request information
app.use((req, res, next) => {
  console.log("--- Request Information ---");
  console.log("Method:", req.method); // HTTP method (GET, POST, etc.)
  console.log("URL:", req.originalUrl); // Requested URL
  console.log("Headers:", req.headers); // Request headers
  console.log("Query Parameters:", req.query); // Query parameters
  console.log("Body:", req.body); // Request body (requires body-parser middleware)
  console.log("IP Address:", req.ip); // Client IP address
  console.log("Protocol:", req.protocol); // Protocol (http or https)
  console.log("Host:", req.get("host")); // Host header
  console.log("--- End of Request Information ---\n");

  next(); // Call next middleware
});

app.get('/health', (req, res) => {
  res.status(200).send('OK'); // Return a 200 status code with a message
});

// Add user functionality
app.use("", userRouter);
app.use("", mediaRouter);

// Root route - check if user is logged in
app.get("/login", async (req, res) => {
  res.sendFile(REACT_APP_PATH);
});
app.get("/", requireLogin, async (req, res) => {
  res.sendFile(REACT_APP_PATH);
});

// Handle requests to retrieve any file from the root directory
app.get("/media/processed-media/manifests/*", (req, res) => {
  console.log("attempting to serve: " + req.params[0]);
  const filePath = path.join(
    "/usr/src/app/media/processed-media", //"*"
    "manifests",
    req.params[0]
  ); // Gets the requested file from root
  console.log("filepath: " + filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(err.status).end(); // Handle error if file not found
    }
  });
});

// app.get("/fetchThumbnails.js", (req, res) => {
//   res.sendFile("/root/milestone3/fetchThumbnails.js");
// });

app.get("/assets/*", (req, res) => {
  // console.log("attempting to serve: " + req.params[0]);
  const filePath = "/usr/src/app/frontend/dist/assets/" + req.params[0]; // Gets the requested file from root "*"
  console.log(filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(err.status).end(); // Handle error if file not found
    }
  });
});

db.on("error", (err) => {
  console.error("MongoDB Connection Error: " + err);
});
db.once("connected", () => {
  console.log("MongoDB Connection Established");
});

/* Starting server */
app.listen(PORT, () => {
  console.log(`PORT: ${PORT}, Server Running!`);
});
