import { Link, useNavigate } from "react-router";
import logouit from "../../assets/logouit.png";

const DocumentCard = ({
  _id,
  author,
  price,
  createdAt,
  title,
  averageRating,
  commentCount,
  pageCount,
  category,
}) => {
  const navigate = useNavigate();
  const documentId = _id;

  const CATEGORY_CONFIG = {
    exam: { label: "Đề thi", className: "bg-red-500/80 text-white" },
    slide: { label: "Slide", className: "bg-blue-500/80 text-white" },
    assignment: { label: "Bài tập", className: "bg-green-500/80 text-white" },
    project: { label: "Đồ án", className: "bg-yellow-500/80 text-black" },
  };

  const categoryInfo = CATEGORY_CONFIG[category] ?? {
    label: "Tài liệu",
    className: "bg-gray-500/80 text-white",
  };

  return (
    <Link to={`/documentDetail/${documentId}`} aria-label={`Xem tài liệu: ${title}`}>
      <div className="pt-2 pl-2 sm:pt-4 sm:pl-4">
        <div className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-[#12121f] to-[#1a1a2e] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl xl:w-64">

          {/* Ảnh */}
          <div className="relative h-24 shrink-0 sm:h-32">
            <img
              src="/default_thumbnail.png"
              alt="Ảnh bìa tài liệu"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm sm:text-xs">
              {categoryInfo.label}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-1.5 border-b border-white/10 px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">

            {/* School */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white sm:h-6 sm:w-6">
                <img
                  src={logouit}
                  alt="logouit"
                  className="h-3 w-3 object-contain sm:h-4 sm:w-4"
                />
              </div>
              <span className="truncate text-[10px] text-gray-400 sm:text-xs">
                UIT - ĐHQG TP.HCM
              </span>
            </div>

            {/* Title */}
            <h2 className="line-clamp-2 text-xs leading-snug font-bold text-white sm:line-clamp-1 sm:text-sm">
              {title?.split(".")[0]}
            </h2>

            {/* Author */}
            <div className="flex items-center gap-1">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-pink-500 sm:h-5 sm:w-5">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={author?.avatar}
                  alt={`Ảnh đại diện của ${author?.userName}`}
                />
              </div>
              <Link
                to={`/author/${author?._id}`}
                aria-label={`Xem trang tác giả ${author?.userName}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate text-[10px] font-semibold text-gray-300 hover:text-yellow-400 sm:text-xs"
              >
                {author?.userName}
              </Link>
            </div>

            {/* Rating + meta */}
            <div className="mt-auto flex items-center justify-between gap-1">
              <div className="flex items-center gap-0.5">
                <span className="text-xs text-yellow-400" aria-hidden="true">★</span>
                <span className="text-[10px] font-bold text-yellow-400 sm:text-xs">
                  {averageRating || 0}
                </span>
                <span className="text-[10px] text-white sm:text-xs">({commentCount})</span>
              </div>
              <span className="truncate text-[10px] text-gray-400 sm:text-xs">
                {pageCount}tr · {new Date(createdAt)?.getFullYear()}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex shrink-0 items-center justify-between bg-black/20 px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1">
              <svg
                className="h-3 w-3 text-purple-400 sm:h-3.5 sm:w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="text-xs font-bold text-purple-400 sm:text-sm">{price}</span>
              <span className="text-[10px] font-medium text-purple-500 sm:text-xs">ETH</span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/documentDetail/${_id}`);
              }}
              className="cursor-pointer rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[10px] font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 active:scale-95 sm:px-4 sm:py-1.5 sm:text-xs"
              aria-label={`Xem tài liệu ${title}`}
            >
              <span className="hidden sm:inline">Xem ngay</span>
              <span className="inline sm:hidden" aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;