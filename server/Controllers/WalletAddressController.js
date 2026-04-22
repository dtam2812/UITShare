const User = require("../Models/UserModel");
const axios = require("axios");

const updateWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "walletAddress is required" });
    }

    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(walletAddress)) {
      return res
        .status(400)
        .json({ message: "Invalid Ethereum wallet address" });
    }

    // Check if another user already owns this wallet
    const existing = await User.findOne({ walletAddress });
    if (existing && existing._id.toString() !== userId) {
      return res.status(409).json({
        message: "Ví này đã được liên kết với tài khoản khác.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { walletAddress },
      { new: true, select: "-password" },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Wallet address updated successfully",
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    // Catch any race-condition duplicate key errors that slip through
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ví này đã được liên kết với tài khoản khác.",
      });
    }
    console.error("[updateWallet]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const disconnectWallet = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, { $unset: { walletAddress: "" } });

    return res
      .status(200)
      .json({ message: "Wallet disconnected successfully" });
  } catch (error) {
    console.error("[disconnectWallet]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWalletInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Lấy wallet address từ DB
    const user = await User.findById(userId).select("walletAddress");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.walletAddress) {
      return res.status(200).json({ connected: false, walletAddress: null });
    }

    const address = user.walletAddress;
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    const ETHERSCAN_BASE = "https://api.etherscan.io/v2/api";

    //  2. Kiểm tra API key
    if (!ETHERSCAN_API_KEY) {
      return res.status(200).json({
        connected: true,
        walletAddress: address,
        balance: "0",
        nftCount: 0,
        nfts: [],
        transactions: [],
        warning: "ETHERSCAN_API_KEY chưa được cấu hình",
      });
    }

    // 3. Gọi tuần tự cách nhau 400ms
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const BASE_PARAMS = { chainid: 11155111, apikey: ETHERSCAN_API_KEY };

    const safeGet = async (params) => {
      try {
        const res = await axios.get(ETHERSCAN_BASE, {
          params: { ...BASE_PARAMS, ...params },
          timeout: 10000,
        });
        return res;
      } catch (err) {
        return { data: { status: "0", message: err.message, result: [] } };
      }
    };

    const balanceRes = await safeGet({
      module: "account",
      action: "balance",
      address,
      tag: "latest",
    });
    await delay(400);
    const txListRes = await safeGet({
      module: "account",
      action: "txlist",
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 10,
      sort: "desc",
    });
    await delay(400);
    const nftRes = await safeGet({
      module: "account",
      action: "tokennfttx",
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 50,
      sort: "desc",
    });

    //4. Xử lý Balance
    let balanceEth = "0";
    {
      const { status, result, message } = balanceRes.data;
      if (status === "1") {
        balanceEth = (Number(BigInt(result)) / 1e18).toFixed(6);
      } else {
        console.warn("[getWalletInfo] Balance error:", message);
      }
    }

    // 5. Xử lý Transactions
    let transactions = [];
    {
      const { status, result, message } = txListRes.data;
      if (status === "1" && Array.isArray(result)) {
        transactions = result.map((tx) => {
          const isIncoming = tx.to?.toLowerCase() === address.toLowerCase();
          const valueEth = (Number(tx.value) / 1e18).toFixed(4);
          const date = new Date(Number(tx.timeStamp) * 1000).toLocaleDateString(
            "vi-VN",
          );
          return {
            hash: tx.hash,
            title: isIncoming ? "Nhận ETH" : "Gửi ETH",
            date,
            amount: isIncoming ? `+ ${valueEth} ETH` : `- ${valueEth} ETH`,
            status: tx.isError === "0" ? "Thành công" : "Thất bại",
            isIncoming,
            from: tx.from,
            to: tx.to,
          };
        });
      } else if (message !== "No transactions found") {
        console.warn("[getWalletInfo] TxList error:", message);
      }
    }

    // 6. Xử lý NFTs
    let nftCount = 0;
    let nfts = [];
    {
      const { status, result } = nftRes.data;
      if (status === "1" && Array.isArray(result)) {
        const nftMap = new Map();
        result.forEach((tx) => {
          const key = `${tx.contractAddress}-${tx.tokenID}`;
          if (!nftMap.has(key)) nftMap.set(key, tx);
        });
        nfts = [...nftMap.values()]
          .filter((tx) => tx.to?.toLowerCase() === address.toLowerCase())
          .map((tx) => ({
            tokenId: tx.tokenID,
            contractAddress: tx.contractAddress,
            tokenName: tx.tokenName,
            tokenSymbol: tx.tokenSymbol,
          }));
        nftCount = nfts.length;
      }
    }

    return res.status(200).json({
      connected: true,
      walletAddress: address,
      balance: balanceEth,
      nftCount,
      nfts,
      transactions,
    });
  } catch (error) {
    console.error("[getWalletInfo] Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateWallet, disconnectWallet, getWalletInfo };
