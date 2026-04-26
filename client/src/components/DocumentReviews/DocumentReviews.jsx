import { useState, useEffect } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import axios from "../../common";
import { useParams } from "react-router";

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
        <span className="text-sm text-yellow-400 font-semibold ml-2">
          {value}/5
        </span>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function getAvatar(userName) {
  return userName?.[0]?.toUpperCase() || "?";
}

export default function DocumentReviews() {
  const { documentId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch comments từ DB
  useEffect(() => {
    if (!documentId) return;
    const fetchComments = async () => {
      setLoadingReviews(true);
      try {
        const res = await axios.get(`/api/comments/${documentId}`);
        setReviews(res.data);
      } catch {
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchComments();
  }, [documentId]);

  const isLoggedIn = () => {
    const token = localStorage.getItem("access_token");
    return token && token !== "undefined";
  };

  const isReady = commentText.trim() && commentRating > 0;

  async function handleSubmit() {
    if (!isReady) return;

    if (!isLoggedIn()) {
      setErrorMsg("Vui lòng đăng nhập để đánh giá.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(`/api/comments/${documentId}`, {
        content: commentText.trim(),
        rating: commentRating,
      });

      // Thêm comment mới lên đầu danh sách
      setReviews((prev) => [res.data, ...prev]);
      setCommentText("");
      setCommentRating(0);
      setSuccessMsg("Đánh giá của bạn đã được gửi!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Gửi thất bại, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none transition-colors"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 mb-2">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-xs text-green-400 mb-2">{successMsg}</p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
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
            disabled={!isReady || submitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
              isReady && !submitting
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Gửi đánh giá
          </button>
        </div>
      </div>

      {/* Reviews list */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          Đánh giá{" "}
          <span className="text-gray-500 font-normal text-sm">
            ({reviews.length})
          </span>
        </h3>

        {loadingReviews ? (
          <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Đang tải đánh giá...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-black shrink-0 overflow-hidden">
                    {r.user?.avatar ? (
                      <img
                        src={r.user.avatar}
                        alt={r.user.userName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      getAvatar(r.user?.userName)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-white">
                        {r.user?.userName || "Người dùng"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                    {r.rating && <StarRating value={r.rating} />}
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {r.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}