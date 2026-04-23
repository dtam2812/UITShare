const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const getListUser = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, role, status } = req.body;
    await userModel.create({
      userName: userName,
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: role,
      status: status,
    });
    return res.status(200).send("create user successfully");
  } catch (error) {
    console.log(error);
  }
};

const userDetail = (req, res) => {
  try {
    const userId = req.params.id;
    const user = userModel.findById(userId);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await userModel.findByIdAndDelete(userId);
    return res.status(200).send("delete user successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getListUser,
  addUser,
  deleteUser,
  userDetail,
};
