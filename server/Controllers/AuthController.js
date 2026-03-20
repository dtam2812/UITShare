const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    await userModel.create({
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
      walletAddress: "",
      role: "user",
    });

    return res.status(200).send("register user");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
};
