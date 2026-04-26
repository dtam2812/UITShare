import { Star } from "lucide-react";

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

const CATEGORY_LABELS = {
  exam: "Đề Thi",
  slide: "Bài Giảng",
  assignment: "Bài Tập",
  project: "Đồ Án",
};

export default function DocumentInfo({ doc, reviewCount }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      {/* Nhãn danh mục + loại truy cập */}
      <div className="mb-4 flex flex-wrap gap-2">
        {doc.category && (
          <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
            {CATEGORY_LABELS[doc.category] || doc.category}
          </span>
        )}
        {doc.subject && (
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
            {doc.subject}
          </span>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-6">
        {/* Tác giả */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-blue-500 text-sm font-bold text-white">
            {doc.author?.userName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-xs text-gray-500">Tác Giả</p>
            <p className="text-sm font-semibold text-white">
              {doc.author?.userName || "—"}
            </p>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Số trang */}
        <div>
          <p className="text-xs text-gray-500">Số Trang</p>
          <p className="text-sm font-semibold text-white">
            {doc.pageCount ? `${doc.pageCount} trang` : "—"}
          </p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Năm đăng */}
        <div>
          <p className="text-xs text-gray-500">Năm Đăng</p>
          <p className="text-sm font-semibold text-white">
            {doc.createdAt ? new Date(doc.createdAt).getFullYear() : "—"}
          </p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Bản quyền */}
        <div>
          <p className="text-xs text-gray-500">Bản Quyền</p>
          <p className="text-sm font-semibold text-white">
            {doc.royaltyPercent ? `${doc.royaltyPercent}%` : "—"}
          </p>
        </div>
      </div>

      {/* Đánh giá */}
      {reviewCount !== undefined && (
        <div className="mb-5 flex items-center gap-3">
          <StarRating value={doc.averageRating || 0} />
          <span className="text-sm font-bold text-yellow-400">
            {doc.averageRating || "—"}
          </span>
          <span className="text-sm text-gray-500">
            ({reviewCount} đánh giá)
          </span>
        </div>
      )}

      {/* Mô tả */}
      <p className="text-sm leading-relaxed text-gray-400">
        {doc.description || "Không có mô tả."}
      </p>
    </div>
  );
}
