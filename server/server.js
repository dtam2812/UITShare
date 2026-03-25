const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./Router/UserRoute");
const authRoute = require("./Router/AuthRoute");
const documentRoute = require("./Router/DocumentRoute");

//cors middleware for all request
app.use(cors());
app.use(express.json());

//connect database
const connectDb = require("./Services/ConnectDbService");
connectDb();

//middleware router
app.use("/auth/admin", userRouter);
app.use("/api/auth", authRoute);
app.use("/api/auth", documentRoute);

app.listen(process.env.PORT, function () {
  console.log("server is running");
});
