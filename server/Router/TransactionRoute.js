// transactionRouter.js
const express = require("express");
const router = express.Router();
const transactionController = require("../Controllers/TransactionController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/history",
  authMiddleware.isAuthentication,
  transactionController.getUserTransactions,
);

module.exports = router;
