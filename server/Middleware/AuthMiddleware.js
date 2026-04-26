const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const isAuthentication = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) return res.status(401).send("Không có token xác thực");

    const accessToken = bearerHeader.split(" ")[1];
    const decodeJwt = jwt.verify(accessToken, process.env.SECRET_JWT);
    req.userId = decodeJwt._id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token đã hết hạn");
    }
    return res.status(401).send("Token không hợp lệ");
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.status(401).send("Người dùng không tồn tại");
    if (user.role !== "admin") {
      return res.status(403).send("Bạn không có quyền truy cập trang này");
    }
    next();
  } catch (error) {
    return res.status(401).send("Xác thực không hợp lệ");
  }
};

module.exports = {
  isAuthentication,
  isAdmin,
};