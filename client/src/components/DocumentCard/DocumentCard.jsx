import { Link, useNavigate } from "react-router";
import pic2 from "../../assets/pic2.jpg";
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
    <Link to={`/documentDetail/${documentId}`}>
      <div className="pt-4 pl-4">
        <div className="w-64 flex flex-col cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-[#12121f] to-[#1a1a2e] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
          {/* Ảnh */}
          <div className="relative h-32 shrink-0">
            <img
              src={pic2}
              alt="course"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              {categoryInfo.label}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 border-b border-white/10 px-4 py-3 flex flex-col gap-2">
            {/* School */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white">
                <img
                  src={logouit}
                  alt="logouit"
                  className="h-4 w-4 object-contain"
                />
              </div>
              <span className="line-clamp-1 text-xs text-gray-400">
                UIT - ĐHQG TP.HCM
              </span>
            </div>

            {/* Title */}
            <div className="overflow-hidden">
              <h2 className="line-clamp-1 text-sm leading-snug font-bold text-white">
                {title?.split(".")[0]}
              </h2>
            </div>

            {/* Author */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-pink-500">
                <img className="rounded-full" src={author?.avatar} />
              </div>
              <span className="text-xs text-gray-400">
                <Link to={`/author/${author?._id}`}>
                  <span className="font-semibold text-gray-300 hover:text-yellow-400">
                    {author?.userName}
                  </span>
                </Link>
              </span>
            </div>

            {/* Rating + meta - đẩy xuống đáy của flex-1 */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-yellow-400">★</span>
                <span className="text-xs font-bold text-yellow-400">
                  {averageRating || 0}
                </span>
                <span className="text-xs text-white">({commentCount})</span>
              </div>
              <span className="text-xs text-white">
                {pageCount} trang · {new Date(createdAt)?.getFullYear()}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex items-center justify-between bg-black/20 px-4 py-3">
            <div className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5 text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="text-sm font-bold text-purple-400">{price}</span>
              <span className="text-xs font-medium text-purple-500">ETH</span>
            </div>

            <button
              onClick={() => navigate(`/documentDetail/${_id}`)}
              className="cursor-pointer rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 active:scale-95"
            >
              Xem ngay
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;