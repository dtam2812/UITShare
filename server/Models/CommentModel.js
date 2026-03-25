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

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
