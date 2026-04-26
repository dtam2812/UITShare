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
            className={`h-5 w-5 transition-colors ${
              s <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/20 hover:text-white/40"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-yellow-400">
          {value}/5
        </span>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
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
      setErrorMsg("Vui lòng đăng nhập để gửi đánh giá.");
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

      setReviews((prev) => [res.data, ...prev]);
      setCommentText("");
      setCommentRating(0);
      setSuccessMsg("Đánh giá của bạn đã được gửi thành công!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Gửi thất bại. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Viết đánh giá */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Viết Đánh Giá</h3>

        <div className="mb-4">
          <p className="mb-2 text-sm text-white">Đánh Giá Của Bạn</p>
          <StarRatingInput value={commentRating} onChange={setCommentRating} />
        </div>

        <div className="mb-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về tài liệu này..."
            rows={4}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 focus:outline-none"
          />
        </div>

        {errorMsg && <p className="mb-2 text-xs text-red-400">{errorMsg}</p>}
        {successMsg && (
          <p className="mb-2 text-xs text-green-400">{successMsg}</p>
        )}

        {/* Footer: hint + button — xếp dọc trên mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            {!isReady
              ? commentRating === 0 && !commentText.trim()
                ? "Chọn số sao và viết nội dung để gửi đánh giá"
                : commentRating === 0
                  ? "Vui lòng chọn số sao"
                  : "Vui lòng viết nội dung đánh giá"
              : "Sẵn sàng gửi!"}
          </p>

          <button
            onClick={handleSubmit}
            disabled={!isReady || submitting}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${
              isReady && !submitting
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "cursor-not-allowed bg-white/5 text-gray-600"
            }`}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Gửi Đánh Giá
          </button>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-white">
          Đánh Giá{" "}
          <span className="text-sm font-normal text-gray-500">
            ({reviews.length})
          </span>
        </h3>

        {loadingReviews ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Đang tải đánh giá...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-600">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-black">
                    {r.user?.avatar ? (
                      <img
                        src={r.user.avatar}
                        alt={r.user.userName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      getAvatar(r.user?.userName)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {r.user?.userName || "Người dùng"}
                      </p>
                      <p className="shrink-0 text-xs text-gray-600">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>

                    {r.rating && <StarRating value={r.rating} />}

                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
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