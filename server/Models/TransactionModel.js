const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },

  tokenId: Number,
  orderId: Number, // ID từ Smart Contract Marketplace
  price: Number, // Giá tại thời điểm giao dịch (ETH)
  quantity: { type: Number, default: 1 },

  txHash: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["mint", "buy", "list", "cancel"],
    default: "buy",
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "success",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
