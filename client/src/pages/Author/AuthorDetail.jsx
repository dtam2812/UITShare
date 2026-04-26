import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import {
  FiBook,
  FiShield,
  FiFacebook,
  FiStar,
  FiFileText,
  FiDownload,
  FiArrowLeft,
  FiHeart,
  FiX,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import DocumentCard from "../../components/DocumentCard/DocumentCard";
import axios from "../../common";

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

const DONATE_ABI = [
  {
    name: "donateToSeller",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "seller_", type: "address" }],
    outputs: [],
  },
];

//Donate Modal
const DonateModal = ({ author, onClose }) => {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("0.001");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("input");
  const [errorMsg, setErrorMsg] = useState("");

  const { writeContractAsync } = useWriteContract();

  const presets = ["0.001", "0.005", "0.01", "0.05"];

  const handleDonate = async () => {
    if (!isConnected || !address) {
      setErrorMsg("Vui lòng kết nối ví MetaMask trước khi donate.");
      setStep("error");
      return;
    }
    if (!author.walletAddress) {
      setErrorMsg("Tác giả chưa liên kết ví.");
      setStep("error");
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setErrorMsg("Số lượng ETH không hợp lệ.");
      setStep("error");
      return;
    }

    try {
      setStep("confirming");
      const txHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: DONATE_ABI,
        functionName: "donateToSeller",
        args: [author.walletAddress],
        value: parseEther(amount),
      });

      setStep("recording");
      await axios.post("/api/marketplace/donate", {
        txHash,
        toAddress: author.walletAddress,
        message: message.trim() || undefined,
      });

      setStep("success");
    } catch (err) {
      console.error("[Donate]", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.shortMessage ||
          "Donate thất bại. Vui lòng thử lại.",
      );
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-500 transition-colors hover:text-white"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20">
              <FiHeart className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Ủng hộ tác giả</h3>
              <p className="text-xs text-gray-500">{author.userName}</p>
            </div>
          </div>

          {/* States */}
          {step === "input" && (
            <>
              <p className="mb-4 text-sm text-gray-400">
                Chọn hoặc nhập số ETH bạn muốn gửi:
              </p>

              {/* Preset amounts */}
              <div className="mb-3 grid grid-cols-4 gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className={`rounded-xl border py-2 text-sm font-medium transition-all ${
                      amount === p
                        ? "border-pink-500/60 bg-pink-500/20 text-pink-300"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="number"
                  min="0.0001"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  placeholder="0.001"
                />
                <span className="text-sm font-medium text-gray-400">ETH</span>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  Lời nhắn <span className="text-gray-600">(tuỳ chọn)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="Gửi lời động viên tới tác giả..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                />
                <p className="mt-1 text-right text-xs text-gray-600">
                  {message.length}/200
                </p>
              </div>

              <button
                onClick={handleDonate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <FiHeart className="h-4 w-4" />
                Gửi {amount} ETH
              </button>
            </>
          )}

          {(step === "confirming" || step === "recording") && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <FiLoader className="h-10 w-10 animate-spin text-pink-400" />
              <div>
                <p className="font-semibold text-white">
                  {step === "confirming"
                    ? "Đang chờ xác nhận MetaMask..."
                    : "Đang ghi nhận giao dịch..."}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Vui lòng không đóng cửa sổ này
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <FiCheckCircle className="h-10 w-10 text-green-400" />
              <div>
                <p className="font-semibold text-white">
                  Donate thành công! 🎉
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Cảm ơn bạn đã ủng hộ {author.userName}
                </p>
                {message.trim() && (
                  <p className="mx-auto mt-3 max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400 italic">
                    "{message.trim()}"
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                Đóng
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <FiX className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Có lỗi xảy ra</p>
                <p className="mt-1 text-sm text-red-400">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStep("input")}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

//AuthorDetail
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
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("shared");
  const [resellListings, setResellListings] = useState([]);
  const [resellLoading, setResellLoading] = useState(false);
  const { address: currentWallet } = useAccount();

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const [authorRes, resellRes] = await Promise.all([
          axios.get(`/api/author/authorDetail/${authorId}`),
          axios.get(`/api/marketplace/author/${authorId}/resell`),
        ]);
        setAuthor(authorRes.data.author);
        setDocuments(authorRes.data.documents);
        setStats(authorRes.data.stats);
        setResellListings(resellRes.data);
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
    <>
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

            {/* Social + Donate buttons */}
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

              {/* Donate button — chỉ hiện khi tác giả đã liên kết ví */}
              {author.walletAddress &&
                currentWallet?.toLowerCase() !==
                  author.walletAddress?.toLowerCase() && (
                  <button
                    onClick={() => setShowDonateModal(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-2.5 text-sm font-medium text-pink-400 transition-all hover:bg-pink-500/20 hover:text-pink-300"
                    title="Ủng hộ tác giả bằng ETH"
                  >
                    <FiHeart className="h-4 w-4" />
                    Donate ETH
                  </button>
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
          {/* Tab Header */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("shared")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "shared"
                  ? "bg-purple-500/30 text-purple-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FiFileText className="h-4 w-4" />
              Tài liệu đã chia sẻ
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {stats.totalDocs}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("resell")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "resell"
                  ? "bg-cyan-500/30 text-cyan-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FiShield className="h-4 w-4" />
              Đang bán lại
              {resellListings.length > 0 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {resellListings.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "shared" && (
            <>
              {documents.length === 0 ? (
                <p className="text-center text-gray-500">
                  Chưa có tài liệu nào.
                </p>
              ) : (
                <div className="mx-auto flex w-11/12 flex-wrap gap-4">
                  {documents.map((doc) => (
                    <DocumentCard key={doc._id} {...doc} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "resell" && (
            <>
              {resellLoading ? (
                <p className="py-8 text-center text-gray-500">Đang tải...</p>
              ) : resellListings.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  Chưa có tài liệu nào đang bán lại.
                </p>
              ) : (
                <div className="mx-auto flex w-11/12 flex-wrap gap-4">
                  {resellListings.map((listing) => (
                    <div
                      key={listing._id}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/documentDetail/${listing.document._id}?listingId=${listing._id}`,
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <DocumentCard
                        {...listing.document}
                        price={listing.price}
                        disableLink
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <DonateModal
          author={author}
          onClose={() => setShowDonateModal(false)}
        />
      )}
    </>
  );
};

export default AuthorDetail;
