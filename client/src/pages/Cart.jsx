import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { HiOutlineShoppingCart, HiX, HiArrowLeft } from "react-icons/hi";
import {
  FileText,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ethers } from "ethers";
import axios from "../common";
import { jwtDecode } from "jwt-decode";

const MARKETPLACE_ABI = [
  "function executeOrder(uint256 orderId_) external payable",
  "event OrderMatched(uint256 indexed orderId, address indexed seller, address indexed buyer, uint256 price, uint256 marketplaceFee, uint256 royaltyAmount)",
];

const ITEM_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
};

const CHECKOUT_STEP = {
  IDLE: "idle",
  CHECKING: "checking",
  PROCESSING: "processing",
  DONE: "done",
};

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, removeMultipleFromCart } =
    useCart();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const payloadDecoded = jwtDecode(accessToken);
  const userId = payloadDecoded._id;

  const [walletModal, setWalletModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({
    balance: "0",
    required: "0",
  });

  const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEP.IDLE);
  const [itemStatuses, setItemStatuses] = useState({});
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const isProcessing =
    checkoutStep === CHECKOUT_STEP.PROCESSING ||
    checkoutStep === CHECKOUT_STEP.CHECKING;

  useEffect(() => {
    const statuses = {};
    cartItems.forEach((item) => {
      statuses[item._id] = { status: ITEM_STATUS.PENDING };
    });
    setItemStatuses(statuses);
  }, [cartItems.length]);

  const setItemStatus = (docId, update) => {
    setItemStatuses((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], ...update },
    }));
  };

  const fetchOrderId = async (documentId) => {
    console.log("Fetching listing for documentId:", documentId);
    const res = await axios.get(`/api/listing/active/${documentId}`);
    console.log("Listing response:", res.data);
    if (!res.data?.orderId) throw new Error("Không có listing active");
    return { orderId: res.data.orderId, price: res.data.price };
  };

  const handleCheckout = async () => {
    setCheckoutStep(CHECKOUT_STEP.CHECKING);

    let walletAddress = null;
    try {
      const { data } = await axios.get(`/api/wallet/walletInfo/${userId}`);
      walletAddress = data.connected ? data.walletAddress : null;
    } catch {
      walletAddress = null;
    }

    if (!walletAddress) {
      setCheckoutStep(CHECKOUT_STEP.IDLE);
      setWalletModal(true);
      return;
    }

    if (!window.ethereum) {
      setCheckoutStep(CHECKOUT_STEP.IDLE);
      setWalletModal(true);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (address.toLowerCase() !== walletAddress.toLowerCase()) {
        setCheckoutStep(CHECKOUT_STEP.IDLE);
        setBalanceInfo({
          balance: "—",
          required: total.toFixed(4),
          error: `Vui lòng chuyển sang ví đã liên kết:\n${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        });
        setBalanceModal(true);
        return;
      }

      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(ethers.formatEther(balanceWei));
      if (balanceEth < total) {
        setCheckoutStep(CHECKOUT_STEP.IDLE);
        setBalanceInfo({
          balance: balanceEth.toFixed(4),
          required: total.toFixed(4),
          shortfall: (total - balanceEth).toFixed(4),
        });
        setBalanceModal(true);
        return;
      }

      const marketplace = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS,
        MARKETPLACE_ABI,
        signer,
      );

      setCheckoutStep(CHECKOUT_STEP.PROCESSING);
      const succeededIds = [];

      for (const item of cartItems) {
        setItemStatus(item._id, { status: ITEM_STATUS.PROCESSING });

        try {
          const { orderId, price } = await fetchOrderId(item._id);
          const priceInWei = ethers.parseEther(String(price));

          const tx = await marketplace.executeOrder(orderId, {
            value: priceInWei,
          });
          const receipt = await tx.wait();

          if (receipt.status !== 1) {
            throw new Error("Transaction thất bại trên blockchain");
          }

          await axios.post("/api/marketplace/buy", {
            orderId,
            txHash: receipt.hash,
          });

          setItemStatus(item._id, {
            status: ITEM_STATUS.SUCCESS,
            txHash: receipt.hash,
          });
          succeededIds.push(item._id);
        } catch (err) {
          const message =
            err.code === 4001
              ? "Bạn đã từ chối giao dịch"
              : err.response?.data?.message ||
                err.message ||
                "Giao dịch thất bại";
          setItemStatus(item._id, {
            status: ITEM_STATUS.FAILED,
            error: message,
          });
        }
      }

      if (succeededIds.length > 0) {
        removeMultipleFromCart(succeededIds);
      }

      setCheckoutStep(CHECKOUT_STEP.DONE);
      setCheckoutDone(true);
      setSuccessCount(succeededIds.length);

      if (succeededIds.length > 0) {
        setSuccessModal(true);
      }
    } catch (err) {
      console.error("[checkout]", err);
      setCheckoutStep(CHECKOUT_STEP.IDLE);
    }
  };

  const StatusBadge = ({ docId }) => {
    const s = itemStatuses[docId];
    if (!s || checkoutStep === CHECKOUT_STEP.IDLE) return null;

    if (s.status === ITEM_STATUS.PROCESSING)
      return (
        <span className="flex items-center gap-1 text-xs text-blue-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang xử lý
        </span>
      );
    if (s.status === ITEM_STATUS.SUCCESS)
      return (
        <span className="flex items-center gap-1 text-xs text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          Thành công
        </span>
      );
    if (s.status === ITEM_STATUS.FAILED)
      return (
        <span
          className="flex items-center gap-1 text-xs text-red-400"
          title={s.error}
        >
          <XCircle className="h-3 w-3" />
          Thất bại
        </span>
      );
    return null;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <HiArrowLeft className="h-4 w-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-cyan-400">✦ Giỏ hàng</p>
          <h1 className="text-3xl font-bold text-white">Giỏ hàng của bạn</h1>
        </div>
        {cartItems.length > 0 && !isProcessing && !checkoutDone && (
          <button
            onClick={clearCart}
            className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {cartItems.length === 0 && !checkoutDone ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-24 backdrop-blur-md">
          <HiOutlineShoppingCart className="mb-4 h-16 w-16 text-gray-600" />
          <p className="mb-2 text-lg font-semibold text-gray-400">
            Giỏ hàng trống
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Hãy thêm tài liệu vào giỏ hàng
          </p>
          <button
            onClick={() => navigate("/document")}
            className="cursor-pointer rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Khám phá tài liệu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-3 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className={`flex items-start gap-4 rounded-xl border p-4 backdrop-blur-md transition-all ${
                  itemStatuses[item._id]?.status === ITEM_STATUS.SUCCESS
                    ? "border-green-500/30 bg-green-500/5"
                    : itemStatuses[item._id]?.status === ITEM_STATUS.FAILED
                      ? "border-red-500/30 bg-red-500/5"
                      : itemStatuses[item._id]?.status ===
                          ITEM_STATUS.PROCESSING
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="line-clamp-2 cursor-pointer text-sm font-semibold text-white hover:text-purple-300"
                    onClick={() =>
                      item._id && navigate(`/documentDetail/${item._id}`)
                    }
                  >
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.subject} · {item.category}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Tác giả: {item.author?.userName || "—"}
                  </p>
                  {itemStatuses[item._id]?.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${itemStatuses[item._id].txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate text-xs text-cyan-400 hover:underline"
                    >
                      Tx: {itemStatuses[item._id].txHash.slice(0, 20)}...
                    </a>
                  )}
                  {itemStatuses[item._id]?.error && (
                    <p className="mt-1 text-xs text-red-400">
                      {itemStatuses[item._id].error}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-sm font-bold text-purple-400">
                    {item.price > 0 ? `${item.price} ETH` : "Free"}
                  </span>
                  <StatusBadge docId={item._id} />
                  {!isProcessing &&
                    itemStatuses[item._id]?.status !== ITEM_STATUS.SUCCESS && (
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="cursor-pointer text-gray-600 transition hover:text-red-400"
                      >
                        <HiX size={16} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="self-start rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-bold text-white">Tổng đơn hàng</h2>
            <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between"
                >
                  <span className="line-clamp-1 max-w-[160px] text-xs text-gray-400">
                    {item.title}
                  </span>
                  <span className="text-xs font-medium text-white">
                    {item.price > 0 ? `${item.price} ETH` : "Free"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">
                Tổng cộng
              </span>
              <span className="text-xl font-black text-purple-400">
                {total.toFixed(4)} ETH
              </span>
            </div>

            {!checkoutDone ? (
              <>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutStep === CHECKOUT_STEP.CHECKING ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : checkoutStep === CHECKOUT_STEP.PROCESSING ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang thanh toán...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Thanh toán ngay
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate("/document")}
                  disabled={isProcessing}
                  className="mt-3 w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tiếp tục mua sắm
                </button>
                <p className="mt-4 text-center text-xs text-gray-600">
                  Giao dịch được ký bởi MetaMask của bạn qua Sepolia Testnet
                </p>
              </>
            ) : (
              <button
                onClick={() => navigate("/document")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Khám phá thêm
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Chưa liên kết ví */}
      {walletModal && (
        <Modal onClose={() => setWalletModal(false)}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15 ring-1 ring-yellow-500/30">
              <Wallet className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chưa liên kết ví</h3>
              <p className="mt-1 text-sm text-gray-400">
                Bạn cần liên kết ví MetaMask trước khi thanh toán. Vào trang cá
                nhân để kết nối ví.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <button
                onClick={() => {
                  setWalletModal(false);
                  navigate(`/profile/${userId}`);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Đến trang cá nhân <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setWalletModal(false)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-gray-400 transition hover:bg-white/10"
              >
                Để sau
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Không đủ số dư / Sai ví */}
      {balanceModal && (
        <Modal onClose={() => setBalanceModal(false)}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {balanceInfo.error ? "Sai địa chỉ ví" : "Số dư không đủ"}
              </h3>
              {balanceInfo.error ? (
                <p className="mt-1 text-sm whitespace-pre-line text-gray-400">
                  {balanceInfo.error}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-400">
                  Ví của bạn không đủ ETH để hoàn tất thanh toán.
                </p>
              )}
            </div>
            {!balanceInfo.error && (
              <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Số dư hiện tại</span>
                  <span className="font-bold text-white">
                    {balanceInfo.balance} ETH
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Cần thanh toán</span>
                  <span className="font-bold text-purple-400">
                    {balanceInfo.required} ETH
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-sm">
                  <span className="text-gray-400">Còn thiếu</span>
                  <span className="font-bold text-red-400">
                    {balanceInfo.shortfall} ETH
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setBalanceModal(false)}
              className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Đã hiểu
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Thanh toán thành công */}
      {successModal && (
        <Modal
          onClose={() => {
            setSuccessModal(false);
            navigate("/document");
          }}
        >
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
              <Sparkles className="h-10 w-10 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Cảm ơn bạn! 🎉</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {successCount} tài liệu đã được thêm vào thư viện của bạn thành
                công. Chúc bạn học tập hiệu quả!
              </p>
            </div>
            <button
              onClick={() => {
                setSuccessModal(false);
                navigate("/document");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Khám phá thêm tài liệu
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 transition hover:text-white"
        >
          <HiX size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
