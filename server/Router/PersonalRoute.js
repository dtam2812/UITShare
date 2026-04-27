const express = require("express");
const router = express.Router();
const personalController = require("../Controllers/PersonalController");
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.get(
  "/userDetail/:userId",
  [AuthMiddleware.isAuthentication],
  personalController.getUserDetail,
);

router.put(
  "/updateWallet/:userId",
  [AuthMiddleware.isAuthentication],
  personalController.updateWallet,
);

router.put(
  "/updateUserInfo/:userId",
  [AuthMiddleware.isAuthentication],
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  personalController.updateUserInfo,
);

router.get(
  "/documents",
  [AuthMiddleware.isAuthentication],
  personalController.getMyDocuments,
);

module.exports = router;
