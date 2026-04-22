const express = require("express");
const walletController = require("../Controllers/WalletAddressController");
const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

// Lưu wallet address khi kết nối MetaMask
router.put(
  "/updateWallet/:userId",
  authMiddleware.isAuthentication,
  walletController.updateWallet,
);

// Xoá wallet address khi ngắt kết nối
router.delete(
  "/disconnectWallet/:userId",
  authMiddleware.isAuthentication,
  walletController.disconnectWallet,
);

// Lấy thông tin ví (balance, NFT, transactions)
router.get(
  "/walletInfo/:userId",
  authMiddleware.isAuthentication,
  walletController.getWalletInfo,
);

module.exports = router;
