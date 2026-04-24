const { ethers } = require("ethers");
const documentModel = require("../Models/DocumentModel");
const listingModel = require("../Models/ListingModel");
const nftModel = require("../Models/NFTModel");
const transactionModel = require("../Models/TransactionModel");
const userModel = require("../Models/UserModel");

//ABI
const MARKETPLACE_ABI = [
  "function addOrder(uint256 tokenId_, uint256 amount_, uint256 price_) external",
  "function cancelOrder(uint256 orderId_) external",
  "function executeOrder(uint256 orderId_) external payable",
  "function transferWithRoyalty(address to_, uint256 tokenId_, uint256 amount_, uint256 transferValue_) external payable",
  "function donateToSeller(address seller_) external payable",
  "function orders(uint256) view returns (address seller, uint256 tokenId, uint256 amount, uint256 price, bool active)",
  "event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price)",
  "event OrderCancelled(uint256 indexed orderId)",
  "event OrderMatched(uint256 indexed orderId, address indexed seller, address indexed buyer, uint256 price, uint256 marketplaceFee, uint256 royaltyAmount)",
  "event TransferWithRoyalty(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount, uint256 royaltyAmount)",
  "event Donated(address indexed donor, address indexed recipient, uint256 amount)",
];

//  Helpers
const getProvider = () =>
  new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

const getBackendSigner = () =>
  new ethers.Wallet(process.env.PRIVATE_KEY, getProvider());

const getMarketplaceContract = (signerOrProvider) =>
  new ethers.Contract(
    process.env.MARKETPLACE_CONTRACT_ADDRESS,
    MARKETPLACE_ABI,
    signerOrProvider,
  );

const parseEventFromReceipt = (receipt, eventName) => {
  const iface = new ethers.Interface(MARKETPLACE_ABI);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === eventName) return parsed.args;
    } catch (_) {}
  }
  return null;
};

// maxAttempts=8, delay=2s → chờ tối đa ~14s
const getReceiptWithRetry = async (
  provider,
  txHash,
  maxAttempts = 8,
  delayMs = 2000,
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) return receipt;
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
};

//  createListing
const createListing = async ({
  sellerId,
  sellerAddress,
  documentId,
  tokenId,
  amount,
  price,
  isOriginalCreator,
}) => {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const marketplace = new ethers.Contract(
    process.env.MARKETPLACE_CONTRACT_ADDRESS,
    MARKETPLACE_ABI,
    signer,
  );

  const priceInWei = ethers.parseEther(String(price));
  const tx = await marketplace.addOrder(tokenId, amount, priceInWei);
  const receipt = await tx.wait();

  const iface = new ethers.Interface(MARKETPLACE_ABI);
  let orderId = null;

  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "OrderAdded") {
        orderId = parsed.args.orderId.toString();
        break;
      }
    } catch (_) {}
  }

  if (!orderId) throw new Error("Không parse được orderId từ event");

  await listingModel.create({
    orderId,
    seller: sellerId,
    sellerAddress,
    document: documentId,
    tokenId,
    amount,
    price,
    isOriginalCreator,
    status: "active",
  });
};

