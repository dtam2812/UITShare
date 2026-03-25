const mongoose = require("mongoose");

const NFTSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },

  tokenId: Number,

  amount: { type: Number, default: 1 },

  transactionHash: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NFTModel = mongoose.model("NFT", NFTSchema);

module.exports = NFTModel;
