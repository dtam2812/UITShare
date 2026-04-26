const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/user",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.getListUser,
);

router.post(
  "/user/create",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.addUser,
);

router.put(
  "/user/update/:userId",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.updateUser,
);

router.delete(
  "/user/delete/:userId",
  [AuthMiddleware.isAuthentication, AuthMiddleware.isAdmin],
  userController.deleteUser,
);

module.exports = router;