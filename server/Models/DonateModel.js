const mongoose = require("mongoose");

const DonateSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },

  amount: { type: Number, required: true },

  txHash: { type: String, required: true },

  message: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DonateModel = mongoose.model("Donate", DonateSchema);

module.exports = DonateModel;
