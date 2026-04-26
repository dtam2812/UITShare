const nftModel = require("../Models/NFTModel");

const getMyNFTs = async (req, res) => {
  try {
    const userId = req.userId;

    const nfts = await nftModel
      .find({ user: userId, amount: { $gt: 0 } })
      .populate("document", "title price royaltyPercent fileUrl");

    return res.json(nfts);
  } catch (error) {
    console.error("[getMyNFTs]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = { getMyNFTs };
