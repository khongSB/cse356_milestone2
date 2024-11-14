const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 80;
const groupID = "66ec8b14f0bdfe0b614224f9";
const mongoURI = "mongodb://localhost:27017/CSE356";

const userRouter = require("./routes/userRouter.js");
const mediaRouter = require("./routes/mediaRouter.js");

mongoose.connect(mongoURI);
const db = mongoose.connection;

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

const REACT_APP_PATH = "/root/milestone2/frontend/dist/index.html";

// Middleware to check if the user is authenticated
const requireLogin = (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect(
      302,
      "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/login"
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
    "/root/milestone2/media/processed-media",
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

app.get("/fetchThumbnails.js", (req, res) => {
  res.sendFile("/root/milestone2/fetchThumbnails.js");
});

app.get("/assets/*", (req, res) => {
  // console.log("attempting to serve: " + req.params[0]);
  const filePath = "/root/milestone2/frontend/dist/assets/" + req.params[0]; // Gets the requested file from root
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