import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useWriteContract, useAccount } from "wagmi";
import {
  FiBookOpen,
  FiSearch,
  FiCalendar,
  FiTag,
  FiX,
  FiAlertTriangle,
  FiLoader,
  FiShoppingBag,
  FiCheckCircle,
} from "react-icons/fi";
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

// step: "confirm" | "metamask" | "recording" | "success" | "error"
const CancelModal = ({ listing, onConfirm, onClose, step, errorMsg }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
      <div className="p-6">
        {step === "confirm" && (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                <FiAlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Huỷ bán lại?</h3>
                <p className="text-xs text-gray-500">
                  Yêu cầu xác nhận qua MetaMask
                </p>
              </div>
            </div>

            <p className="mb-2 text-sm text-gray-400">
              Tài liệu sẽ được gỡ khỏi marketplace:
            </p>
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="truncate text-sm font-semibold text-white">
                {listing.document?.title}
              </p>
              <p className="mt-0.5 text-xs text-cyan-400">
                {listing.price} ETH · Order #{listing.orderId}
              </p>
            </div>

            <p className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
              Sau khi huỷ, bạn có thể truy cập lại tài liệu nhưng người khác sẽ
              không thể mua cho đến khi bạn đăng bán lại.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Giữ lại
              </button>
              <button
                onClick={onConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
              >
                <FiX className="h-4 w-4" />
                Huỷ bán lại
              </button>
            </div>
          </>
        )}

        {(step === "metamask" || step === "recording") && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <FiLoader className="h-10 w-10 animate-spin text-orange-400" />
            <div>
              <p className="font-semibold text-white">
                {step === "metamask"
                  ? "Đang chờ xác nhận MetaMask..."
                  : "Đang ghi nhận giao dịch..."}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Vui lòng không đóng cửa sổ này
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <FiCheckCircle className="h-10 w-10 text-green-400" />
            <div>
              <p className="font-semibold text-white">Huỷ bán thành công!</p>
              <p className="mt-1 text-sm text-gray-400">
                Tài liệu đã được gỡ. Bạn có thể truy cập lại ngay bây giờ.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 transition-colors hover:text-white"
            >
              Đóng
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <FiX className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Huỷ thất bại</p>
              <p className="mt-1 text-sm text-red-400">{errorMsg}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 transition-colors hover:text-white"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ResellDocuments = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const authorId = userId;
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelStep, setCancelStep] = useState("confirm");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(
          `/api/marketplace/author/${authorId}/resell`,
        );
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [authorId]);

  const filtered = listings.filter((l) =>
    l.document?.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const openCancelModal = (listing) => {
    setCancelTarget(listing);
    setCancelStep("confirm");
    setCancelError("");
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;

    if (!isConnected) {
      setCancelError("Vui lòng kết nối ví MetaMask trước.");
      setCancelStep("error");
      return;
    }

    try {
      // Bước 1: User ký cancelOrder trên MetaMask
      setCancelStep("metamask");
      const txHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: CANCEL_ABI,
        functionName: "cancelOrder",
        args: [BigInt(cancelTarget.orderId)],
      });

      // Bước 2: Gửi txHash lên backend để verify & cập nhật DB
      setCancelStep("recording");
      await axios.post("/api/marketplace/cancel", {
        orderId: cancelTarget.orderId,
        txHash,
      });

      // Xoá khỏi danh sách
      setListings((prev) => prev.filter((l) => l._id !== cancelTarget._id));
      setCancelStep("success");
    } catch (err) {
      console.error("[cancelResell]", err);
      setCancelError(
        err?.response?.data?.message ||
          err?.shortMessage ||
          "Huỷ thất bại. Vui lòng thử lại.",
      );
      setCancelStep("error");
    }
  };

  const handleCloseModal = () => {
    if (cancelStep === "metamask" || cancelStep === "recording") return;
    setCancelTarget(null);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl p-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Tài liệu đang bán lại
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Danh sách tài liệu bạn đang rao bán lại trên marketplace.
          </p>
        </div>

        <div className="mb-6 flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20">
            <FiTag className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tổng đang bán lại</p>
            <p className="text-lg font-bold text-white">{listings.length}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <FiSearch className="h-4 w-4 shrink-0 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-gray-500">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <FiShoppingBag className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">
              {search
                ? "Không tìm thấy tài liệu phù hợp."
                : "Bạn chưa đăng bán lại tài liệu nào."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((listing) => {
              const doc = listing.document;
              return (
                <div
                  key={listing._id}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                    <FiBookOpen className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {doc?.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {doc?.author?.userName && (
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          {doc.author.userName}
                        </span>
                      )}
                      {doc?.subject && (
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          {doc.subject}
                        </span>
                      )}
                      {listing.createdAt && (
                        <span className="flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          {new Date(listing.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-400">
                      {listing.price} ETH
                    </span>
                    <button
                      onClick={() => navigate(`/documentDetail/${doc?._id}`)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => openCancelModal(listing)}
                      className="flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
                    >
                      <FiX className="h-3.5 w-3.5" />
                      Huỷ bán
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          listing={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={handleCloseModal}
          step={cancelStep}
          errorMsg={cancelError}
        />
      )}
    </>
  );
};

export default ResellDocuments;
