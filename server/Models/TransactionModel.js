const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },

  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },

  fromAddress: {
    type: String,
    lowercase: true,
    trim: true,
  },

  toAddress: {
    type: String,
    lowercase: true,
    trim: true,
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    index: true,
  },

  lisitingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },

  tokenId: {
    type: String,
  },

  orderId: {
    type: String,
  },

  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },

  price: {
    type: Number,
    default: 0,
    min: 0,
  },

  marketplaceFee: {
    type: Number,
    default: 0,
    min: 0,
  },

  royaltyPaid: {
    type: Number,
    default: 0,
    min: 0,
  },

  sellerReceived: {
    type: Number,
    default: 0,
    min: 0,
  },

  isSecondary: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    enum: ["mint", "list", "cancel", "buy", "transfer", "donate"],
    required: true,
    index: true,
  },

  donateMessage: {
    type: String,
    maxlength: 200,
    default: null,
  },

  txHash: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  blockNumber: {
    type: Number,
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "success",
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});
TransactionSchema.index({ document: 1, createdAt: -1 });

// Lịch sử giao dịch của 1 user (từ cả hai phía mua và bán)
TransactionSchema.index({ fromUser: 1, createdAt: -1 });
TransactionSchema.index({ toUser: 1, createdAt: -1 });

// Lọc theo type + status — dùng cho admin dashboard
TransactionSchema.index({ type: 1, status: 1, createdAt: -1 });

// Tính doanh thu của author theo tài liệu
// → DonateModel.aggregate / TransactionModel.aggregate
TransactionSchema.index({ document: 1, type: 1, status: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
