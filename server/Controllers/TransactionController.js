const transactionModel = require("../Models/TransactionModel");
const mongoose = require("mongoose");

const getUserTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 5, sort = "latest", search = "" } = req.query;

    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (parsedPage - 1) * parsedLimit;

    // Lấy các giao dịch mua và transfer liên quan đến user
    const baseQuery = {
      type: { $in: ["buy", "transfer"] },
      $or: [
        { fromUser: new mongoose.Types.ObjectId(userId) },
        { toUser: new mongoose.Types.ObjectId(userId) },
      ],
    };

    const [transactions, total] = await Promise.all([
      transactionModel
        .find(baseQuery)
        .populate("document", "title subject category")
        .populate("fromUser", "userName avatar")
        .populate("toUser", "userName avatar")
        .sort({ createdAt: sort === "latest" ? -1 : 1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      transactionModel.countDocuments(baseQuery),
    ]);

    // Format response
    const formatted = transactions.map((tx) => {
      const isBuyer =
        tx.toUser?._id?.toString() === userId ||
        tx.toAddress?.toLowerCase() === req.userWallet?.toLowerCase();

      const isSeller = tx.fromUser?._id?.toString() === userId;

      let label = "";
      let amountDisplay = "";

      if (tx.type === "buy") {
        if (isBuyer) {
          label = "Mua tài liệu";
          amountDisplay = `- ${tx.price} ETH`;
        } else if (isSeller) {
          label = "Bán tài liệu";
          amountDisplay = `+ ${tx.sellerReceived ?? tx.price} ETH`;
        }
      } else if (tx.type === "transfer") {
        label = isSeller ? "Chuyển tài liệu" : "Nhận tài liệu";
        amountDisplay = `${tx.quantity} NFT`;
      }

      return {
        txHash: tx.txHash,
        type: label,
        detail: tx.document?.title ?? "—",
        subject: tx.document?.subject ?? "",
        date: new Date(tx.createdAt).toLocaleDateString("vi-VN"),
        amount: amountDisplay,
        status:
          tx.status === "success"
            ? "Thành công"
            : tx.status === "pending"
              ? "Đang xử lý"
              : "Thất bại",
        fromUser: tx.fromUser,
        toUser: tx.toUser,
        blockNumber: tx.blockNumber,
      };
    });

    // Lọc theo search nếu có
    const searched = search
      ? formatted.filter(
          (tx) =>
            tx.txHash?.toLowerCase().includes(search.toLowerCase()) ||
            tx.detail?.toLowerCase().includes(search.toLowerCase()) ||
            tx.type?.toLowerCase().includes(search.toLowerCase()),
        )
      : formatted;

    return res.status(200).json({
      transactions: searched,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("[getUserTransactions]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = { getUserTransactions };
