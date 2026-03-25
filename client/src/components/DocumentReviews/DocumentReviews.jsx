import { useState } from "react";
import { Star, Send } from "lucide-react";

const INITIAL_REVIEWS = [
  { id: 1, user: "Minh Khoa",   avatar: "M", rating: 5, date: "12/03/2025", comment: "Tài liệu rất chi tiết, đầy đủ. Mình thi xong được 9 điểm nhờ bộ này!" },
  { id: 2, user: "Thảo Nguyên", avatar: "T", rating: 5, date: "08/03/2025", comment: "Chất lượng tốt, đáng đồng tiền. Tác giả trình bày rõ ràng, dễ hiểu." },
  { id: 3, user: "Quốc Bảo",    avatar: "Q", rating: 4, date: "01/03/2025", comment: "Phần lý thuyết ok nhưng bài tập tự luận hơi ít. Vẫn recommend." },
];

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              s <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-white/20 hover:text-white/40"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-yellow-400 font-semibold ml-2">{value}/5</span>
      )}
    </div>
  );
}

export default function DocumentReviews({ initialReviews = INITIAL_REVIEWS }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);

  function handleSubmit() {
    if (!commentText.trim() || commentRating === 0) return;

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    setReviews((prev) => [
      { id: Date.now(), user: "Bạn", avatar: "B", rating: commentRating, date: dateStr, comment: commentText.trim() },
      ...prev,
    ]);
    setCommentText("");
    setCommentRating(0);
  }

  const isReady = commentText.trim() && commentRating > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Write a review */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Viết đánh giá</h3>

        <div className="mb-4">
          <p className="text-sm text-white mb-2">Đánh giá của bạn</p>
          <StarRatingInput value={commentRating} onChange={setCommentRating} />
        </div>

        <div className="mb-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về tài liệu này..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-white">
            {!isReady
              ? commentRating === 0 && !commentText.trim()
                ? "Chọn số sao và viết nhận xét để gửi"
                : commentRating === 0
                ? "Vui lòng chọn số sao"
                : "Vui lòng viết nhận xét"
              : "Sẵn sàng gửi đánh giá!"}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
              isReady
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
            Gửi đánh giá
          </button>
        </div>
      </div>

      {/* Reviews list */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          Đánh giá{" "}
          <span className="text-gray-500 font-normal text-sm">({reviews.length})</span>
        </h3>
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-black shrink-0">
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{r.user}</p>
                    <p className="text-xs text-gray-600">{r.date}</p>
                  </div>
                  <StarRating value={r.rating} />
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{r.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}