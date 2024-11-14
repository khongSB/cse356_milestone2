// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");

// const nodemailer = require("nodemailer");

// const user_table = require("../models/user");

// function generateVerificationKey() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const length = 10;
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

// router.post("/api/adduser", async (req, res) => {
//   console.log("attempting adding new user");
//   const { username, password, email } = req.body;

//   if (!email || !password || !username) {
//     return res.status(200).json({
//       status: "ERROR",
//       error: true,
//       message: "Requires all 3 fields!",
//     });
//   }
//   if (await user_table.findOne({ username })) {
//     console.log("ressing error");
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Duplicate User" });
//   }
//   if (await user_table.findOne({ email })) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Duplicate Email" });
//   }
//   // Create user
//   let key = generateVerificationKey();
//   let user = new user_table({
//     username: username,
//     password: password,
//     email: email,
//     isVerified: false,
//     verificationKey: key,
//   });
//   // Verification + Mailer Stuff
//   const verification_link = `http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/verify?email=${encodeURIComponent(
//     email
//   )}&key=${key}`;
//   // console.log(verification_link);
//   const mail_config = {
//     from: "root@bubbleguppies.cse356.compas.cs.stonybrook.edu",
//     to: email,
//     subject: "Activate your account",
//     text: `${verification_link}`,
//   };
//   const transporter = nodemailer.createTransport({
//     host: "localhost",
//     port: 25,
//     secure: false,
//     tls: { rejectUnauthorized: false },
//   });
//   try {
//     await transporter.sendMail(mail_config);
//   } catch (err) {
//     console.log(err);
//     return res.status(200).json({
//       status: "ERROR",
//       error: true,
//       message: "Email Verification Fail!",
//     });
//   }
//   try {
//     await user.save();
//   } catch (err) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "User Saving Fail!" });
//   }
//   console.log(
//     `| [new user added]: { username: ${username}, password: ${password}, email: ${email}, verif_key: ${key} }`
//   );
//   return res.status(200).json({ status: "OK" });
// });

// router.get("/api/verify", async (req, res) => {
//   let { email, key } = req.query;
//   curr_email = decodeURIComponent(email);

//   if (!curr_email || !key) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Fields Not Filled" });
//   }
//   let user;
//   try {
//     user = await user_table.findOne({ email: curr_email });
//   } catch (err) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Error fetching user" });
//   }

//   if (!user) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "No User found" });
//   }

//   if (user.isVerified) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "User verified before" });
//   }

//   if (key !== user.verificationKey) {
//     return res.status(200).json({
//       status: "ERROR",
//       error: true,
//       message: "Verification Key Invalid",
//     });
//   }

//   user.isVerified = true;
//   try {
//     await user.save();
//   } catch (err) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Verification Failed" });
//   }
//   console.log(`| [new user verified]: ${user.username}`);
//   req.session.isAuth = true;
//   req.session.username = user.username;
//   return res.status(200).json({ status: "OK" });
// });

// router.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!password || !username) {
//     return res.status(200).json({
//       status: "ERROR",
//       error: true,
//       message: "Requires all 2 fields!",
//     });
//   }

//   const curr_user = await user_table.findOne({ username });
//   if (!curr_user) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "User DNE" });
//   }

//   if (!curr_user.isVerified) {
//     return res.status(200).json({
//       status: "ERROR",
//       error: true,
//       message: "User needs to be verified",
//     });
//   }

//   if (curr_user.password !== password) {
//     return res
//       .status(200)
//       .json({ status: "ERROR", error: true, message: "Password Invalid" });
//   }

//   req.session.isAuth = true;
//   req.session.username = username;

//   // Create a JWT payload
//   const payload = {
//     user: username
//   };
//   const token = jwt.sign(payload, "skibidi", { expiresIn: "1h" });
//   console.log(`| [logged in]: ${username}`);
//   console.log("token: ", token);
//   return res.status(200).json({ status: "OK", token: token});
// });

// router.post("/api/logout", async (req, res) => {
//   if (req.session.isAuth) {
//     let username = req.session.username;
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: "Logout failed" });
//       }
//       res.clearCookie("token"); // Clear the cookie
//       console.log(`| [logged out]: ${username}`);
//       return res.status(200).json({ message: "Logged out successfully" });
//     });
//   } else {
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: "Session destruction failed" });
//       }
//       res.clearCookie("token"); // Clear the cookie
//       console.log(`| [session destroyed]:`);
//       return res
//         .status(200)
//         .json({ message: "Session destroyed successfully" });
//     });
//   }
// });

