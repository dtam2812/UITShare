const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/user",
  [AuthMiddleware.isAuthentication],
  userController.getListUser,
);
router.post(
  "/user/create",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.addUser,
);

router.delete(
  "/user/delete/:userId",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.deleteUser,
);

module.exports = router;
