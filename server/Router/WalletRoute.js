const express = require("express");
const walletController = require("../Controllers/WalletAddressController");
const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

// Save wallet address when connecting MetaMask
router.put(
  "/updateWallet/:userId",
  authMiddleware.isAuthentication,
  walletController.updateWallet,
);

// Remove wallet address when disconnecting
router.delete(
  "/disconnectWallet/:userId",
  authMiddleware.isAuthentication,
  walletController.disconnectWallet,
);

// Get wallet info (balance, NFTs, transactions)
router.get(
  "/walletInfo/:userId",
  authMiddleware.isAuthentication,
  walletController.getWalletInfo,
);

module.exports = router;
