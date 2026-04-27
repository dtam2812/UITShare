const express = require("express");
const router = express.Router();
const authController = require("../Controllers/AuthController");
const forgotPasswordController = require("../Controllers/ForgotPasswordController");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Quên mật khẩu
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.get("/validate-reset-token/:token", forgotPasswordController.validateResetToken);
router.post("/reset-password/:token", forgotPasswordController.resetPassword);

module.exports = router;