import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page } from "react-pdf";

const MAX_PREVIEW_PAGES = 5;

export default function PDFPreviewModal({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);

  const previewPages = Math.min(numPages || 0, MAX_PREVIEW_PAGES);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
        style={{ width: "min(860px, 95vw)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-white">Xem trước tài liệu</p>
            {numPages && (
              <span className="text-xs text-gray-500">
                {previewPages} trang xem trước
                <span className="text-purple-400 ml-1">/ {numPages} trang</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(1)))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 w-10 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer — all preview pages, scroll to read */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-6 px-4">
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Đang tải tài liệu...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center py-24 gap-2">
                <p className="text-sm text-gray-500">Không thể tải tài liệu</p>
              </div>
            }
          >
            {Array.from({ length: previewPages }, (_, i) => (
              <div key={i + 1} className="shadow-xl rounded-lg overflow-hidden">
                <Page pageNumber={i + 1} scale={scale} />
              </div>
            ))}
          </Document>

          {/* Upsell blur overlay at the bottom */}
          {numPages && numPages > MAX_PREVIEW_PAGES && (
            <div className="w-full relative -mt-24 pt-16 flex flex-col items-center gap-3"
              style={{ background: "linear-gradient(to bottom, transparent, #0f0f1a 60%)" }}
            >
              <p className="text-sm text-gray-400 text-center">
                Còn <span className="text-white font-semibold">{numPages - previewPages} trang</span> nữa — mua để đọc toàn bộ
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition cursor-pointer"
              >
                Mua tài liệu ngay
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0">
          <p className="text-xs text-gray-500">
            Lướt xuống để đọc • Esc để đóng
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition cursor-pointer"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}