const express = require("express");
const router = express.Router();
const transactionController = require("../Controllers/TransactionController");
const authMiddleware = require("../Middleware/AuthMiddleware");

// User: own transaction history
router.get(
  "/history",
  authMiddleware.isAuthentication,
  transactionController.getUserTransactions
);

// Admin: all system transactions
router.get(
  "/admin/all",
  authMiddleware.isAuthentication,
  authMiddleware.isAdmin,
  transactionController.getAllTransactions
);

module.exports = router;