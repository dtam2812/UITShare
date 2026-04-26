import { useState } from "react";
import { AlertTriangle, X, Loader2, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import axios from "../../common";

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

const CANCEL_ABI = [
  {
    name: "cancelOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId_", type: "uint256" }],
    outputs: [],
  },
];

export default function CancelListingModal({ listing, onClose, onSuccess }) {
  const [step, setStep] = useState("confirm"); // confirm | metamask | recording | success | error
  const [error, setError] = useState("");
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleCancel = async () => {
    if (!isConnected) {
      setError("Vui lòng kết nối ví MetaMask trước.");
      setStep("error");
      return;
    }
    try {
      setStep("metamask");
      const txHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: CANCEL_ABI,
        functionName: "cancelOrder",
        args: [BigInt(listing.orderId)],
      });

      setStep("recording");
      await axios.post("/api/marketplace/cancel", {
        orderId: listing.orderId,
        txHash,
      });

      setStep("success");
      onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.shortMessage || "Huỷ thất bại. Vui lòng thử lại.",
      );
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
        <div className="p-6">
          {step === "confirm" && (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <AlertTriangle size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Huỷ bán lại?</h3>
                  <p className="text-xs text-gray-500">Yêu cầu xác nhận qua MetaMask</p>
                </div>
              </div>

              <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                Sau khi huỷ, bạn có thể truy cập lại tài liệu nhưng người khác sẽ không thể mua
                cho đến khi bạn đăng bán lại.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Giữ lại
                </button>
                <button
                  onClick={handleCancel}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2.5 text-sm font-medium text-orange-400 hover:bg-orange-500/20"
                >
                  <X size={14} />
                  Huỷ bán lại
                </button>
              </div>
            </>
          )}

          {(step === "metamask" || step === "recording") && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Loader2 size={40} className="animate-spin text-orange-400" />
              <div>
                <p className="font-semibold text-white">
                  {step === "metamask"
                    ? "Đang chờ xác nhận MetaMask..."
                    : "Đang ghi nhận giao dịch..."}
                </p>
                <p className="mt-1 text-xs text-gray-500">Vui lòng không đóng cửa sổ này</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle size={40} className="text-green-400" />
              <div>
                <p className="font-semibold text-white">Huỷ bán thành công!</p>
                <p className="mt-1 text-sm text-gray-400">
                  Bạn có thể đọc lại tài liệu ngay bây giờ.
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
                <p className="font-semibold text-white">Huỷ thất bại</p>
                <p className="mt-1 text-sm text-red-400">{error}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 hover:text-white"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}