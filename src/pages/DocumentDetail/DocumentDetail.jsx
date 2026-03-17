import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Copy, ExternalLink, ShoppingCart, User, FileText } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FeaturedDocuments from "../../components/Home/FeaturedDocument";
import DocumentReviews from "../../components/DocumentReviews/DocumentReviews";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MOCK_DOCUMENT = {
  id: 1,
  title: "Ôn tập cuối kì Hệ Điều Hành",
  school: "Trường ĐH Công nghệ Thông tin – UIT",
  author: "Nguyễn Văn A",
  authorAvatar: "N",
  authorDocs: 12,
  pages: 10,
  year: "2024/2025",
  description:
    "Tài liệu tổng hợp toàn bộ kiến thức ôn tập cuối kì môn Hệ Điều Hành tại UIT. Bao gồm câu hỏi trắc nghiệm, bài tập tự luận và đáp án chi tiết từ các năm trước. Phù hợp cho sinh viên năm 2–3 cần ôn luyện trước kỳ thi.",
  tags: ["Trắc nghiệm", "Tự luận", "Đáp án", "UIT", "2024"],
  rating: 4.8,
  reviews: 3,
  sold: "1.2K",
  nft: {
    price: "0.05",
    currency: "ETH",
    priceUsd: "142",
    contractAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    tokenId: "#4291",
    owner: "0xAb5...3f9c",
    chain: "Ethereum",
  },
};

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = MOCK_DOCUMENT;

  const [numPages, setNumPages] = useState(null);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <section className="relative py-12 text-white px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="fixed w-150 h-150 bg-purple-600/20 blur-[120px] top-0 -left-40 pointer-events-none" style={{ zIndex: 0 }} />
        <div className="fixed w-150 h-150 bg-blue-500/40 blur-[120px] top-1/2 -right-40 pointer-events-none" style={{ zIndex: 0 }} />
        <div className="fixed w-150 h-150 bg-purple-600/30 blur-[120px] bottom-0 -left-40 pointer-events-none" style={{ zIndex: 0 }} />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Quay lại</span>
        </button>

        {/* Page title */}
        <p className="text-cyan-400 text-sm font-semibold mb-2">✦ Chi tiết tài liệu</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{doc.title}</h2>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Document info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-cyan-400 text-sm font-semibold mb-5">{doc.school}</p>

              <div className="flex items-center gap-6 flex-wrap mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                    {doc.authorAvatar}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tác giả</p>
                    <p className="text-sm font-semibold text-white">{doc.author}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xs text-gray-500">Số trang</p>
                  <p className="text-sm font-semibold text-white">{doc.pages} trang</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xs text-gray-500">Năm học</p>
                  <p className="text-sm font-semibold text-white">{doc.year}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">{doc.description}</p>
            </div>

            {/* NFT Info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white">Thông tin NFT</h3>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "Giá",        value: `${doc.nft.price} ${doc.nft.currency}`, highlight: true },
                  { label: "Token ID",   value: doc.nft.tokenId },
                  { label: "Blockchain", value: doc.nft.chain },
                  { label: "Owner",      value: doc.nft.owner },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.highlight ? "text-purple-400 text-lg" : "text-white"}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white font-mono">
                      {doc.nft.contractAddress.slice(0, 20)}...
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(doc.nft.contractAddress)}
                      className="text-white/40 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <DocumentReviews />

          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4 self-start">

            {/* Buy card with PDF Preview */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">

              {/* PDF preview */}
              <div className="w-full h-80 overflow-y-auto rounded-lg mb-5 bg-black/40 p-3 flex flex-col items-center gap-4">
                <Document
                  file="/sample.pdf"
                  onLoadSuccess={onLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center justify-center h-full gap-2 pt-24">
                      <FileText className="w-10 h-10 text-purple-400 opacity-50" />
                      <p className="text-xs text-gray-400">Loading PDF...</p>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center h-full gap-2 pt-24">
                      <FileText className="w-10 h-10 text-purple-400 opacity-50" />
                      <p className="text-xs text-gray-600">Preview không khả dụng</p>
                    </div>
                  }
                >
                  {Array.from(
                    new Array(Math.min(numPages || 0, 3)),
                    (_, index) => (
                      <Page key={index} pageNumber={index + 1} width={250} />
                    )
                  )}
                </Document>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black text-white">{doc.nft.price}</span>
                <span className="text-purple-400 font-bold mb-1">{doc.nft.currency}</span>
              </div>
              <p className="text-xs text-gray-500 mb-5">≈ ${doc.nft.priceUsd} USD</p>

              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4" />
                Mua tài liệu ngay
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Xem trước tài liệu
              </button>

              <div className="border-t border-white/10 my-5" />

              <div className="flex justify-between text-center">
                {[
                  { label: "Trang",  value: doc.pages },
                  { label: "Rating", value: `${doc.rating} ★` },
                  { label: "Đã bán", value: doc.sold },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-base font-bold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Author card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center font-bold text-white shrink-0">
                  {doc.authorAvatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{doc.author}</p>
                  <p className="text-xs text-gray-500">{doc.authorDocs} tài liệu đã đăng</p>
                </div>
              </div>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2">
                <User className="w-3.5 h-3.5" />
                Xem trang tác giả
              </button>
            </div>

          </div>
        </div>

        {/* Related */}
        <FeaturedDocuments
          badge="✦ Liên quan"
          title="Tài liệu cùng chủ đề"
        />

      </div>
    </section>
  );
}