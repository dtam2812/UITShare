const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./Router/UserRoute");
const authRoute = require("./Router/AuthRoute");
const documentRoute = require("./Router/DocumentRoute");
const personalRoute = require("./Router/PersonalRoute");
const authorRoute = require("./Router/AuthorRoute");
const marketplaceRoute = require("./Router/MarketplaceRoute");
const listingRoute = require("./Router/ListingRoute");
const walletRoute = require("./Router/WalletRoute");
const transactionRoute = require("./Router/TransactionRoute");
const nftRoute = require("./Router/NFTRoute");

//cors middleware for all request
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//connect database
const connectDb = require("./Services/ConnectDbService");
connectDb();

//middleware router
app.use("/auth/admin", userRouter);
app.use("/api/nfts", nftRoute);
app.use("/api/personal", personalRoute);
app.use("/api/auth", authRoute);
app.use("/api/documents", documentRoute);
app.use("/api/author", authorRoute);
app.use("/api/marketplace", marketplaceRoute);
app.use("/api/listing", listingRoute);
app.use("/api/wallet", walletRoute);
app.use("/api/transactions", transactionRoute);

app.listen(process.env.PORT, function () {
  console.log("server is running");
});
