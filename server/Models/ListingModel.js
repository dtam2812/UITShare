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

// Tìm tất cả listing đang active của 1 tài liệu
// → Dùng ở trang DocumentDetail để hiển thị danh sách người đang bán
ListingSchema.index({ document: 1, status: 1 });

// Tìm tất cả listing đang active của 1 seller
// → Dùng ở trang Profile > "Tài liệu đang bán"
ListingSchema.index({ seller: 1, status: 1 });

// Tìm listing theo tokenId đang active
// → Dùng khi cần đồng bộ với blockchain theo tokenId
ListingSchema.index({ tokenId: 1, status: 1 });

// Tìm listing mới nhất (trang marketplace, sắp xếp theo thời gian)
ListingSchema.index({ status: 1, listedAt: -1 });

module.exports = mongoose.model("Listing", ListingSchema);
