const mongoose = require("mongoose");
 
const SubjectSchema = new mongoose.Schema({
  _id: {
    type: String, // Dùng mã môn làm _id luôn, VD: "MA006", "IT003"
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Đại cương", "Cơ sở ngành", "Chuyên ngành"],
  },
});
 
module.exports = mongoose.model("Subject", SubjectSchema);
 