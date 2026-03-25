const mongoose = require("mongoose");

const DocumentSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  fileUrl: { type: String, required: true },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subject: String,

  price: { type: Number, default: 0 },

  accessType: {
    type: String,
    enum: ["free", "paid", "nft-gated"],
    default: "free",
  },

  tokenId: Number,
  contractAddress: String,

  totalSupply: { type: Number, default: 0 },

  downloadCount: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DocumentModel = mongoose.model("Document", DocumentSchema);

module.exports = DocumentModel;
