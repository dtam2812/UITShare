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
} from "lucide-react";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FeaturedDocuments from "../../components/Home/FeaturedDocument";
import DocumentReviews from "../../components/DocumentReviews/DocumentReviews";
import DocumentInfo from "../../components/DocumentInfo/DocumentInfo";
import NFTInfo from "../../components/NFTInfo/NFTInfo";
import PDFPreviewModal from "../../components/PDFPreviewModal/PDFPreviewModal";
import { useCart } from "../../context/CartContext";
import axios from "../../common";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ACCESS_STATUS = {
  LOADING: "loading",
  OWNED: "owned",
  AUTHOR: "author",
  NOT_OWNED: "not_owned",
  GUEST: "guest",
};

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

  const [cartMsg, setCartMsg] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some((item) => item._id === doc?._id);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      setAccessStatus(ACCESS_STATUS.LOADING);
      try {
        const response = await axios.get(
          `/api/documents/documentDetail/${documentId}`,
        );
        if (response.status === 200) {
          setDoc(response.data);

          if (response.data.tokenId) {
            try {
              const historyRes = await axios.get(
                `/api/documents/nft-history/${response.data.tokenId}`,
              );
              setNftHistory(historyRes.data);
            } catch {
              setNftHistory([]);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy tài liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (!doc) return;

    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") {
      setAccessStatus(ACCESS_STATUS.GUEST);
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await axios.get(`/api/marketplace/access/${doc._id}`);
        const { hasAccess, reason } = res.data;
        if (!hasAccess) {
          setAccessStatus(ACCESS_STATUS.NOT_OWNED);
          return;
        } else if (reason === "author") setAccessStatus(ACCESS_STATUS.AUTHOR);
        else if (reason === "owner") setAccessStatus(ACCESS_STATUS.OWNED);
        else setAccessStatus(ACCESS_STATUS.NOT_OWNED);
      } catch {
        setAccessStatus(ACCESS_STATUS.NOT_OWNED);
      }
    };

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

    setAddingToCart(true);
    const result = await addToCart(doc);
    setAddingToCart(false);

    if (result.success) {
      showCartMsg("added");
    } else {
      showCartMsg(result.reason);
    }
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
    ) {
      return;
    }

    if (!isInCart) {
      setAddingToCart(true);
      const result = await addToCart(doc);
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

  const renderActionButtons = () => {
    if (canAccessFull) {
      return (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 py-3 font-semibold text-green-400"
        >
          <Check className="h-4 w-4" />
          {accessStatus === ACCESS_STATUS.AUTHOR
            ? "Tài liệu của bạn"
            : "Bạn đã sở hữu tài liệu này"}
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
          <Loader2 className="h-4 w-4 animate-spin" />
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
          {addingToCart ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
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
          {isInCart ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
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
          <ArrowLeft className="h-4 w-4" />
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
                      <FileText className="h-10 w-10 text-purple-400 opacity-50" />
                      <p className="text-xs text-gray-400">Loading PDF...</p>
                    </div>
                  }
                  error={
                    <div className="flex h-full flex-col items-center justify-center gap-2 pt-24">
                      <FileText className="h-10 w-10 text-purple-400 opacity-50" />
                      <p className="text-xs text-gray-600">
                        Preview không khả dụng
                      </p>
                    </div>
                  }
                >
                  {Array.from(
                    new Array(Math.min(numPages || 0, 3)),
                    (_, index) => (
                      <Page key={index} pageNumber={index + 1} width={250} />
                    ),
                  )}
                </Document>
              </div>

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

              {canAccessFull ? (
                <button
                  onClick={() => navigate(`/documentReading/${doc._id}`)}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/20"
                >
                  <BookOpen className="h-4 w-4" />
                  Đọc tài liệu
                </button>
              ) : (
                <button
                  onClick={() => setShowPreview(true)}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem trước tài liệu
                </button>
              )}

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
                  <User className="h-3.5 w-3.5" />
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
    </section>
  );
}
