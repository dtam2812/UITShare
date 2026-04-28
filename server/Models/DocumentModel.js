const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  subject: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    enum: ["exam", "slide", "assignment", "project"],
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  // IPFS Content Identifier — unique to prevent duplicate file uploads
  cid: {
    type: String,
    required: true,
    unique: true,
  },

  // SHA-256 hash of the original file — duplicate check before uploading to IPFS
  // Detects identical files even if they are renamed
  fileHash: {
    type: String,
    index: true,
    sparse: true,
  },

  pageCount: {
    type: Number,
    default: null,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  authorWallet: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"],
  },

  price: {
    type: Number,
    default: 0,
    min: 0,
  },

  royaltyPercent: {
    type: Number,
    default: 10,
    min: 0,
    max: 50,
  },

  royaltyReceiver: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"],
  },

  tokenId: {
    type: String,
    unique: true,
    sparse: true,
  },

  contractAddress: {
    type: String,
    lowercase: true,
    trim: true,
  },

  isMinted: {
    type: Boolean,
    default: false,
  },

  totalSupply: {
    type: Number,
    default: 0,
    min: 0,
  },

  remainingSupply: {
    type: Number,
    default: 0,
    min: 0,
  },

  downloadCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DocumentSchema.index({ title: "text", subject: "text" });

DocumentSchema.index({ author: 1, createdAt: -1 });

DocumentSchema.index({ category: 1, accessType: 1 });

module.exports = mongoose.model("Document", DocumentSchema);
