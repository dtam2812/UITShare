const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    await userModel.create({
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
      bio: "",
      facebookLink: "",
      avatar: '${process.env.SERVER_URL}/uploads/avatar/default.jpg',
      coverImage: '${process.env.SERVER_URL}/uploads/coverImage/default.jpg',
      role: "user",
      profileCompletion: 50,
    });

    return res.status(200).send("register user");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid password or email");

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (!isPasswordValid)
      return res.status(400).send("invalid password or email");

    const jwtToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        coverImage: user.coverImage,
        studentId: user.studentId,
        bio: user.bio,
        facebookLink: user.facebookLink,
        walletAddress: user.walletAddress,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: 3600,
      },
    );

    return res.status(200).send({ accessToken: jwtToken });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
