const express = require("express");
const router = express.Router();
const transactionController = require("../Controllers/TransactionController");
const authMiddleware = require("../Middleware/AuthMiddleware");

// User: lịch sử giao dịch của chính mình
router.get(
  "/history",
  authMiddleware.isAuthentication,
  transactionController.getUserTransactions
);

// Admin: toàn bộ giao dịch hệ thống
router.get(
  "/admin/all",
  authMiddleware.isAuthentication,
  authMiddleware.isAdmin,
  transactionController.getAllTransactions
);

module.exports = router;