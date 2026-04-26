import { Link } from "react-router";
import { FileText, BookOpen, ExternalLink, AlertTriangle, User } from "lucide-react";
import { Document, Page } from "react-pdf";
import ActionButtons, { ACCESS_STATUS } from "./ActionButtons";

const CART_MSG_MAP = {
  added: { text: "Đã thêm vào giỏ hàng ✓", color: "text-green-400" },
  already_in_cart: { text: "Tài liệu đã có trong giỏ hàng", color: "text-yellow-400" },
  already_owned: { text: "Bạn đã sở hữu tài liệu này", color: "text-yellow-400" },
};

/**
 * @param {object}   props
 * @param {object}   props.doc
 * @param {number}   props.numPages
 * @param {function} props.onLoadSuccess
 * @param {string}   props.accessStatus
 * @param {boolean}  props.isInCart
 * @param {boolean}  props.addingToCart
 * @param {string|null} props.cartMsg
 * @param {object|null} props.resellListing
 * @param {function} props.onBuyNow
 * @param {function} props.onAddToCart
 * @param {function} props.onResell
 * @param {function} props.onCancelListing
 * @param {function} props.onLoginRedirect
 * @param {function} props.onShowPreview
 * @param {function} props.onReadDocument
 */
export default function DocumentSidebar({
  doc,
  numPages,
  onLoadSuccess,
  accessStatus,
  isInCart,
  addingToCart,
  cartMsg,
  resellListing,
  onBuyNow,
  onAddToCart,
  onResell,
  onCancelListing,
  onLoginRedirect,
  onShowPreview,
  onReadDocument,
}) {
  const canAccessFull =
    accessStatus === ACCESS_STATUS.OWNED || accessStatus === ACCESS_STATUS.AUTHOR;

  return (
    <div className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
      {/* Main card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        {/* PDF preview */}
        <div className="mb-5 flex h-80 w-full flex-col items-center gap-4 overflow-y-auto rounded-lg bg-black/40 p-3">
          <Document
            file={doc.fileUrl}
            onLoadSuccess={onLoadSuccess}
            loading={
              <div className="flex h-full flex-col items-center justify-center gap-2 pt-24">
                <FileText size={40} className="text-purple-400 opacity-50" />
                <p className="text-xs text-gray-400">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex h-full flex-col items-center justify-center gap-2 pt-24">
                <FileText size={40} className="text-purple-400 opacity-50" />
                <p className="text-xs text-gray-600">Preview không khả dụng</p>
              </div>
            }
          >
            {Array.from(new Array(Math.min(numPages || 0, 3)), (_, i) => (
              <Page key={i} pageNumber={i + 1} width={250} />
            ))}
          </Document>
        </div>

        {/* Resell banner */}
        {resellListing && !resellListing.isOriginalCreator && (
          <div className="mb-2 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="pb-2 text-xs font-semibold text-amber-300">
                Tài liệu bán lại — không phải từ tác giả gốc
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-[10px] font-bold text-purple-300">
                  {resellListing.seller?.userName?.[0]?.toUpperCase() || "?"}
                </div>
                <Link
                  to={`/author/${resellListing.seller?._id}`}
                  className="truncate text-xs text-amber-400 underline underline-offset-2 hover:text-amber-300"
                >
                  {resellListing.seller?.userName || "Người dùng"}
                </Link>
                <span className="text-xs text-amber-500/70">đang bán lại</span>
              </div>
              <p className="mt-1 pt-2 text-[11px] text-amber-500/70">
                Tác giả gốc:{" "}
                <span className="font-medium text-amber-400">{doc.author?.userName}</span>
              </p>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-1 flex items-end gap-2">
          <span className="text-3xl font-black text-white">
            {doc.price > 0 ? doc.price : "Free"}
          </span>
          {doc.price > 0 && <span className="mb-1 font-bold text-purple-400">ETH</span>}
        </div>

        {/* Action buttons */}
        <div className="mb-1">
          <ActionButtons
            accessStatus={accessStatus}
            isInCart={isInCart}
            addingToCart={addingToCart}
            onBuyNow={onBuyNow}
            onAddToCart={onAddToCart}
            onResell={onResell}
            onCancelListing={onCancelListing}
            onLoginRedirect={onLoginRedirect}
          />
        </div>

        {/* Cart message */}
        {cartMsg && CART_MSG_MAP[cartMsg] && (
          <p className={`mt-2 text-center text-xs ${CART_MSG_MAP[cartMsg].color}`}>
            {CART_MSG_MAP[cartMsg].text}
          </p>
        )}

        {/* Read / Preview button */}
        {canAccessFull ? (
          <button
            onClick={onReadDocument}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/20"
          >
            <BookOpen size={16} />
            Đọc tài liệu
          </button>
        ) : accessStatus !== ACCESS_STATUS.LISTED ? (
          <button
            onClick={onShowPreview}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            <ExternalLink size={16} />
            Xem trước tài liệu
          </button>
        ) : null}

        <div className="my-5 border-t border-white/10" />

        {/* Stats */}
        <div className="flex justify-between text-center">
          {[
            { label: "Trang", value: doc.pageCount ?? "—" },
            { label: "Rating", value: doc.averageRating ? `${doc.averageRating} ★` : "—" },
            { label: "Downloads", value: doc.downloadCount ?? 0 },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Author card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-blue-500 font-bold text-white">
            {doc.author?.userName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{doc.author?.userName || "—"}</p>
            <p className="text-xs text-gray-500">{doc.author?.email || ""}</p>
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
  );
}