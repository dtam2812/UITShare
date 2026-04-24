import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FiBookOpen,
  FiShoppingBag,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import axios from "../../common";

const PurchasedDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/marketplace/purchased");
        setDocuments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-6xl p-2">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tài liệu đã mua</h1>
        <p className="mt-1 text-sm text-gray-400">
          Danh sách tài liệu bạn đã sở hữu thông qua marketplace.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20">
          <FiShoppingBag className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Tổng tài liệu đã mua</p>
          <p className="text-lg font-bold text-white">{documents.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <FiSearch className="h-4 w-4 shrink-0 text-gray-500" />
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
        />
      </div>

      {/* Content */}
      {loading ? (
        <p className="py-16 text-center text-sm text-gray-500">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <FiShoppingBag className="h-6 w-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500">
            {search
              ? "Không tìm thấy tài liệu phù hợp."
              : "Bạn chưa mua tài liệu nào."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              {/* Thumbnail / Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                <FiBookOpen className="h-5 w-5 text-purple-400" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {doc.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {doc.author?.userName && (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      {doc.author.userName}
                    </span>
                  )}
                  {doc.subject && (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {doc.subject}
                    </span>
                  )}
                  {doc.boughtAt && (
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-3 w-3" />
                      {new Date(doc.boughtAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Price + Actions */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold text-purple-400">
                  {doc.price} ETH
                </span>
                <button
                  onClick={() => navigate(`/documentReading/${doc._id}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                >
                  <FiBookOpen className="h-3.5 w-3.5" />
                  Đọc ngay
                </button>
                <button
                  onClick={() => navigate(`/documentDetail/${doc._id}`)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedDocuments;
