import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page } from "react-pdf";

const MAX_PREVIEW_PAGES = 5;

export default function PDFPreviewModal({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

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
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Khi màn < 450px thì dùng width để PDF tự co vừa container
  // Lớn hơn thì dùng scale như bình thường
  const pageWidth =
    containerWidth && containerWidth < 450
      ? containerWidth - 16
      : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 py-2 backdrop-blur-sm sm:px-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl"
        style={{ width: "min(860px, 95vw)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="hidden text-sm font-semibold text-white sm:block">
              Xem trước tài liệu
            </p>

            {numPages && (
              <span className="text-xs text-gray-500">
                <span className="font-semibold text-white">{previewPages}</span>{" "}
                / {numPages} trang
                <span className="ml-1 hidden text-purple-400 sm:inline">
                  xem trước
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() =>
                setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(1)))
              }
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="w-10 text-center text-xs text-gray-500">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={() =>
                setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)))
              }
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10" />

            <button
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer — ref đặt ở đây để đo width chính xác */}
        <div
          ref={containerRef}
          className="flex flex-1 flex-col items-center gap-4 overflow-y-auto px-2 py-4 sm:px-4 sm:py-6"
        >
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                <p className="text-sm text-gray-400">Đang tải tài liệu...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center gap-2 py-24">
                <p className="text-sm text-gray-500">Không thể tải tài liệu</p>
              </div>
            }
          >
            {Array.from({ length: previewPages }, (_, i) => (
              <div
                key={i + 1}
                className="w-full overflow-hidden rounded-lg shadow-xl"
              >
                <Page
                  pageNumber={i + 1}
                  scale={pageWidth ? undefined : scale}
                  width={pageWidth || undefined}
                />
              </div>
            ))}
          </Document>

          {/* Upsell */}
          {numPages && numPages > MAX_PREVIEW_PAGES && (
            <div
              className="relative -mt-24 flex w-full flex-col items-center gap-3 pt-16"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #0f0f1a 60%)",
              }}
            >
              <p className="text-center text-sm text-gray-400">
                <span className="font-semibold text-white">
                  Còn {numPages - previewPages} trang
                </span>{" "}
                — mua ngay để xem toàn bộ nội dung
              </p>

              <button
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-purple-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                Mua ngay
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col gap-2 border-t border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <p className="text-center text-xs text-gray-500 sm:text-left">
            Cuộn xuống để đọc • Nhấn Esc để đóng
          </p>

          <button
            onClick={onClose}
            className="w-full cursor-pointer rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-600 sm:w-auto"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}