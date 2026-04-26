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
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl"
        style={{ width: "min(860px, 95vw)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-white">
              Document Preview
            </p>

            {numPages && (
              <span className="text-xs text-gray-500">
                {previewPages} preview pages
                <span className="ml-1 text-purple-400">
                  / {numPages} pages
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
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

        {/* PDF Viewer */}
        <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-6">
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                <p className="text-sm text-gray-400">
                  Loading document...
                </p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center gap-2 py-24">
                <p className="text-sm text-gray-500">
                  Unable to load document
                </p>
              </div>
            }
          >
            {Array.from({ length: previewPages }, (_, i) => (
              <div
                key={i + 1}
                className="overflow-hidden rounded-lg shadow-xl"
              >
                <Page pageNumber={i + 1} scale={scale} />
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
                  {numPages - previewPages} more pages
                </span>{" "}
                remaining — purchase to unlock full access
              </p>

              <button
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-purple-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 py-4">
          <p className="text-xs text-gray-500">
            Scroll down to read • Press Esc to close
          </p>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-600"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}