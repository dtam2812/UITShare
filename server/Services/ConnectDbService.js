const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("connect db successfully");
  } catch (error) {
    console.log("connect db failed: ", error);
  }
};

module.exports = connectDb;
