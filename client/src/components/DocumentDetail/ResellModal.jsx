import { useState } from "react";
import { Tag, X, Loader2, CheckCircle } from "lucide-react";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import axios from "../../common";

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
const NFT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

const NFT_ABI = [
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved) external",
];
const MARKETPLACE_ABI = [
  "function addOrder(uint256 tokenId_, uint256 amount_, uint256 price_) external",
  "event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price)",
];

export default function ResellModal({ doc, onClose, onSuccess }) {
  const [step, setStep] = useState("confirm"); // confirm | processing | success | error
  const [error, setError] = useState("");

  const handleSell = async () => {
    setStep("processing");
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);
      const walletAddress = decoded?.walletAddress;

      if (!walletAddress || walletAddress === "null") {
        setError("Bạn chưa liên kết ví MetaMask.");
        setStep("error");
        return;
      }
      if (!window.ethereum) {
        setError("Không tìm thấy MetaMask.");
        setStep("error");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (address.toLowerCase() !== walletAddress.toLowerCase()) {
        setError(
          `Vui lòng chuyển sang ví đã liên kết:\n${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        );
        setStep("error");
        return;
      }

      const nftRes = await axios.get(`/api/nfts/myNFTs`);
      const nft = nftRes.data.find((n) => n.tokenId === doc.tokenId);
      if (!nft || nft.amount < 1) {
        setError("Không tìm thấy NFT trong tài khoản của bạn.");
        setStep("error");
        return;
      }

      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
      const isApproved = await nftContract.isApprovedForAll(address, MARKETPLACE_ADDRESS);
      if (!isApproved) {
        const approveTx = await nftContract.setApprovalForAll(MARKETPLACE_ADDRESS, true);
        await approveTx.wait();
      }

      const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
      const priceInWei = ethers.parseEther(String(doc.price));
      const tx = await marketplace.addOrder(doc.tokenId, 1, priceInWei);
      const receipt = await tx.wait();

      if (receipt.status !== 1) throw new Error("Transaction thất bại trên blockchain");

      const iface = new ethers.Interface(MARKETPLACE_ABI);
      let orderId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "OrderAdded") {
            orderId = parsed.args.orderId.toString();
            break;
          }
        } catch {}
      }
      if (!orderId) throw new Error("Không lấy được orderId từ event");

      await axios.post("/api/marketplace/list", {
        documentId: doc._id,
        tokenId: doc.tokenId,
        amount: 1,
        price: doc.price,
        orderId,
        txHash: receipt.hash,
        isOriginalCreator: false,
      });

      setStep("success");
      onSuccess();
    } catch (err) {
      if (err.code === 4001) {
        setError("Bạn đã từ chối giao dịch.");
      } else {
        setError(err.response?.data?.message || err.message || "Lỗi không xác định");
      }
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
        <div className="p-6">
          {step === "confirm" && (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                  <Tag size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Bán lại tài liệu</h3>
                  <p className="text-xs text-gray-500">Đăng lên marketplace</p>
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="truncate text-sm font-semibold text-white">{doc.title}</p>
                <p className="mt-0.5 text-xs text-cyan-400">{doc.price} ETH</p>
              </div>

              <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                Giá bán bằng giá gốc của tác giả và tác giả sẽ nhận được phần trăm từ doanh thu
                bán lại. Trong thời gian bán lại, bạn{" "}
                <span className="font-semibold">không thể đọc</span> tài liệu này cho đến khi huỷ
                bán hoặc ai đó mua.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSell}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Tag size={14} />
                  Xác nhận bán lại
                </button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Loader2 size={40} className="animate-spin text-cyan-400" />
              <div>
                <p className="font-semibold text-white">Đang xử lý giao dịch...</p>
                <p className="mt-1 text-xs text-gray-500">Vui lòng không đóng cửa sổ này</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle size={40} className="text-green-400" />
              <div>
                <p className="font-semibold text-white">Đăng bán thành công! 🎉</p>
                <p className="mt-1 text-sm text-gray-400">
                  Tài liệu đã được đăng lên marketplace.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 hover:text-white"
              >
                Đóng
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <X size={24} className="text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Đăng bán thất bại</p>
                <p className="mt-1 text-sm whitespace-pre-line text-red-400">{error}</p>
              </div>
              <button
                onClick={() => setStep("confirm")}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 hover:text-white"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}