//  buyDocument
const buyDocument = async (req, res) => {
  try {
    const { orderId, txHash } = req.body;
    const buyerId = req.userId;

    if (!orderId || !txHash) {
      return res.status(400).json({ message: "Thiếu orderId hoặc txHash" });
    }

    // 1. Chống replay
    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
    }

    // 2. Kiểm tra listing
    const listing = await listingModel
      .findOne({ orderId, status: "active" })
      .populate("document");
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing không tồn tại hoặc đã hết hàng" });
    }

    // 3. Kiểm tra buyer có ví chưa
    const buyer = await userModel.findById(buyerId);
    if (!buyer?.walletAddress) {
      return res
        .status(400)
        .json({ message: "Bạn cần liên kết ví trước khi mua" });
    }

    // 4. Không cho seller tự mua
    if (
      listing.sellerAddress.toLowerCase() === buyer.walletAddress.toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "Bạn không thể mua listing của chính mình" });
    }

    // 5. Kiểm tra đã sở hữu NFT này chưa
    const existingNFT = await nftModel.findOne({
      user: buyerId,
      tokenId: listing.tokenId,
    });
    if (existingNFT) {
      return res
        .status(400)
        .json({ message: "Bạn đã sở hữu tài liệu này rồi" });
    }

    // 6. Verify transaction trên blockchain (retry để tránh RPC chưa index kịp)
    const provider = getProvider();
    const receipt = await getReceiptWithRetry(provider, txHash);
    if (!receipt) {
      return res.status(400).json({
        message:
          "Không tìm thấy transaction trên blockchain. Vui lòng thử lại sau.",
      });
    }
    if (receipt.status !== 1) {
      return res
        .status(400)
        .json({ message: "Transaction đã thất bại trên blockchain" });
    }

    // 7. Verify tx gọi đúng marketplace contract
    if (
      receipt.to?.toLowerCase() !==
      process.env.MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        message: "Transaction không tương tác với marketplace contract",
      });
    }

    // 8. Verify tx được gửi từ đúng ví của buyer
    const txData = await provider.getTransaction(txHash);
    if (txData?.from?.toLowerCase() !== buyer.walletAddress.toLowerCase()) {
      return res
        .status(403)
        .json({ message: "Transaction không được gửi từ ví của bạn" });
    }

    // 9. Parse event OrderMatched
    const iface = new ethers.Interface(MARKETPLACE_ABI);
    let marketplaceFee = 0n;
    let royaltyPaid = 0n;
    let sellerReceived = 0n;

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (
          parsed?.name === "OrderMatched" &&
          parsed.args.orderId.toString() === String(orderId)
        ) {
          marketplaceFee = parsed.args.marketplaceFee ?? 0n;
          royaltyPaid = parsed.args.royaltyAmount ?? 0n;
          const priceInWei = ethers.parseEther(String(listing.price));
          sellerReceived = priceInWei - marketplaceFee - royaltyPaid;
          break;
        }
      } catch (_) {}
    }

    const document = listing.document;
    const quantityBought = 1;

    // 10. Cập nhật listing amount
    const newAmount = listing.amount - quantityBought;
    const updateData =
      newAmount <= 0
        ? { amount: 0, status: "sold", soldAt: new Date() }
        : { amount: newAmount };

    await listingModel.updateOne({ _id: listing._id }, { $set: updateData });

    listing.amount = newAmount;
    listing.status = updateData.status ?? listing.status;

    // 11. Giảm remainingSupply + tăng downloadCount trong document
    await documentModel.findByIdAndUpdate(document._id, {
      $inc: {
        remainingSupply: -quantityBought,
        downloadCount: quantityBought,
      },
    });

    // 12. Giảm NFT của seller
    await nftModel.findOneAndUpdate(
      { user: listing.seller, tokenId: listing.tokenId },
      { $inc: { amount: -quantityBought } },
    );

    // 13. Xóa NFT seller nếu amount về 0
    await nftModel.deleteOne({
      user: listing.seller,
      tokenId: listing.tokenId,
      amount: { $lte: 0 },
    });

    // 14. Tăng NFT của buyer
    await nftModel.findOneAndUpdate(
      { user: buyerId, tokenId: listing.tokenId },
      {
        $inc: { amount: quantityBought },
        $setOnInsert: {
          user: buyerId,
          document: document._id,
          tokenId: listing.tokenId,
          ownerAddress: buyer.walletAddress,
        },
      },
      { upsert: true, new: true },
    );

    // 15. Lưu transaction
    await transactionModel.create({
      fromUser: listing.seller,
      toUser: buyerId,
      fromAddress: listing.sellerAddress,
      toAddress: buyer.walletAddress,
      document: document._id,
      tokenId: listing.tokenId,
      orderId,
      quantity: quantityBought,
      price: listing.price,
      marketplaceFee: Number(ethers.formatEther(marketplaceFee)),
      royaltyPaid: Number(ethers.formatEther(royaltyPaid)),
      sellerReceived: Number(ethers.formatEther(sellerReceived)),
      isSecondary: !listing.isOriginalCreator,
      type: "buy",
      txHash,
      blockNumber: receipt.blockNumber,
      status: "success",
    });

    return res.status(200).json({
      message: "Mua tài liệu thành công",
      txHash,
    });
  } catch (error) {
    console.error("[buyDocument]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// cancelListing
const cancelListing = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    // 1. Kiểm tra listing trong DB
    const listing = await listingModel.findOne({ orderId, status: "active" });
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing không tồn tại hoặc đã không còn active" });
    }

    // 2. Chỉ seller mới được hủy
    if (listing.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy listing này" });
    }

    // 3. Verify order còn active trên chain
    const signer = getBackendSigner();
    const marketplace = getMarketplaceContract(signer);
    const onChainOrder = await marketplace.orders(orderId);

    if (!onChainOrder.active) {
      listing.status = "cancelled";
      await listing.save();
      return res
        .status(409)
        .json({ message: "Order này đã không còn active trên blockchain" });
    }

    // 4. Cancel on-chain
    const tx = await marketplace.cancelOrder(orderId);
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ message: "Transaction cancel thất bại trên blockchain" });
    }

    // 5. Cập nhật DB
    listing.status = "cancelled";
    listing.cancelledAt = new Date();
    await listing.save();

    await documentModel.findByIdAndUpdate(listing.document, {
      $inc: { remainingSupply: listing.amount },
    });

    const seller = await userModel.findById(userId);

    await transactionModel.create({
      fromUser: userId,
      fromAddress: listing.sellerAddress ?? seller?.walletAddress,
      document: listing.document,
      tokenId: listing.tokenId,
      orderId,
      quantity: listing.amount,
      price: listing.price,
      type: "cancel",
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: "success",
    });

    return res.status(200).json({
      message: "Hủy listing thành công",
      txHash: receipt.hash,
    });
  } catch (error) {
    console.error("[cancelListing]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// transferNFT
const transferNFT = async (req, res) => {
  try {
    const { toAddress, tokenId, amount, txHash } = req.body;
    const fromUserId = req.userId;

    if (!toAddress || !tokenId || !amount || !txHash) {
      return res.status(400).json({ message: "Thiếu thông tin transfer" });
    }

    // 1. Chống replay
    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
    }

    // 2. Verify transaction on-chain
    const provider = getProvider();
    const receipt = await getReceiptWithRetry(provider, txHash);

    if (!receipt) {
      return res.status(400).json({
        message:
          "Không tìm thấy transaction trên blockchain. Vui lòng thử lại sau.",
      });
    }

    if (receipt.status !== 1) {
      return res
        .status(400)
        .json({ message: "Transaction đã thất bại trên blockchain" });
    }

    // 3. Verify tx gọi đúng contract marketplace
    if (
      receipt.to?.toLowerCase() !==
      process.env.MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        message: "Transaction không tương tác với marketplace contract",
      });
    }

    // 4. Parse event TransferWithRoyalty
    const iface = new ethers.Interface(MARKETPLACE_ABI);
    let eventArgs = null;

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "TransferWithRoyalty") {
          const sameToken = parsed.args.tokenId.toString() === String(tokenId);
          const sameAmount = parsed.args.amount.toString() === String(amount);
          const sameTo =
            parsed.args.to.toLowerCase() === toAddress.toLowerCase();
          if (sameToken && sameAmount && sameTo) {
            eventArgs = parsed.args;
            break;
          }
        }
      } catch (_) {}
    }

    if (!eventArgs) {
      return res.status(400).json({
        message:
          "Không tìm thấy event TransferWithRoyalty hợp lệ trong transaction",
      });
    }

    const royaltyPaid = eventArgs.royaltyAmount ?? 0n;
    const fromAddress = eventArgs.from.toLowerCase();

    // 5. Verify fromAddress khớp với user đang request
    const fromUser = await userModel.findById(fromUserId);
    if (!fromUser?.walletAddress) {
      return res.status(400).json({ message: "Tài khoản chưa liên kết ví" });
    }
    if (fromUser.walletAddress.toLowerCase() !== fromAddress) {
      return res.status(403).json({
        message: "Địa chỉ ví không khớp với người gửi trong transaction",
      });
    }

    // 6. Kiểm tra DB: fromUser có đủ NFT không
    const fromNFT = await nftModel.findOne({
      user: fromUserId,
      tokenId: String(tokenId),
    });
    if (!fromNFT || fromNFT.amount < amount) {
      return res
        .status(400)
        .json({ message: "Bạn không có đủ NFT để transfer" });
    }

    // 7. Tìm toUser theo địa chỉ ví
    const toUser = await userModel.findOne({
      walletAddress: toAddress.toLowerCase(),
    });

    const document = await documentModel.findOne({ tokenId: String(tokenId) });

    // 8. Cập nhật NFT ownership
    if (fromNFT.amount === Number(amount)) {
      await nftModel.deleteOne({ user: fromUserId, tokenId: String(tokenId) });
    } else {
      await nftModel.findOneAndUpdate(
        { user: fromUserId, tokenId: String(tokenId) },
        { $inc: { amount: -Number(amount) } },
      );
    }

    if (toUser) {
      await nftModel.findOneAndUpdate(
        { user: toUser._id, tokenId: String(tokenId) },
        {
          $inc: { amount: Number(amount) },
          $setOnInsert: {
            user: toUser._id,
            document: document?._id,
            tokenId: String(tokenId),
            ownerAddress: toAddress.toLowerCase(),
          },
        },
        { upsert: true, new: true },
      );
    }

    // 9. Lưu transaction
    await transactionModel.create({
      fromUser: fromUserId,
      toUser: toUser?._id ?? null,
      fromAddress: fromUser.walletAddress,
      toAddress: toAddress.toLowerCase(),
      document: document?._id,
      tokenId: String(tokenId),
      quantity: Number(amount),
      royaltyPaid: Number(ethers.formatEther(royaltyPaid)),
      type: "transfer",
      txHash,
      blockNumber: receipt.blockNumber,
      status: "success",
    });

    return res.status(200).json({ message: "Transfer NFT thành công" });
  } catch (error) {
    console.error("[transferNFT]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// checkAccess
const checkAccess = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;

    const document = await documentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    if (document.price === 0) {
      return res.json({ hasAccess: true, reason: "free" });
    }

    if (document.author.toString() === userId) {
      return res.json({ hasAccess: true, reason: "author" });
    }

    const nft = await nftModel.findOne({
      user: userId,
      tokenId: document.tokenId,
    });

    if (nft && nft.amount > 0) {
      return res.json({ hasAccess: true, reason: "owner" });
    }

    return res.json({ hasAccess: false });
  } catch (error) {
    console.error("[checkAccess]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// donateToAuthor
const donateToAuthor = async (req, res) => {
  try {
    const { txHash, toAddress, message } = req.body;
    const fromUserId = req.userId;

    if (!txHash || !toAddress) {
      return res.status(400).json({ message: "Thiếu txHash hoặc toAddress" });
    }

    // 1. Chống replay
    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
    }

    // 2. Verify transaction on-chain (retry để tránh RPC chưa index kịp)
    const provider = getProvider();
    const receipt = await getReceiptWithRetry(provider, txHash);

    if (!receipt) {
      return res.status(400).json({
        message:
          "Không tìm thấy transaction trên blockchain. Vui lòng thử lại sau.",
      });
    }
    if (receipt.status !== 1) {
      return res
        .status(400)
        .json({ message: "Transaction đã thất bại trên blockchain" });
    }

    // 3. Verify tx gọi đúng marketplace contract
    if (
      receipt.to?.toLowerCase() !==
      process.env.MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        message: "Transaction không tương tác với marketplace contract",
      });
    }

    // 4. Parse event Donated
    const iface = new ethers.Interface(MARKETPLACE_ABI);
    let donatedArgs = null;

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (
          parsed?.name === "Donated" &&
          parsed.args.recipient.toLowerCase() === toAddress.toLowerCase()
        ) {
          donatedArgs = parsed.args;
          break;
        }
      } catch (_) {}
    }

    if (!donatedArgs) {
      return res.status(400).json({
        message: "Không tìm thấy event Donated hợp lệ trong transaction",
      });
    }

    // 5. Verify donor khớp với ví của user đang request
    const fromUser = await userModel.findById(fromUserId);
    if (!fromUser?.walletAddress) {
      return res.status(400).json({ message: "Tài khoản chưa liên kết ví" });
    }
    if (
      fromUser.walletAddress.toLowerCase() !== donatedArgs.donor.toLowerCase()
    ) {
      return res.status(403).json({
        message: "Địa chỉ ví không khớp với người gửi trong transaction",
      });
    }

    // 6. Tìm user nhận donate theo walletAddress
    const toUser = await userModel.findOne({
      walletAddress: toAddress.toLowerCase(),
    });

    // 7. Lưu transaction
    const donatedAmountEth = Number(ethers.formatEther(donatedArgs.amount));

    await transactionModel.create({
      fromUser: fromUserId,
      toUser: toUser?._id ?? null,
      fromAddress: fromUser.walletAddress,
      toAddress: toAddress.toLowerCase(),
      price: donatedAmountEth,
      quantity: 1,
      type: "donate",
      txHash,
      blockNumber: receipt.blockNumber,
      status: "success",
      ...(message?.trim() && { donateMessage: message.trim() }),
    });

    return res.status(200).json({
      message: "Donate thành công",
      txHash,
      amount: donatedAmountEth,
    });
  } catch (error) {
    console.error("[donateToAuthor]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const resellDocument = async (req, res) => {
  try {
    const {
      documentId,
      tokenId,
      amount,
      price,
      orderId,
      txHash,
      isOriginalCreator,
    } = req.body;
    const sellerId = req.userId;

    if (!documentId || !tokenId || !price || !orderId || !txHash) {
      return res.status(400).json({ message: "Thiếu thông tin listing" });
    }

    const document = await documentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    if (parseFloat(price) !== parseFloat(document.price)) {
      return res.status(400).json({
        message: `Giá bán phải bằng giá gốc của tác giả: ${document.price} ETH`,
      });
    }

    // Kiểm tra seller có NFT không
    const nft = await nftModel.findOne({ user: sellerId, tokenId });
    if (!nft || nft.amount < 1) {
      return res.status(400).json({ message: "Bạn không sở hữu NFT này" });
    }

    const seller = await userModel.findById(sellerId);

    await listingModel.create({
      orderId,
      seller: sellerId,
      sellerAddress: seller.walletAddress,
      document: documentId,
      tokenId,
      amount: amount || 1,
      price: document.price,
      isOriginalCreator: false,
      status: "active",
    });

    return res.status(201).json({ message: "Đăng bán thành công" });
  } catch (error) {
    console.error("[resellDocument]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getDonationsReceived = async (req, res) => {
  try {
    const userId = req.userId;

    const donations = await transactionModel
      .find({ toUser: userId, type: "donate", status: "success" })
      .sort({ createdAt: -1 })
      .populate("fromUser", "userName avatar")
      .lean();

    const totalETH = donations.reduce((sum, d) => sum + (d.price ?? 0), 0);
    const maxETH = donations.length
      ? Math.max(...donations.map((d) => d.price ?? 0))
      : 0;

    return res.json({
      donations,
      stats: {
        total: donations.length,
        totalETH: Math.round(totalETH * 10000) / 10000,
        maxETH,
      },
    });
  } catch (error) {
    console.error("[getDonationsReceived]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getAuthorResellListings = async (req, res) => {
  try {
    const { authorId } = req.params;

    const listings = await listingModel
      .find({ seller: authorId, status: "active", isOriginalCreator: false })
      .populate("document", "title fileUrl price subject category")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(listings);
  } catch (error) {
    console.error("[getAuthorResellListings]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getPurchasedDocuments = async (req, res) => {
  try {
    const userId = req.userId;

    const nfts = await nftModel
      .find({ user: userId, amount: { $gt: 0 } })
      .populate({
        path: "document",
        populate: { path: "author", select: "userName avatar" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const purchased = nfts
      .filter(
        (nft) =>
          nft.document &&
          nft.document.author?._id?.toString() !== userId.toString(),
      )
      .map((nft) => ({
        ...nft.document,
        boughtAt: nft.createdAt,
        nftAmount: nft.amount,
      }));

    return res.json(purchased);
  } catch (error) {
    console.error("[getPurchasedDocuments]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = {
  createListing,
  buyDocument,
  cancelListing,
  getAuthorResellListings,
  transferNFT,
  checkAccess,
  donateToAuthor,
  resellDocument,
  getDonationsReceived,
  getPurchasedDocuments,
};
