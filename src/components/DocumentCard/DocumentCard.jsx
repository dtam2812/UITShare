import { useNavigate } from "react-router";
import pic2 from "../../assets/pic2.jpg";
import logouit from "../../assets/logouit.png";

const DocumentCard = ({ id, title, author, rating, reviews, price, thumbnail,}) => {
  const navigate = useNavigate();

  const displayTitle = title || "Ôn tập cuối kì Hệ Điều Hành";
  const displayAuthor = author || "Nguyễn Văn A";
  const displayRating = rating || 4.8;
  const displayReviews = reviews || 17000;

  const isFree = price === 0;
  const ethPrice = price ? (price / 1000000).toFixed(2) : "0.00";

  return (
    <div
      onClick={() => navigate(`/document/${id}`)}
      className="bg-gradient-to-br from-[#12121f] to-[#1a1a2e] rounded-xl shadow-md overflow-hidden w-full h-full flex flex-col border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {/*Ảnh*/}
      <div className="relative h-36 shrink-0">
        {/* Nếu API có thumbnail thì dùng thumbnail, không thì dùng pic2 mặc định */}
        <img
          src={thumbnail || pic2}
          alt="course"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs font-medium border border-white/20 shadow-sm">
          Preview
        </div>
      </div>

      {/*Info*/}
      <div className="px-4 py-3 border-b border-white/10 flex-1 flex flex-col">
        {/* School */}
        <div className="flex items-center gap-2 mb-2">
          <div className="border border-white/10 w-6 h-6 flex items-center justify-center shrink-0 rounded-md bg-white p-0.5">
            <img
              src={logouit}
              alt="logouit"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs text-gray-400 line-clamp-1">
            UIT - ĐHQG TP.HCM
          </span>
        </div>

        {/* Title (Lấy từ API) */}
        <h2
          className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug flex-1"
          title={displayTitle}
        >
          {displayTitle}
        </h2>

        {/* Author (Lấy từ API) */}
        <div className="flex items-center gap-1.5 mb-2 mt-auto">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {displayAuthor.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            <span className="font-semibold text-gray-300">{displayAuthor}</span>
          </span>
        </div>

        {/* Rating + meta (Lấy từ API) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-xs font-bold text-yellow-400">
              {displayRating}
            </span>
            <span className="text-xs text-white">
              (
              {displayReviews > 1000
                ? (displayReviews / 1000).toFixed(1) + "K"
                : displayReviews}
              )
            </span>
          </div>
          <span className="text-xs text-white">10 trang · 2025</span>
        </div>
      </div>

      {/*Tầng 3: CTA*/}
      <div className="px-4 py-3 flex items-center justify-between bg-black/20 shrink-0">
        <div className="flex items-center gap-1">
          {isFree ? (
            <span className="text-sm font-bold text-green-400">Miễn phí</span>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5 text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="text-sm font-bold text-purple-400">
                {ethPrice}
              </span>
              <span className="text-xs text-purple-500 font-medium">ETH</span>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/document/${id}`);
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-150 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm cursor-pointer"
        >
          Xem ngay
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
