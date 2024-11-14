const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationKey: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
