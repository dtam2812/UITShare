import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ArrowLeft,
  Download,
  Tag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import axios from "../common";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MARKETPLACE_ABI = [
  "function addOrder(uint256 tokenId_, uint256 amount_, uint256 price_) external",
  "event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price)",
];

export default function DocumentReading() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);

  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [sellStep, setSellStep] = useState("idle");
  const [sellError, setSellError] = useState("");
  const [sellTxHash, setSellTxHash] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(
          `/api/documents/documentDetail/${documentId}`,
        );
        setDoc(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy tài liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [documentId]);

  const onLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  const handleDownload = async () => {
    if (!doc?.fileUrl) return;
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = `${doc.title}.pdf`;
    link.target = "_blank";
    link.click();
    try {
      await axios.post(`/api/documents/download/${doc._id}`);
    } catch {}
  };

  const handleSell = async () => {
    setSellStep("processing");
    setSellError("");

    try {
      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);
      const walletAddress = decoded?.walletAddress;

      if (!walletAddress || walletAddress === "null") {
        setSellError("Bạn chưa liên kết ví MetaMask.");
        setSellStep("error");
        return;
      }

      if (!window.ethereum) {
        setSellError("Không tìm thấy MetaMask.");
        setSellStep("error");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (address.toLowerCase() !== walletAddress.toLowerCase()) {
        setSellError(
          `Vui lòng chuyển sang ví đã liên kết:\n${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        );
        setSellStep("error");
        return;
      }

      const nftRes = await axios.get(`/api/nft/my`);
      const nft = nftRes.data.find((n) => n.tokenId === doc.tokenId);
      if (!nft || nft.amount < 1) {
        setSellError("Không tìm thấy NFT trong tài khoản của bạn.");
        setSellStep("error");
        return;
      }

      const marketplace = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS,
        MARKETPLACE_ABI,
        signer,
      );

      const priceInWei = ethers.parseEther(String(sellPrice));
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
        price: parseFloat(sellPrice),
        orderId,
        txHash: receipt.hash,
        isOriginalCreator: false,
      });

      setSellTxHash(receipt.hash);
      setSellStep("success");
    } catch (err) {
      if (err.code === 4001) {
        setSellError("Bạn đã từ chối giao dịch.");
      } else {
        setSellError(
          err.response?.data?.message || err.message || "Lỗi không xác định",
        );
      }
      setSellStep("error");
    }
  };

  const closeSellModal = () => {
    setShowSellModal(false);
    setSellStep("idle");
    setSellError("");
    setSellPrice("");
    setSellTxHash("");
    if (sellStep === "success") navigate(`/documentDetail/${documentId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-gray-400">
        {error || "Không tìm thấy tài liệu"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#080812]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <span className="text-gray-700">|</span>
            <p className="line-clamp-1 max-w-xs text-sm font-semibold text-white">
              {doc.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Tải tài liệu
            </button>
            <button
              onClick={() => setShowSellModal(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Tag className="h-4 w-4" />
              Bán tài liệu
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Page controls */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-300">
              Trang <span className="font-bold text-white">{currentPage}</span>
              {" / "}
              <span className="text-gray-400">{numPages || "—"}</span>
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(numPages || p, p + 1))
              }
              disabled={currentPage >= (numPages || 1)}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[48px] text-center text-sm text-gray-400">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF pages */}
        <div className="flex flex-col items-center gap-4">
          <Document
            file={doc.fileUrl}
            onLoadSuccess={onLoadSuccess}
            loading={
              <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5">
                <FileText className="h-12 w-12 text-purple-400 opacity-50" />
                <p className="text-sm text-gray-400">Đang tải tài liệu...</p>
              </div>
            }
            error={
              <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5">
                <FileText className="h-12 w-12 text-red-400 opacity-50" />
                <p className="text-sm text-gray-400">Không thể tải tài liệu</p>
              </div>
            }
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />
            </div>
          </Document>
        </div>

        {/* Bottom page nav */}
        {numPages && numPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Trang trước
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trang sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={sellStep !== "processing" ? closeSellModal : undefined}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 shadow-2xl">
            {sellStep !== "processing" && (
              <button
                onClick={closeSellModal}
                className="absolute top-4 right-4 cursor-pointer text-gray-600 transition hover:text-white"
              >
                <X size={18} />
              </button>
            )}

            {sellStep === "idle" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/15 ring-1 ring-purple-500/30">
                    <Tag className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Bán tài liệu
                    </h3>
                    <p className="text-sm text-gray-500">
                      Đăng bán NFT lên marketplace
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                    <div className="text-sm leading-relaxed text-yellow-300/80">
                      <p className="mb-1 font-semibold text-yellow-300">
                        Lưu ý quan trọng:
                      </p>
                      <ul className="list-disc space-y-1 pl-4 text-xs">
                        <li>
                          Sau khi bán, bạn sẽ{" "}
                          <span className="font-semibold text-white">
                            không thể truy cập
                          </span>{" "}
                          tài liệu này nữa.
                        </li>
                        <li>
                          Tác giả gốc sẽ nhận{" "}
                          <span className="font-semibold text-white">
                            {doc.royaltyPercent ?? 10}% hoa hồng
                          </span>{" "}
                          từ mỗi giao dịch bán lại.
                        </li>
                        <li>Marketplace sẽ thu thêm một khoản phí dịch vụ.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Giá bán (ETH)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.00001"
                    placeholder="Nhập giá bán..."
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 transition outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSell}
                    disabled={!sellPrice || parseFloat(sellPrice) <= 0}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Xác nhận bán
                  </button>
                  <button
                    onClick={closeSellModal}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/10"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            )}

            {sellStep === "processing" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                <div>
                  <p className="font-bold text-white">
                    Đang xử lý giao dịch...
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Vui lòng xác nhận trong MetaMask và chờ giao dịch hoàn tất.
                  </p>
                </div>
              </div>
            )}

            {sellStep === "success" && (
              <div className="flex flex-col items-center gap-4 py-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    Đăng bán thành công!
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Tài liệu đã được đăng lên marketplace.
                  </p>
                </div>
                {sellTxHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${sellTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Xem giao dịch trên Etherscan ↗
                  </a>
                )}
                <button
                  onClick={closeSellModal}
                  className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Về trang tài liệu
                </button>
              </div>
            )}

            {sellStep === "error" && (
              <div className="flex flex-col items-center gap-4 py-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    Giao dịch thất bại
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-line text-gray-400">
                    {sellError}
                  </p>
                </div>
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => {
                      setSellStep("idle");
                      setSellError("");
                    }}
                    className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={closeSellModal}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/10"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
