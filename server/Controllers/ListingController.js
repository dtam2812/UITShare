const mongoose = require("mongoose");
const listingModel = require("../Models/ListingModel");

const getActiveListing = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "documentId không hợp lệ" });
    }

    const listing = await listingModel
      .findOne({ document: documentId, status: "active", amount: { $gt: 0 } })
      .select("orderId price amount");

    if (!listing) {
      return res.status(404).json({ message: "Không có listing active" });
    }

    return res.json(listing);
  } catch (err) {
    console.error("[getActiveListing]", err);
    return res.status(500).json({ message: err.message || "Lỗi server" });
  }
};

module.exports = { getActiveListing };
