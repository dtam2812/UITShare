const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },

  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },

  studentId: {
    type: Number,
    unique: true,
    sparse: true,
  },

  bio: { type: String },
  facebookLink: { type: String, trim: true },
  avatar: { type: String, default: "" },
  coverImage: { type: String, default: "" },

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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
