const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");
const documentModel = require("../Models/DocumentModel");
const bcrypt = require("bcrypt");

const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userName, studentId, bio, facebookLink } = req.body;

    const updateData = { userName, bio, facebookLink };

    if (studentId !== undefined && studentId !== null && studentId !== '') {
      updateData.studentId = studentId;
    }

    if (req.files?.avatar) {
      updateData.avatar = `${process.env.SERVER_URL}/uploads/avatar/${req.files.avatar[0].filename}`;
    }
    if (req.files?.coverImage) {
      updateData.coverImage = `${process.env.SERVER_URL}/uploads/coverImage/${req.files.coverImage[0].filename}`;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    const newToken = jwt.sign(
      {
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        avatar: updatedUser.avatar,
        coverImage: updatedUser.coverImage,
        studentId: updatedUser.studentId,
        bio: updatedUser.bio,
        facebookLink: updatedUser.facebookLink,
        walletAddress: updatedUser.walletAddress,
      },
      process.env.SECRET_JWT,
      { expiresIn: 3600 }
    );

    res.status(200).json({ ...updatedUser.toObject(), newToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "Không có địa chỉ ví" });
    }

    // Kiểm tra ví đã được dùng bởi user khác chưa
    const existingUser = await userModel.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Ví này đã được liên kết với tài khoản khác" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { walletAddress: walletAddress.toLowerCase() },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const documents = await documentModel
      .find({ author: req.userId, isMinted: true })
      .sort({ createdAt: -1 })
      .lean();

    const totalDownloads = documents.reduce(
      (sum, d) => sum + (d.downloadCount || 0),
      0,
    );

    return res.status(200).json({
      documents,
      stats: {
        totalDocs: documents.length,
        totalDownloads,
      },
    });
  } catch (error) {
    console.error("[getMyDocuments]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = {
  getUserDetail,
  updateUserInfo,
  updateWallet,
  getMyDocuments,
};
