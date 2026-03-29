const express = require("express");
const router = express.Router();
const personalController = require("../Controllers/PersonalController");
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      cb(null, "uploads/avatar/");
    } else if (file.fieldname === "coverImage") {
      cb(null, "uploads/coverImage/");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.userId}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get(
  "/userDetail/:userId",
  [AuthMiddleware.isAuthentication],
  personalController.getUserDetail,
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

module.exports = router;
