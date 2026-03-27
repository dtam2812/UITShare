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
  tokenId: Number,
  amount: { type: Number, default: 1 }, // Số lượng bản sao đang sở hữu
  ownerAddress: { type: String, lowercase: true }, // Địa chỉ ví để đối soát nhanh

  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo mỗi User chỉ có 1 record cho 1 tokenId, nếu mua thêm thì tăng amount
NFTSchema.index({ user: 1, tokenId: 1 }, { unique: true });

module.exports = mongoose.model("NFT", NFTSchema);
