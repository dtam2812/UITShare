const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },

  content: { type: String, required: true },

  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