// router.get('/api/isloggedin', (req, res) => {
//   if (req.session.username) {
//       return res.status(200).json({ status: 'OK', userId: req.session.username });
//   }
//   return res.status(200).json({ status: 'ERROR', error: true, message: 'You are not logged in' });
// });

// router.post("/api/check-auth", async (req, res) => {
//   if (req.session.isAuth) {
//     return res
//       .status(200)
//       .json({ isLoggedIn: true, userId: req.session.username });
//   }
//   return res.status(200).json({ status: 'ERROR', error: true, message: 'You are not logged in' });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const user_table = require("../models/user");

function generateVerificationKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

router.post("/api/adduser", async (req, res) => {
  console.log("attempting adding new user");
  const { username, password, email } = req.body;

  if (!email || !password || !username) {
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "Requires all 3 fields!",
    });
  }
  if (await user_table.findOne({ username })) {
    console.log("ressing error");
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Duplicate User" });
  }
  if (await user_table.findOne({ email })) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Duplicate Email" });
  }

  let key = generateVerificationKey();
  let user = new user_table({
    username: username,
    password: password,
    email: email,
    isVerified: false,
    verificationKey: key,
  });

  const verification_link = `http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/verify?email=${encodeURIComponent(
    email
  )}&key=${key}`;
  const mail_config = {
    from: "root@bubbleguppies.cse356.compas.cs.stonybrook.edu",
    to: email,
    subject: "Activate your account",
    text: `${verification_link}`,
  };
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
  try {
    await transporter.sendMail(mail_config);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "Email Verification Fail!",
    });
  }
  try {
    await user.save();
  } catch (err) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "User Saving Fail!" });
  }
  console.log(
    `| [new user added]: { username: ${username}, password: ${password}, email: ${email}, verif_key: ${key} }`
  );
  return res.status(200).json({ status: "OK" });
});

router.get("/api/verify", async (req, res) => {
  let { email, key } = req.query;
  curr_email = decodeURIComponent(email);

  if (!curr_email || !key) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Fields Not Filled" });
  }
  let user;
  try {
    user = await user_table.findOne({ email: curr_email });
  } catch (err) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Error fetching user" });
  }

  if (!user) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "No User found" });
  }

  if (user.isVerified) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "User verified before" });
  }

  if (key !== user.verificationKey) {
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "Verification Key Invalid",
    });
  }

  user.isVerified = true;
  try {
    await user.save();
  } catch (err) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Verification Failed" });
  }
  console.log(`| [new user verified]: ${user.username}`);
  req.session.isAuth = true;
  req.session.username = user.username;
  return res.status(200).json({ status: "OK" });
});

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!password || !username) {
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "Requires all 2 fields!",
    });
  }

  const curr_user = await user_table.findOne({ username });
  if (!curr_user) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "User DNE" });
  }

  if (!curr_user.isVerified) {
    return res.status(200).json({
      status: "ERROR",
      error: true,
      message: "User needs to be verified",
    });
  }

  if (curr_user.password !== password) {
    return res
      .status(200)
      .json({ status: "ERROR", error: true, message: "Password Invalid" });
  }

  req.session.isAuth = true;
  req.session.username = username;

  console.log(`| [logged in]: ${username}`);
  return res.status(200).json({ status: "OK" });
});

router.post("/api/logout", async (req, res) => {
  if (req.session.isAuth) {
    let username = req.session.username;
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      console.log(`| [logged out]: ${username}`);
      return res
        .status(200)
        .json({ status: "OK", message: "Logged out successfully" });
    });
  } else {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed" });
      }
      console.log(`| [session destroyed]:`);
      return res
        .status(200)
        .json({ status: "OK", message: "Session destroyed successfully" });
    });
  }
});

router.post("/api/check-auth", async (req, res) => {
  if (req.session.isAuth) {
    return res
      .status(200)
      .json({ isLoggedIn: true, userId: req.session.username });
  }
  return res
    .status(200)
    .json({ status: "ERROR", error: true, message: "You are not logged in" });
});

module.exports = router;
