const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  tokenId: { type: String, trim: true },
  amount: { type: Number, default: 1 },
  ownerAddress: { type: String, lowercase: true },
  createdAt: { type: Date, default: Date.now },
});

NFTSchema.index({ user: 1, tokenId: 1 }, { unique: true });

module.exports = mongoose.model("NFT", NFTSchema);
