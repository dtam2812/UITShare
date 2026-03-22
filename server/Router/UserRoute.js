const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

router.get("/user", [AuthMiddleware.getListUser], userController.getListUser);
router.post("/user/create", userController.addUser);

module.exports = router;
