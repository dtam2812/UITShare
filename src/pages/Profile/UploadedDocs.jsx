import { FiFileText, FiEye, FiDownload, FiUploadCloud } from "react-icons/fi";
import { Link } from "react-router";
import { useState } from "react";
import StatCard from "../../components/Profile/UploadedDocsStatCard";
import DocumentTable from "../../components/Profile/DocumentTable";
import ConfirmModal from "../../components/UI/ConfirmModal";
import EditDocumentModal from "../../components/Profile/EditDocumentModal";
import toast from "react-hot-toast";

const statsData = [
  { 
    id: 1,
    title: "Tổng tài liệu", 
    value: "15", 
    icon: <FiFileText className="w-6 h-6" />, 
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  { 
    id: 2,
    title: "Tổng lượt xem", 
    value: "1.2k", 
    icon: <FiEye className="w-6 h-6" />, 
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400"
  },
  { 
    id: 3,
    title: "Tổng lượt tải", 
    value: "450", 
    icon: <FiDownload className="w-6 h-6" />, 
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
];

const tableColumns = [
  { label: "TÀI LIỆU", className: "w-[40%] text-left" },
  { label: "NGÀY ĐĂNG", className: "w-[15%] text-left" },
  { label: "LƯỢT TẢI", className: "w-[15%] text-center" },
  { label: "TRẠNG THÁI", className: "w-[15%] text-center" },
  { label: "THAO TÁC", className: "w-[15%] text-center" }
];

const UploadedDocs = () => {
  const [upload, setUpload] = useState([
    { 
      id: 1, 
      tenTaiLieu: "Giải tích 1 - Đề thi 2024", 
      ngayDang: "20/02/2026", 
      luotTai: 128, 
      trangThai: "Đã duyệt",
      course: "IT001 - Nhập môn lập trình",
      category: "exam",
      year: "2024-2025",
      description: "Đề thi cuối kỳ môn Giải tích 1 năm 2024 có đáp án chi tiết.",
      price: "15"
    },
    { 
      id: 2, 
      tenTaiLieu: "Tài liệu ôn tập OOP", 
      ngayDang: "18/02/2026", 
      luotTai: 56, 
      trangThai: "Chờ duyệt",
      course: "IT002 - Lập trình hướng đối tượng",
      category: "assignment",
      year: "2025-2026",
      description: "Tổng hợp bài tập thực hành OOP C++.",
      price: "10"
    },
    { 
      id: 3, 
      tenTaiLieu: "Đại số tuyến tính căn bản...", 
      ngayDang: "15/02/2026", 
      luotTai: 210, 
      trangThai: "Từ chối",
      course: "", 
      category: "slide",
      year: "2024-2025",
      description: "Slide bài giảng đại số tuyến tính.",
      price: "5"
    },
  ])

    const [confirmModal, setConfirmModal] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const [editFile, setEditFile] = useState(false)
    const [editDataFile, setEditDataFile] = useState('')

    const handleEdit = (id) => {
      setEditFile(true)
      
      const file = upload.find(item => item.id === id)

      setEditDataFile(file)
    }

    const handleSubmit = (updatedFile) => {
      setEditFile(false)
      setUpload(prev => prev.map(item => item.id === updatedFile.id ? updatedFile : item))
      toast.success('Cập nhật tài liệu thành công')
    }

    const handleCloseEdit = () => {
      setEditFile(false)
    }

    const handleDelete = (id) => {
      setIdDelete(id)
      setConfirmModal(true)
    }

    const handleCloseModal = () => {
      setConfirmModal(false)
    }

    const handleConfirmModal = () => {
      setUpload(prev => prev.filter(item => item.id !== idDelete))
      setConfirmModal(false)
    }
    

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Tài liệu đã tải lên</h1>
          <p className="text-sm text-gray-400">
            Quản lý và theo dõi hiệu suất các tài liệu của bạn trên UITShare.
          </p>
        </div>
        
        <Link
          to="/upload"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm whitespace-nowrap cursor-pointer"
        >
          <FiUploadCloud className="w-5 h-5" />
          Tải lên tài liệu
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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

      <div className="flex justify-end md:hidden mb-2 mr-1">
        <span className="text-[11px] text-gray-500 italic">
        Vuốt ngang bảng để xem thêm &rarr;
        </span>
      </div>
      
      <DocumentTable 
        columns={tableColumns} 
        data={upload} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditDocumentModal 
        isOpen={editFile}
        onClose={handleCloseEdit}
        editData={editDataFile}
        onSubmit={handleSubmit}
        key={editDataFile ? editDataFile.id : ''}
      />

      <ConfirmModal 
        isOpen={confirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
}

export default UploadedDocs;