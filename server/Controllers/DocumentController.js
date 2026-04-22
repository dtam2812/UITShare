const mongoose = require("mongoose");
const PinataSDK = require("@pinata/sdk");
const fs = require("fs");
const { ethers } = require("ethers");
const { PDFDocument } = require("pdf-lib");
const documentModel = require("../Models/DocumentModel");
const nftModel = require("../Models/NFTModel");
const userModel = require("../Models/UserModel");
const commentModel = require("../Models/CommentModel");
const transactionModel = require("../Models/TransactionModel");
const { createHash } = require("node:crypto");
const { createListing } = require("./MarketplaceController");

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY,
);

const NFT_ABI = [
  "function mint(uint256 amount_, string memory tokenURI_, uint96 royaltyBps_, bytes memory data_) public returns (uint256)",
  "function getCurrentTokenId() view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
];

const cleanupTempFile = (path) => {
  if (path && fs.existsSync(path)) {
    try {
      fs.unlinkSync(path);
    } catch (_) {}
  }
};

const uploadFileToPinata = async (filePath, originalName) => {
  const stream = fs.createReadStream(filePath);
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name: originalName },
  });
  return {
    cid: result.IpfsHash,
    fileUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
};

const uploadMetadataToPinata = async (metadata, name) => {
  const result = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name },
  });
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
};

