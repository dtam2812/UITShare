const PinataSDK = require("@pinata/sdk");
const fs = require("fs");
const { ethers } = require("ethers");
const { PDFDocument } = require("pdf-lib");
const documentModel = require("../Models/DocumentModel");
const nftModel = require("../Models/NFTModel");
const userModel = require("../Models/UserModel");
const commentModel = require("../Models/CommentModel");

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_KEY,
);

const NFT_ABI = [
  "function mint(uint256 amount_, string memory tokenURI_, uint96 royaltyBps_, bytes memory data_) public returns (uint256)",
  "function getCurrentTokenId() view returns (uint256)",
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

    let parsedPageCount = null;

    if (mainFile.mimetype === "application/pdf") {
      try {
        const pdfBytes = fs.readFileSync(mainFile.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        parsedPageCount = pdfDoc.getPageCount();
      } catch (err) {
        console.error("[pdf-lib error]", err.message);
        parsedPageCount = null;
      }
    } else {
      console.log("Not a PDF file, mimetype:", mainFile.mimetype);
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

    // 1. Upload file chính lên IPFS
    const { cid, fileUrl } = await uploadFileToPinata(
      mainFile.path,
      mainFile.originalname,
    );
    cleanupTempFile(tempFilePath);

    // 2. Upload metadata lên IPFS
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
      ],
    };

    if (parsedPageCount) {
      metadata.attributes.push({
        trait_type: "Pages",
        value: String(parsedPageCount),
      });
    }

    const metadataUri = await uploadMetadataToPinata(
      metadata,
      `${title?.trim() || mainFile.originalname}_metadata`,
    );

    // 3. Setup provider + contract
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const nftContract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer,
    );

    // 4. Lấy tokenId hiện tại
    const currentId = await nftContract.getCurrentTokenId();

    // 5. Mint NFT
    const tx = await nftContract.mint(
      parsedAmount,
      metadataUri,
      royaltyBps,
      "0x",
    );
    const receipt = await tx.wait();

    // 6. Lấy tokenId thực từ event
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

    // 7. Lưu Document vào MongoDB
    const newDocument = await documentModel.create({
      title: title?.trim() || mainFile.originalname,
      description: description?.trim() || "",
      fileUrl,
      pageCount: parsedPageCount,
      cid,
      author: req.userId,
      authorWallet: user.walletAddress,
      subject: subject.trim(),
      category: category.trim(),
      price: parsedPrice,
      accessType: parsedPrice > 0 ? "paid" : "free",
      royaltyPercent: parsedRoyalty,
      royaltyReceiver: user.walletAddress,
      amount: parsedAmount,
      totalSupply: parsedAmount,
      tokenId,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      isMinted: true,
    });

    // 8. Lưu NFT ownership
    await nftModel.create({
      user: req.userId,
      document: newDocument._id,
      tokenId,
      amount: parsedAmount,
      ownerAddress: user.walletAddress,
    });

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

module.exports = { uploadDocument, getListDocument };
