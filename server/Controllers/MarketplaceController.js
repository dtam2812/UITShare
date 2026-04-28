const { ethers } = require("ethers");
const documentModel = require("../Models/DocumentModel");
const listingModel = require("../Models/ListingModel");
const nftModel = require("../Models/NFTModel");
const transactionModel = require("../Models/TransactionModel");
const userModel = require("../Models/UserModel");

//ABI
const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
];

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

// maxAttempts=8, delay=2s → waits up to ~14s
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

// ============================================================
// recreateOrderOnChain
// After each successful purchase (isOriginalCreator), the smart contract
// marks the old orderId as "inactive".
//
// The contract uses an ESCROW MODEL: addOrder locks tokens in the contract,
// executeOrder returns tokens to the wallet first then sends them to the buyer — or
// does not return them, depending on the implementation. Always check the
// actual balanceOf to avoid "Insufficient balance".
// ============================================================
const recreateOrderOnChain = async (listing, newAmount) => {
  try {
    const provider = getProvider();
    const signer = getBackendSigner();
    const marketplace = getMarketplaceContract(signer);

    const nftContract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      provider,
    );

    // Check the actual balance of the backend wallet
    const actualBalance = await nftContract.balanceOf(
      signer.address,
      listing.tokenId,
    );
    const actualAmount = Number(actualBalance);

    if (actualAmount === 0) {
      console.warn(
        `[recreateOrderOnChain] Balance = 0 cho tokenId=${listing.tokenId}. Tokens bị kẹt trong contract (escrow). Bỏ qua re-listing.`,
      );
      return null;
    }

    // Use min(newAmount, actualAmount) for safety
    const orderAmount = Math.min(newAmount, actualAmount);
    if (orderAmount !== newAmount) {
      console.warn(
        `[recreateOrderOnChain] DB amount=${newAmount} > chain balance=${actualAmount}. Dùng ${orderAmount}.`,
      );
      await listingModel.updateOne(
        { _id: listing._id },
        { $set: { amount: orderAmount } },
      );
    }

    const priceInWei = ethers.parseEther(String(listing.price));
    // Always create order with amount=1 — contract transfers entire order.amount to buyer
    const tx = await marketplace.addOrder(listing.tokenId, 1, priceInWei);
    const receipt = await tx.wait();

    const orderAddedArgs = parseEventFromReceipt(receipt, "OrderAdded");
    if (!orderAddedArgs) {
      console.error("[recreateOrderOnChain] Không parse được OrderAdded event");
      return null;
    }

    const newOrderId = orderAddedArgs.orderId.toString();
    await listingModel.updateOne(
      { _id: listing._id },
      { $set: { orderId: newOrderId } },
    );

    console.log(
      `[recreateOrderOnChain] ✅ orderId mới=${newOrderId}, amount=${orderAmount}`,
    );
    return newOrderId;
  } catch (err) {
    console.error("[recreateOrderOnChain] Lỗi khi tạo lại order:", err.message);
    return null;
  }
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

  // IMPORTANT: Always create orders on-chain with amount=1.
  // Contract executeOrder() transfers THE ENTIRE order.amount to a single buyer.
  // If amount=150 → the first buyer receives 150 tokens but pays for only 1 copy!
  // → Each order represents only 1 copy. The backend wallet holds the remainder.
  // After each sale, recreateOrderOnChain() creates a new order with amount=1.
  const priceInWei = ethers.parseEther(String(price));
  const tx = await marketplace.addOrder(tokenId, 1, priceInWei);
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
    amount, // DB stores the total remaining copies for display
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

    // 1. Replay protection
    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
    }

    // 2. Validate listing
    const listing = await listingModel
      .findOne({ orderId, status: "active" })
      .populate("document");
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing không tồn tại hoặc đã hết hàng" });
    }

    // 3. Check that buyer has a wallet
    const buyer = await userModel.findById(buyerId);
    if (!buyer?.walletAddress) {
      return res
        .status(400)
        .json({ message: "Bạn cần liên kết ví trước khi mua" });
    }

    // 4. Prevent seller from buying their own listing
    if (
      listing.sellerAddress.toLowerCase() === buyer.walletAddress.toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "Bạn không thể mua listing của chính mình" });
    }

    // 5. Check if buyer already owns this NFT
    const existingNFT = await nftModel.findOne({
      user: buyerId,
      tokenId: listing.tokenId,
    });
    if (existingNFT) {
      return res
        .status(400)
        .json({ message: "Bạn đã sở hữu tài liệu này rồi" });
    }

    // 6. Verify transaction on-chain (retry to handle RPC indexing delays)
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

    // 7. Verify tx was sent to the correct marketplace contract
    if (
      receipt.to?.toLowerCase() !==
      process.env.MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        message: "Transaction không tương tác với marketplace contract",
      });
    }

    // 8. Verify tx was sent from the buyer's registered wallet
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

    // 10. Update listing amount
    const newAmount = listing.amount - quantityBought;
    const updateData =
      newAmount <= 0
        ? { amount: 0, status: "sold", soldAt: new Date() }
        : { amount: newAmount };

    await listingModel.updateOne({ _id: listing._id }, { $set: updateData });

    listing.amount = newAmount;
    listing.status = updateData.status ?? listing.status;

    // 11. Decrement remainingSupply and increment downloadCount on the document
    if (listing.isOriginalCreator) {
      await documentModel.findByIdAndUpdate(document._id, {
        $inc: {
          remainingSupply: -quantityBought,
          downloadCount: quantityBought,
        },
      });
    } else {
      await documentModel.findByIdAndUpdate(document._id, {
        $inc: { downloadCount: quantityBought },
      });
    }

    // 12. Decrement seller NFT balance
    await nftModel.findOneAndUpdate(
      { user: listing.seller, tokenId: listing.tokenId },
      { $inc: { amount: -quantityBought } },
    );

    // 13. Delete seller NFT record if amount drops to zero
    await nftModel.deleteOne({
      user: listing.seller,
      tokenId: listing.tokenId,
      amount: { $lte: 0 },
    });

    // 14. Increment buyer NFT balance
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

    // 15. Record the transaction
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
    
    if (newAmount > 0 && listing.isOriginalCreator) {
      await recreateOrderOnChain(listing, newAmount);
    }

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
    const { orderId, txHash } = req.body;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    // 1. Validate listing in DB
    const listing = await listingModel.findOne({ orderId, status: "active" });
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing không tồn tại hoặc đã không còn active" });
    }

    // 2. Only the seller can cancel
    if (listing.seller.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy listing này" });
    }

    // Resell flow: user signed cancelOrder from their wallet, sends txHash for verification
    if (!listing.isOriginalCreator) {
      if (!txHash) {
        return res
          .status(400)
          .json({ message: "Thiếu txHash để xác minh giao dịch huỷ" });
      }

      // Replay protection
      const existingTx = await transactionModel.findOne({ txHash });
      if (existingTx) {
        return res
          .status(409)
          .json({ message: "Transaction này đã được xử lý" });
      }

      // Verify on-chain
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
      if (
        receipt.to?.toLowerCase() !==
        process.env.MARKETPLACE_CONTRACT_ADDRESS.toLowerCase()
      ) {
        return res.status(400).json({
          message: "Transaction không tương tác với marketplace contract",
        });
      }

      // Parse OrderCancelled event to confirm the correct orderId
      const iface = new ethers.Interface(MARKETPLACE_ABI);
      let cancelledOrderId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "OrderCancelled") {
            cancelledOrderId = parsed.args.orderId.toString();
            break;
          }
        } catch (_) {}
      }

      if (cancelledOrderId !== String(orderId)) {
        return res.status(400).json({
          message: "Transaction không khớp với orderId yêu cầu huỷ",
        });
      }

      // Update DB
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
        txHash,
        blockNumber: receipt.blockNumber,
        status: "success",
      });

      return res.status(200).json({
        message: "Hủy listing thành công",
        txHash,
      });
    }

    // Original creator flow: backend wallet cancels on-chain directly
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

    const tx = await marketplace.cancelOrder(orderId);
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ message: "Transaction cancel thất bại trên blockchain" });
    }

    listing.status = "cancelled";
    listing.cancelledAt = new Date();
    await listing.save();

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

    // 1. Replay protection
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

    // 3. Verify tx was sent to the correct marketplace contract
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

    // 5. Verify fromAddress matches the requesting user
    const fromUser = await userModel.findById(fromUserId);
    if (!fromUser?.walletAddress) {
      return res.status(400).json({ message: "Tài khoản chưa liên kết ví" });
    }
    if (fromUser.walletAddress.toLowerCase() !== fromAddress) {
      return res.status(403).json({
        message: "Địa chỉ ví không khớp với người gửi trong transaction",
      });
    }

    // 6. Check DB: does fromUser have sufficient NFT balance
    const fromNFT = await nftModel.findOne({
      user: fromUserId,
      tokenId: String(tokenId),
    });
    if (!fromNFT || fromNFT.amount < amount) {
      return res
        .status(400)
        .json({ message: "Bạn không có đủ NFT để transfer" });
    }

    // 7. Look up toUser by wallet address
    const toUser = await userModel.findOne({
      walletAddress: toAddress.toLowerCase(),
    });

    const document = await documentModel.findOne({ tokenId: String(tokenId) });

    // 8. Update NFT ownership
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

    // 9. Record the transaction
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

    if (!nft || nft.amount < 1) {
      return res.json({ hasAccess: false });
    }

    const activeListing = await listingModel.findOne({
      seller: userId,
      tokenId: document.tokenId,
      status: "active",
    });
    if (activeListing) {
      return res.json({ hasAccess: false, reason: "listed" });
    }

    return res.json({ hasAccess: true, reason: "owner" });
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

    // 1. Replay protection
    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
    }

    // 2. Verify transaction on-chain (retry to handle RPC indexing delays)
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

    // 3. Verify tx was sent to the correct marketplace contract
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

    // 5. Verify donor matches the requesting user's wallet
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

    // 6. Look up the donation recipient by wallet address
    const toUser = await userModel.findOne({
      walletAddress: toAddress.toLowerCase(),
    });

    // 7. Record the transaction
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
    const { documentId, tokenId, amount, price, orderId, txHash } = req.body;
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

    // Check that the seller owns this NFT
    const nft = await nftModel.findOne({ user: sellerId, tokenId });
    if (!nft || nft.amount < 1) {
      return res.status(400).json({ message: "Bạn không sở hữu NFT này" });
    }

    const existingListing = await listingModel.findOne({
      seller: sellerId,
      tokenId,
      status: "active",
    });
    if (existingListing) {
      return res.status(409).json({
        message: "Bạn đã có listing đang active cho tài liệu này",
      });
    }

    const existingTx = await transactionModel.findOne({ txHash });
    if (existingTx) {
      return res.status(409).json({ message: "Transaction này đã được xử lý" });
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
      .populate({
        path: "document",
        select:
          "title fileUrl price subject category pageCount averageRating downloadCount commentCount tokenId author createdAt",
        populate: { path: "author", select: "userName avatar _id" },
      })
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

const getListingById = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await listingModel
      .findById(listingId)
      .populate("seller", "userName avatar _id")
      .lean();

    if (!listing) {
      return res.status(404).json({ message: "Không tìm thấy listing" });
    }
    return res.json(listing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
  getListingById,
};
