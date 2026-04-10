const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  // IPFS
  fileUrl: { type: String, required: true },
  cid: { type: String, required: true },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorWallet: { type: String },

  subject: { type: String, required: true },
  category: {
    type: String,
    enum: ["exam", "slide", "assignment", "project"],
    required: true,
  },

  price: { type: Number, default: 0 },
  accessType: {
    type: String,
    enum: ["free", "paid", "nft-gated"],
    default: "free",
  },

  royaltyPercent: { type: Number, default: 10 },
  royaltyReceiver: { type: String },

  tokenId: { type: Number, unique: true, sparse: true },
  contractAddress: { type: String },
  isMinted: { type: Boolean, default: false },
  totalSupply: { type: Number, default: 0 },
  amount: { type: Number, default: 1, min: 1 },

  orderId: { type: Number, default: null },
  isListed: { type: Boolean, default: false },

  downloadCount: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },

  pageCount: { type: Number, default: null },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
