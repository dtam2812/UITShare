import { useState, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import UploadedDocsStatCard from "../../components/Profile/UploadedDocsStatCard";
import axios from "../../common";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/comments/author/reviews");
        setAverageRating(res.data.averageRating);
        setTotalCount(res.data.totalCount);
        setReviews(res.data.reviews);
      } catch (err) {
        setError("Không thể tải đánh giá, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Phản hồi tài liệu</h1>
        <p className="text-sm text-gray-400 mt-1">
          Xem đánh giá từ những sinh viên đã mua tài liệu của bạn.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <UploadedDocsStatCard
          title="Đánh giá trung bình"
          value={
            loading ? (
              "..."
            ) : (
              <>
                {averageRating}{" "}
                <span className="text-base text-gray-400 font-normal">/ 5.0</span>
              </>
            )
          }
          icon={<span className="text-3xl">★</span>}
          bgColor="bg-yellow-500/10"
          textColor="text-yellow-400"
        />
        <UploadedDocsStatCard
          title="Tổng số lượt đánh giá"
          value={loading ? "..." : totalCount}
          icon={<FiMessageCircle className="w-7 h-7" />}
          bgColor="bg-purple-500/10"
          textColor="text-purple-400"
        />
      </div>

      {/* Reviews list */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Phản hồi mới nhất</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-400 py-10">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-10">
            Chưa có đánh giá nào cho tài liệu của bạn.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-white/10 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-black shrink-0 overflow-hidden">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.userName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        review.user?.userName?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {review.user?.userName || "Người dùng"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Đã mua:{" "}
                        <Link
                          to={`/documentDetail/${review.document?._id}`}
                          className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                        >
                          {review.document?.title?.split(".")[0] || "Tài liệu"}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end text-yellow-400 text-lg mb-1 tracking-widest">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <p className="text-sm text-gray-300">"{review.content}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManagement;