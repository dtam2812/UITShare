import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  FiBook,
  FiShield,
  FiFacebook,
  FiStar,
  FiFileText,
  FiDownload,
  FiArrowLeft,
} from "react-icons/fi";
import DocumentCard from "../../components/DocumentCard/DocumentCard";
import axios from "../../common";

const AuthorDetail = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalDownloads: 0,
    overallRating: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/author/authorDetail/${authorId}`);
        setAuthor(res.data.author);
        setDocuments(res.data.documents);
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy tác giả");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [authorId]);

  if (loading) {
    return <div className="py-32 text-center text-gray-400">Đang tải...</div>;
  }

  if (error || !author) {
    return (
      <div className="py-32 text-center text-gray-400">
        {error || "Không tìm thấy tác giả"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-md">
        {/* Cover */}
        <div className="relative h-48 border-b border-white/10 sm:h-56">
          {author.coverImage ? (
            <img
              src={author.coverImage}
              alt="cover"
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-purple-900/60 to-blue-900/60" />
          )}
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt="avatar"
                className="h-28 w-28 rounded-full border-4 border-[#050816] object-cover shadow-md"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#050816] bg-linear-to-br from-purple-400 to-blue-500 text-4xl font-bold text-white shadow-md">
                {author.userName?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-16 px-6 pb-8 text-center">
          <h1 className="text-2xl font-bold text-white">{author.userName}</h1>
          <p className="mt-1 text-sm text-gray-500">{author.email}</p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300">
            <span className="flex items-center gap-1.5">
              <FiBook className="h-4 w-4 opacity-70" />
              Sinh viên UIT
            </span>
            {author.studentId && (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="flex items-center gap-1.5">
                  <FiShield className="h-4 w-4 opacity-70" />
                  MSSV: {author.studentId}
                </span>
              </>
            )}
            {author.walletAddress && (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs">
                  {author.walletAddress.slice(0, 6)}...
                  {author.walletAddress.slice(-4)}
                </span>
              </>
            )}
          </div>

          {author.bio && (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400">
              {author.bio}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            {author.facebookLink && (
              <a
                href={author.facebookLink}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-all hover:bg-white/10 hover:text-cyan-400"
                title="Facebook"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/5">
          <div className="py-5 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <FiFileText className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">
                Tài liệu
              </span>
            </div>
            <span className="text-xl font-bold text-white">
              {stats.totalDocs}
            </span>
          </div>
          <div className="py-5 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <FiDownload className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">
                Downloads
              </span>
            </div>
            <span className="text-xl font-bold text-white">
              {stats.totalDownloads}
            </span>
          </div>
          <div className="py-5 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <FiStar className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">
                Đánh giá
              </span>
            </div>
            <span className="text-xl font-bold text-white">
              {stats.overallRating ?? "—"}
              {stats.overallRating && (
                <span className="text-sm font-normal text-gray-500">/5</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-6 w-1.5 rounded-sm bg-cyan-400" />
          Tài liệu đã chia sẻ
        </h2>
        {documents.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có tài liệu nào.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} {...doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetail;
