import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  ExternalLink,
  ShoppingCart,
  User,
  FileText,
  Check,
  Loader2,
  BookOpen,
  Tag,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import { useWriteContract, useAccount } from "wagmi";
import FeaturedDocuments from "../../components/Home/FeaturedDocument";
import DocumentReviews from "../../components/DocumentReviews/DocumentReviews";
import DocumentInfo from "../../components/DocumentInfo/DocumentInfo";
import NFTInfo from "../../components/NFTInfo/NFTInfo";
import PDFPreviewModal from "../../components/PDFPreviewModal/PDFPreviewModal";
import { useCart } from "../../context/CartContext";
import axios from "../../common";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSearchParams } from "react-router";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
const CANCEL_ABI = [
  {
    name: "cancelOrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId_", type: "uint256" }],
    outputs: [],
  },
];

const ACCESS_STATUS = {
  LOADING: "loading",
  OWNED: "owned", // sở hữu, chưa list
  LISTED: "listed", // đang bán lại
  AUTHOR: "author",
  NOT_OWNED: "not_owned",
  GUEST: "guest",
};

// Resell Modal
const ResellModal = ({ doc, onClose, onSuccess }) => {
  const [step, setStep] = useState("confirm"); // confirm|processing|success|error
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

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
      const isApproved = await nftContract.isApprovedForAll(
        address,
        MARKETPLACE_ADDRESS,
      );
      if (!isApproved) {
        const approveTx = await nftContract.setApprovalForAll(
          MARKETPLACE_ADDRESS,
          true,
        );
        await approveTx.wait();
      }

      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        signer,
      );
      const priceInWei = ethers.parseEther(String(doc.price));
      const tx = await marketplace.addOrder(doc.tokenId, 1, priceInWei);
      const receipt = await tx.wait();

      if (receipt.status !== 1)
        throw new Error("Transaction thất bại trên blockchain");

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

      setTxHash(receipt.hash);
      setStep("success");
      onSuccess();
    } catch (err) {
      if (err.code === 4001) {
        setError("Bạn đã từ chối giao dịch.");
      } else {
        setError(
          err.response?.data?.message || err.message || "Lỗi không xác định",
        );
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
                <p className="truncate text-sm font-semibold text-white">
                  {doc.title}
                </p>
                <p className="mt-0.5 text-xs text-cyan-400">{doc.price} ETH</p>
              </div>

              <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                Giá bán bằng giá gốc của tác giả và tác giả sẽ nhận được phần
                trăm từ doanh thu bán lại. Trong thời gian bán lại, bạn{" "}
                <span className="font-semibold">không thể đọc</span> tài liệu
                này cho đến khi huỷ bán hoặc ai đó mua.
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
                <p className="font-semibold text-white">
                  Đang xử lý giao dịch...
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Vui lòng không đóng cửa sổ này
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle size={40} className="text-green-400" />
              <div>
                <p className="font-semibold text-white">
                  Đăng bán thành công! 🎉
                </p>
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
                <p className="mt-1 text-sm whitespace-pre-line text-red-400">
                  {error}
                </p>
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
};

//  Cancel Listing Modal
const CancelListingModal = ({ listing, onClose, onSuccess }) => {
  const [step, setStep] = useState("confirm"); // confirm|metamask|recording|success|error
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
        err?.response?.data?.message ||
          err?.shortMessage ||
          "Huỷ thất bại. Vui lòng thử lại.",
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
                  <p className="text-xs text-gray-500">
                    Yêu cầu xác nhận qua MetaMask
                  </p>
                </div>
              </div>

              <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
                Sau khi huỷ, bạn có thể truy cập lại tài liệu nhưng người khác
                sẽ không thể mua cho đến khi bạn đăng bán lại.
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
                <p className="mt-1 text-xs text-gray-500">
                  Vui lòng không đóng cửa sổ này
                </p>
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
};

// Main Component
export default function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [nftHistory, setNftHistory] = useState([]);
  const [accessStatus, setAccessStatus] = useState(ACCESS_STATUS.LOADING);
  const [searchParams] = useSearchParams();
  const [resellListing, setResellListing] = useState(null);

  const [activeListing, setActiveListing] = useState(null);

  const [cartMsg, setCartMsg] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some((item) => item._id === doc?._id);

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      setAccessStatus(ACCESS_STATUS.LOADING);
      try {
        const response = await axios.get(
          `/api/documents/documentDetail/${documentId}`,
        );
        if (response.status === 200) setDoc(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy tài liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    const listingId = searchParams.get("listingId");
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/marketplace/listing/${listingId}`);
        setResellListing(res.data);
      } catch {
        setResellListing(null);
      }
    };
    fetchListing();
  }, [searchParams]);

  const checkAccess = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") {
      setAccessStatus(ACCESS_STATUS.GUEST);
      return;
    }
    try {
      const res = await axios.get(`/api/marketplace/access/${doc._id}`);
      const { hasAccess, reason } = res.data;

      if (reason === "author") {
        setAccessStatus(ACCESS_STATUS.AUTHOR);
      } else if (reason === "listed") {
        setAccessStatus(ACCESS_STATUS.LISTED);
        try {
          const decoded = jwtDecode(token);
          const listRes = await axios.get(
            `/api/marketplace/author/${decoded._id || decoded.id}/resell`,
          );
          const found = listRes.data.find(
            (l) => l.document?._id === doc._id || l.document === doc._id,
          );
          setActiveListing(found || null);
        } catch {}
      } else if (hasAccess) {
        setAccessStatus(ACCESS_STATUS.OWNED);
        setActiveListing(null);
      } else {
        setAccessStatus(ACCESS_STATUS.NOT_OWNED);
        setActiveListing(null);
      }
    } catch {
      setAccessStatus(ACCESS_STATUS.NOT_OWNED);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [doc]);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const showCartMsg = (msg) => {
    setCartMsg(msg);
    setTimeout(() => setCartMsg(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }
    if (
      accessStatus === ACCESS_STATUS.OWNED ||
      accessStatus === ACCESS_STATUS.AUTHOR
    ) {
      showCartMsg("already_owned");
      return;
    }

    const listingId = searchParams.get("listingId");

    setAddingToCart(true);
    const result = await addToCart(doc, listingId || null);
    setAddingToCart(false);
    showCartMsg(result.success ? "added" : result.reason);
  };

  const handleBuyNow = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }
    if (
      accessStatus === ACCESS_STATUS.OWNED ||
      accessStatus === ACCESS_STATUS.AUTHOR
    )
      return;

    const listingId = searchParams.get("listingId");

    if (!isInCart) {
      setAddingToCart(true);
      const result = await addToCart(doc, listingId || null);
      setAddingToCart(false);
      if (!result.success && result.reason === "already_owned") {
        showCartMsg("already_owned");
        return;
      }
    }
    navigate("/cart");
  };

  const canAccessFull =
    accessStatus === ACCESS_STATUS.OWNED ||
    accessStatus === ACCESS_STATUS.AUTHOR;

  // Action Buttons
  const renderActionButtons = () => {
    if (accessStatus === ACCESS_STATUS.LISTED) {
      return (
        <div className="flex flex-col gap-2">
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-3 font-semibold text-cyan-400"
          >
            <Tag size={16} />
            Đang bán lại trên marketplace
          </button>
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20"
          >
            <X size={14} />
            Huỷ bán lại
          </button>
        </div>
      );
    }

    if (accessStatus === ACCESS_STATUS.OWNED) {
      return (
        <div className="flex flex-col gap-2">
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 py-3 font-semibold text-green-400"
          >
            <Check size={16} />
            Bạn đã sở hữu tài liệu này
          </button>
          <button
            onClick={() => setShowResellModal(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
          >
            <Tag size={14} />
            Bán lại tài liệu
          </button>
        </div>
      );
    }

    // Là tác giả
    if (accessStatus === ACCESS_STATUS.AUTHOR) {
      return (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 py-3 font-semibold text-green-400"
        >
          <Check size={16} />
          Tài liệu của bạn
        </button>
      );
    }

    if (accessStatus === ACCESS_STATUS.GUEST) {
      return (
        <button
          onClick={() => navigate("/login")}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-semibold text-white transition hover:bg-purple-600"
        >
          Đăng nhập để mua
        </button>
      );
    }

    if (accessStatus === ACCESS_STATUS.LOADING) {
      return (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-purple-500/50 py-3 font-semibold text-white"
        >
          <Loader2 size={16} className="animate-spin" />
          Đang kiểm tra...
        </button>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={handleBuyNow}
          disabled={addingToCart}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addingToCart && <Loader2 size={16} className="animate-spin" />}
          Mua tài liệu ngay
        </button>
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || isInCart}
          title={isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
          className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-3 transition disabled:cursor-not-allowed ${
            isInCart
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-white/10 bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          {isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
        </button>
      </div>
    );
  };

  const cartMsgMap = {
    added: { text: "Đã thêm vào giỏ hàng ✓", color: "text-green-400" },
    already_in_cart: {
      text: "Tài liệu đã có trong giỏ hàng",
      color: "text-yellow-400",
    },
    already_owned: {
      text: "Bạn đã sở hữu tài liệu này",
      color: "text-yellow-400",
    },
  };

  if (loading) {
    return (
      <section className="relative px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl py-32 text-center text-gray-400">
          Đang tải...
        </div>
      </section>
    );
  }

  if (error || !doc) {
    return (
      <section className="relative px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl py-32 text-center text-gray-400">
          {error || "Không tìm thấy tài liệu"}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div
          className="pointer-events-none fixed top-0 -left-40 h-150 w-150 bg-purple-600/20 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          className="pointer-events-none fixed top-1/2 -right-40 h-150 w-150 bg-blue-500/40 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          className="pointer-events-none fixed bottom-0 -left-40 h-150 w-150 bg-purple-600/30 blur-[120px]"
          style={{ zIndex: 0 }}
        />

        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Quay lại</span>
        </button>

        <p className="mb-2 text-sm font-semibold text-cyan-400">
          ✦ Chi tiết tài liệu
        </p>
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">{doc.title}</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <DocumentInfo doc={doc} reviewCount={doc.commentCount} />
            <NFTInfo nft={doc} nftHistory={nftHistory} />
            <DocumentReviews />
          </div>

          <div className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-5 flex h-80 w-full flex-col items-center gap-4 overflow-y-auto rounded-lg bg-black/40 p-3">
                <Document
                  file={doc.fileUrl}
                  onLoadSuccess={onLoadSuccess}
                  loading={
                    <div className="flex h-full flex-col items-center justify-center gap-2 pt-24">
                      <FileText
                        size={40}
                        className="text-purple-400 opacity-50"
                      />
                      <p className="text-xs text-gray-400">Loading PDF...</p>
                    </div>
                  }
                  error={
                    <div className="flex h-full flex-col items-center justify-center gap-2 pt-24">
                      <FileText
                        size={40}
                        className="text-purple-400 opacity-50"
                      />
                      <p className="text-xs text-gray-600">
                        Preview không khả dụng
                      </p>
                    </div>
                  }
                >
                  {Array.from(new Array(Math.min(numPages || 0, 3)), (_, i) => (
                    <Page key={i} pageNumber={i + 1} width={250} />
                  ))}
                </Document>
              </div>

              {/* Resell banner — chỉ hiện khi đến từ listing của người khác */}
              {resellListing && !resellListing.isOriginalCreator && (
                <div className="mb-2 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <AlertTriangle
                    size={14}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />
                  <div>
                    <p className="pb-2 text-xs font-semibold text-amber-300">
                      Tài liệu bán lại — không phải từ tác giả gốc
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-[10px] font-bold text-purple-300">
                        {resellListing.seller?.userName?.[0]?.toUpperCase() ||
                          "?"}
                      </div>
                      <Link
                        to={`/author/${resellListing.seller?._id}`}
                        className="truncate text-xs text-amber-400 underline underline-offset-2 hover:text-amber-300"
                      >
                        {resellListing.seller?.userName || "Người dùng"}
                      </Link>
                      <span className="text-xs text-amber-500/70">
                        đang bán lại
                      </span>
                    </div>
                    <p className="mt-1 pt-2 text-[11px] text-amber-500/70">
                      Tác giả gốc:{" "}
                      <span className="font-medium text-amber-400">
                        {doc.author?.userName}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-1 flex items-end gap-2">
                <span className="text-3xl font-black text-white">
                  {doc.price > 0 ? doc.price : "Free"}
                </span>
                {doc.price > 0 && (
                  <span className="mb-1 font-bold text-purple-400">ETH</span>
                )}
              </div>

              <div className="mb-1">{renderActionButtons()}</div>

              {cartMsg && cartMsgMap[cartMsg] && (
                <p
                  className={`mt-2 text-center text-xs ${cartMsgMap[cartMsg].color}`}
                >
                  {cartMsgMap[cartMsg].text}
                </p>
              )}

              {/* Nút đọc: chỉ hiện khi owned/author và KHÔNG đang bán lại */}
              {canAccessFull ? (
                <button
                  onClick={() => navigate(`/documentReading/${doc._id}`)}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/20"
                >
                  <BookOpen size={16} />
                  Đọc tài liệu
                </button>
              ) : accessStatus !== ACCESS_STATUS.LISTED ? (
                <button
                  onClick={() => setShowPreview(true)}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <ExternalLink size={16} />
                  Xem trước tài liệu
                </button>
              ) : null}

              <div className="my-5 border-t border-white/10" />

              <div className="flex justify-between text-center">
                {[
                  { label: "Trang", value: doc.pageCount ?? "—" },
                  {
                    label: "Rating",
                    value: doc.averageRating ? `${doc.averageRating} ★` : "—",
                  },
                  { label: "Downloads", value: doc.downloadCount ?? 0 },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-base font-bold text-white">{s.value}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-blue-500 font-bold text-white">
                  {doc.author?.userName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {doc.author?.userName || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.author?.email || ""}
                  </p>
                </div>
              </div>
              <Link to={`/author/${doc.author?._id}`}>
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
                  <User size={14} />
                  Xem trang tác giả
                </button>
              </Link>
            </div>
          </div>
        </div>

        <FeaturedDocuments badge="✦ Liên quan" title="Tài liệu cùng chủ đề" />
      </div>

      {showPreview && (
        <PDFPreviewModal
          file={doc.fileUrl}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showResellModal && (
        <ResellModal
          doc={doc}
          onClose={() => setShowResellModal(false)}
          onSuccess={() => {
            setShowResellModal(false);
            checkAccess();
          }}
        />
      )}

      {showCancelModal && activeListing && (
        <CancelListingModal
          listing={activeListing}
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => {
            setShowCancelModal(false);
            checkAccess();
          }}
        />
      )}
    </section>
  );
}
