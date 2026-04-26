const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const getListUser = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Lỗi server");
  }
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, role, status } = req.body;

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newUser = await userModel.create({
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
      role: role || "user",
      status: status || "active",
      bio: "",
      facebookLink: "",
      avatar: "http://localhost:8080/uploads/avatar/default.jpg",
      coverImage: "http://localhost:8080/uploads/coverImage/default.jpg",
      profileCompletion: 50,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Lỗi server");
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userName, email, password, role, status } = req.body;

    const updateData = {};
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    // Chỉ hash password nếu client gửi lên (không để trống)
    if (password && password.trim() !== "") {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    return res.status(200).send("Xóa người dùng thành công");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Lỗi server");
  }
};

const userDetail = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Lỗi server");
  }
};

module.exports = {
  getListUser,
  addUser,
  updateUser,
  deleteUser,
  userDetail,
};