const uploadDocument = async (req, res) => {
  const tempFilePath = req.files?.file?.[0]?.path;

  try {
    if (!req.files?.file?.[0]) {
      return res.status(400).json({ message: "Không có file được gửi lên" });
    }

    const mainFile = req.files.file[0];
    const {
      title,
      subject,
      category,
      description,
      price,
      royaltyPercent,
      amount,
    } = req.body;

    if (!title?.trim() || !subject?.trim() || !category?.trim()) {
      cleanupTempFile(tempFilePath);
      return res
        .status(400)
        .json({ message: "Thiếu tiêu đề, môn học hoặc loại tài liệu" });
    }

    const parsedPrice = Math.max(parseFloat(price) || 0, 0);
    const parsedRoyalty = Math.min(
      Math.max(parseInt(royaltyPercent) || 10, 1),
      50,
    );
    const parsedAmount = Math.min(Math.max(parseInt(amount) || 1, 1), 1000);

    // Check fileHash TRƯỚC khi upload Pinata — tiết kiệm băng thông
    const fileBuffer = fs.readFileSync(mainFile.path);
    const fileHash = createHash("sha256").update(fileBuffer).digest("hex");

    const existingDoc = await documentModel.findOne({ fileHash });
    if (existingDoc) {
      cleanupTempFile(tempFilePath);
      return res.status(409).json({
        message: "Tài liệu này đã tồn tại trên hệ thống",
        existingDocumentId: existingDoc._id,
        existingTitle: existingDoc.title,
      });
    }

    let parsedPageCount = null;
    if (mainFile.mimetype === "application/pdf") {
      try {
        const pdfDoc = await PDFDocument.load(fileBuffer);
        parsedPageCount = pdfDoc.getPageCount();
      } catch (err) {
        console.error("[pdf-lib error]", err.message);
      }
    }

    const royaltyBps = parsedRoyalty * 100;

    const user = await userModel.findById(req.userId);
    if (!user) {
      cleanupTempFile(tempFilePath);
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    if (!user.walletAddress) {
      cleanupTempFile(tempFilePath);
      return res
        .status(400)
        .json({ message: "Bạn cần liên kết ví trước khi đăng tài liệu" });
    }

    // 1. Upload file lên IPFS
    const { cid, fileUrl } = await uploadFileToPinata(
      mainFile.path,
      mainFile.originalname,
    );
    cleanupTempFile(tempFilePath);

    // 2. Upload metadata
    const metadata = {
      name: title?.trim() || mainFile.originalname,
      description: description?.trim() || "",
      file: fileUrl,
      subject: subject.trim(),
      category: category.trim(),
      author: user.walletAddress,
      price: parsedPrice,
      attributes: [
        { trait_type: "Subject", value: subject.trim() },
        { trait_type: "Category", value: category.trim() },
        { trait_type: "Price (ETH)", value: String(parsedPrice) },
        { trait_type: "Royalty (%)", value: String(parsedRoyalty) },
        ...(parsedPageCount
          ? [{ trait_type: "Pages", value: String(parsedPageCount) }]
          : []),
      ],
    };

    const metadataUri = await uploadMetadataToPinata(
      metadata,
      `${title?.trim() || mainFile.originalname}_metadata`,
    );

    // 3. Setup provider + signer + contracts
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const nftContract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer,
    );

    // 4. Approve marketplace nếu chưa được approve (chỉ tốn gas 1 lần duy nhất)
    if (parsedPrice > 0) {
      const isApproved = await nftContract.isApprovedForAll(
        signer.address,
        process.env.MARKETPLACE_CONTRACT_ADDRESS,
      );
      if (!isApproved) {
        console.log(
          "[uploadDocument] Chưa approve, đang gọi setApprovalForAll...",
        );
        const approveTx = await nftContract.setApprovalForAll(
          process.env.MARKETPLACE_CONTRACT_ADDRESS,
          true,
        );
        await approveTx.wait();
        console.log("[uploadDocument] setApprovalForAll thành công");
      }
    }

    // 5. Mint
    const currentId = await nftContract.getCurrentTokenId();
    const tx = await nftContract.mint(
      parsedAmount,
      metadataUri,
      royaltyBps,
      "0x",
    );
    const receipt = await tx.wait();

    // 6. Lấy tokenId từ event TransferSingle
    const iface = new ethers.Interface(NFT_ABI);
    let tokenId = Number(currentId) + 1;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "TransferSingle") {
          tokenId = Number(parsed.args.id);
          break;
        }
      } catch (_) {}
    }

    // 7. Lưu Document
    const newDocument = await documentModel.create({
      title: title?.trim() || mainFile.originalname,
      description: description?.trim() || "",
      fileUrl,
      pageCount: parsedPageCount,
      cid,
      fileHash,
      author: req.userId,
      authorWallet: user.walletAddress,
      subject: subject.trim(),
      category: category.trim(),
      price: parsedPrice,
      royaltyPercent: parsedRoyalty,
      royaltyReceiver: user.walletAddress,
      totalSupply: parsedAmount,
      remainingSupply: parsedPrice > 0 ? parsedAmount : 0,
      tokenId,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      isMinted: true,
    });

    // 8. Lưu NFT ownership cho tác giả
    await nftModel.create({
      user: req.userId,
      document: newDocument._id,
      tokenId,
      amount: parsedAmount,
      ownerAddress: user.walletAddress,
    });

    // 9. Tạo listing trên marketplace (chỉ khi price > 0)
    if (parsedPrice > 0) {
      await createListing({
        sellerId: req.userId,
        sellerAddress: user.walletAddress,
        documentId: newDocument._id,
        tokenId,
        amount: parsedAmount,
        price: parsedPrice,
        isOriginalCreator: true,
      });
    }

    return res.status(201).json({
      message: "Tải lên và mint NFT thành công",
      document: newDocument,
      txHash: receipt.hash,
    });
  } catch (error) {
    cleanupTempFile(tempFilePath);
    console.error("[uploadDocument]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getListDocument = async (req, res) => {
  try {
    const documents = await documentModel
      .find({ isMinted: true })
      .populate("author", "userName email avatar")
      .sort({ createdAt: -1 })
      .lean();

    const documentsWithStats = await Promise.all(
      documents.map(async (doc) => {
        const rootComments = await commentModel.find({
          document: doc._id,
          parentComment: null,
        });

        const commentCount = rootComments.length;
        const ratedComments = rootComments.filter((c) => c.rating != null);
        const averageRating =
          ratedComments.length > 0
            ? Math.round(
                (ratedComments.reduce((sum, c) => sum + c.rating, 0) /
                  ratedComments.length) *
                  10,
              ) / 10
            : null;

        return { ...doc, commentCount, averageRating };
      }),
    );

    return res.status(200).json(documentsWithStats);
  } catch (error) {
    console.error("[getListDocument]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await documentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    await documentModel.findByIdAndDelete(documentId);
    await nftModel.deleteOne({ document: documentId });

    return res.status(200).json({ message: "Xóa tài liệu thành công" });
  } catch (error) {
    console.error("[deleteDocument]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getDocumentDetail = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "documentId không hợp lệ" });
    }

    const document = await documentModel
      .findById(documentId)
      .populate("author", "userName email avatar");

    if (!document) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    const rootComments = await commentModel.find({
      document: documentId,
      parentComment: null,
    });

    const ratedComments = rootComments.filter((c) => c.rating != null);
    const averageRating =
      ratedComments.length > 0
        ? Math.round(
            (ratedComments.reduce((sum, c) => sum + c.rating, 0) /
              ratedComments.length) *
              10,
          ) / 10
        : null;

    return res.status(200).json({
      ...document.toObject(),
      commentCount: rootComments.length,
      averageRating,
    });
  } catch (error) {
    console.error("[getDocumentDetail]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const getNFTTransactionHistory = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const transactions = await transactionModel
      .find({ tokenId, status: "success" })
      .sort({ createdAt: -1 })
      .populate("fromUser", "userName")
      .populate("toUser", "userName")
      .lean();

    return res.json(transactions);
  } catch (err) {
    console.error("[getNFTTransactionHistory]", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadDocument,
  getListDocument,
  deleteDocument,
  getDocumentDetail,
  getNFTTransactionHistory,
};
