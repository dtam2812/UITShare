const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  sellerAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"],
  },

  contractAddress: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"],
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
    index: true,
  },

  tokenId: {
    type: String,
    required: true,
    index: true,
  },

  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  listTxHash: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },

  isOriginalCreator: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["active", "sold", "cancelled"],
    default: "active",
    index: true,
  },

  listedAt: {
    type: Date,
    default: Date.now,
  },

  soldAt: {
    type: Date,
    default: null,
  },

  cancelledAt: {
    type: Date,
    default: null,
  },
});

// Find all active listings for a single document
// → Used on the DocumentDetail page to display current sellers
ListingSchema.index({ document: 1, status: 1 });

// Find all active listings for a single seller
// → Used on the Profile page under "Documents for Sale"
ListingSchema.index({ seller: 1, status: 1 });

// Find active listing by tokenId
// → Used when syncing with the blockchain by tokenId
ListingSchema.index({ tokenId: 1, status: 1 });

// Find the most recent listings (marketplace page, sorted by time)
ListingSchema.index({ status: 1, listedAt: -1 });

module.exports = mongoose.model("Listing", ListingSchema);
