import { FiFileText, FiEye, FiDownload, FiUploadCloud } from "react-icons/fi";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import StatCard from "../../components/Profile/UploadedDocsStatCard";
import DocumentTable from "../../components/Profile/DocumentTable";
import ConfirmModal from "../../components/UI/ConfirmModal";
import toast from "react-hot-toast";
import axios from "../../common";

const tableColumns = [
  { label: "TÀI LIỆU", className: "w-[40%] text-left" },
  { label: "NGÀY ĐĂNG", className: "w-[15%] text-left" },
  { label: "LƯỢT TẢI", className: "w-[15%] text-center" },
  { label: "GIÁ", className: "w-[15%] text-center" },
  { label: "THAO TÁC", className: "w-[15%] text-center" },
];

const UploadedDocs = () => {
  const [upload, setUpload] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, totalDownloads: 0 });
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState(false);
  const [idDelete, setIdDelete] = useState(null);

  const fetchMyDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/personal/documents");
      setUpload(res.data.documents);
      setStats(res.data.stats);
    } catch (error) {
      toast.error("Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDocuments();
  }, []);

  const handleSubmit = (updatedFile) => {
    setUpload((prev) =>
      prev.map((item) => (item._id === updatedFile._id ? updatedFile : item)),
    );
    toast.success("Cập nhật tài liệu thành công");
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const handleConfirmModal = async () => {
    try {
      await axios.delete(`/api/documents/${idDelete}`);
      setUpload((prev) => prev.filter((item) => item._id !== idDelete));
      setStats((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
      toast.success("Xóa tài liệu thành công");
    } catch (err) {
      toast.error("Xóa thất bại");
    } finally {
      setConfirmModal(false);
    }
  };

  const statsData = [
    {
      id: 1,
      title: "Tổng tài liệu",
      value: String(stats.totalDocs),
      icon: <FiFileText className="h-6 w-6" />,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      id: 2,
      title: "Tổng lượt tải",
      value: String(stats.totalDownloads),
      icon: <FiDownload className="h-6 w-6" />,
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Tài liệu đã tải lên
          </h1>
          <p className="text-sm text-gray-400">
            Quản lý và theo dõi hiệu suất các tài liệu của bạn trên UITShare.
          </p>
        </div>
        <Link
          to="/upload"
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-purple-700"
        >
          <FiUploadCloud className="h-5 w-5" />
          Tải lên tài liệu
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </div>

      <div className="mr-1 mb-2 flex justify-end md:hidden">
        <span className="text-[11px] text-gray-500 italic">
          Vuốt ngang bảng để xem thêm &rarr;
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400">Đang tải...</div>
      ) : (
        <DocumentTable
          columns={tableColumns}
          data={upload}
          onDelete={handleDelete}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default UploadedDocs;
