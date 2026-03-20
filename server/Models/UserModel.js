const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userName: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String },

  walletAddress: { type: String, unique: true },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
  },

  avatar: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
