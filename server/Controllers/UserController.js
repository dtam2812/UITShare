const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const getListUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader.split(" ")[1];

  try {
    const decodeJwt = jwt.verify(accessToken, process.env.SECRET_JWT);

    if (decodeJwt && decodeJwt.role === "admin") {
      const { userName, email, password, role, status } = req.body;
      userModel.create({
        userName: userName,
        email: email,
        password: bcrypt.hashSync(password, 10),
        role: role,
        status: status,
      });
      res.status(200).send("create user successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

const userDetail = (req, res) => {
  res.send("list user");
};

module.exports = {
  getListUser,
  addUser,
  userDetail,
};
