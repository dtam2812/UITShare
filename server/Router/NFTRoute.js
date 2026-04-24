const express = require("express");
const router = express.Router();
const nftController = require("../Controllers/NFTController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/myNFTs", authMiddleware.isAuthentication, nftController.getMyNFTs);

module.exports = router;
