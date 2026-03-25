const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },

  tokenId: Number,

  price: Number,

  txHash: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
