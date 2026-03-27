const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true }, // Link tải file (thường là private S3 hoặc IPFS)
  cid: { type: String }, // Content ID trên IPFS để lưu vào Metadata NFT

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subject: String,
  price: { type: Number, default: 0 }, // Giá niêm yết (đơn vị ETH)

  accessType: {
    type: String,
    enum: ["free", "paid", "nft-gated"],
    default: "free",
  },

  // Kết nối với Blockchain
  tokenId: { type: Number, unique: true, sparse: true },
  contractAddress: String,
  isMinted: { type: Boolean, default: false },

  totalSupply: { type: Number, default: 0 }, // Tổng số lượng NFT được tạo ra (Max Supply)
  downloadCount: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 }, // Tổng ETH nhận được từ Donate

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
