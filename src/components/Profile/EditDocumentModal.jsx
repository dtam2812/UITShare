import { useState } from "react";
import { FiX, FiBook, FiChevronDown, FiDollarSign, FiCheck } from "react-icons/fi";

const EditDocumentModal = ({ isOpen, onClose, editData, onSubmit }) => {
  const [newValue, setNewValue] = useState(editData)
  
  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit(newValue)
  }

  const handleUpdateValue = (name, value) => {
    setNewValue(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#050816]/90 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#050816]/90 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Chỉnh sửa tài liệu</h2>
            <p className="text-sm text-gray-400 mt-1 truncate max-w-md">{editData.tenTaiLieu}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Môn học</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="text-gray-400" />
              </div>

              <select
                name="course"
                value={newValue.course}
                className="appearance-none w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-sm bg-white/5 text-white cursor-pointer [&>option]:bg-[#050816]"
                onChange={(e) => handleUpdateValue(e.target.name, e.target.value)}
              >
                <option value="IT001 - Nhập môn lập trình">IT001 - Nhập môn lập trình</option>
                <option value="IT002 - Lập trình hướng đối tượng">IT002 - Lập trình hướng đối tượng</option>
                <option value="IT003 - Cấu trúc dữ liệu và giải thuật">IT003 - Cấu trúc dữ liệu và giải thuật</option>
                <option value="IT004 - Cơ sở dữ liệu">IT004 - Cơ sở dữ liệu</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Loại tài liệu</label>
              <div className="relative">
                <select
                  name="category"
                  value={newValue.category}
                  className="appearance-none w-full px-4 py-3 pr-10 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all bg-white/5 text-white text-sm cursor-pointer [&>option]:bg-[#050816]"
                  onChange={(e) => handleUpdateValue(e.target.name, e.target.value)}
                >
                  <option value="exam">Đề thi / Đáp án</option>
                  <option value="slide">Slide bài giảng</option>
                  <option value="assignment">Bài tập / Thực hành</option>
                  <option value="project">Đồ án / Báo cáo</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Năm học</label>
              <div className="relative">
                <select
                  name="year"
                  value={newValue.year}
                  className="appearance-none w-full px-4 py-3 pr-10 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all bg-white/5 text-white text-sm cursor-pointer [&>option]:bg-[#050816]"
                  onChange={(e) => handleUpdateValue(e.target.name, e.target.value)}
                >
                  <option value="2025-2026">2025 - 2026</option>
                  <option value="2024-2025">2024 - 2025</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả tài liệu</label>
            <textarea
              name="description"
              value={newValue.description || ''}
              rows="3"
              className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all resize-none text-sm bg-white/5 text-white"
              onChange={(e) => handleUpdateValue(e.target.name, e.target.value)}
            ></textarea>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FiDollarSign className="text-purple-400" /> Định giá NFT & Bản quyền
            </label>
            <div className="border border-purple-500/30 bg-white/5 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-bold text-white text-sm block mb-1">Bán thu Token</span>
                  <p className="text-xs text-gray-400">Yêu cầu người khác trả UIT Token để được mở khoá.</p>
                </div>
                <div className="bg-purple-500/20 p-1 rounded-full shrink-0">
                  <FiCheck className="text-purple-400 w-4 h-4" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 relative">
                <input
                  type="number"
                  name="price"
                  value={newValue.price}
                  className="w-full pl-4 pr-12 py-2.5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-black/20 focus:bg-white/5 outline-none text-sm text-white transition-colors"
                  onChange={(e) => handleUpdateValue(e.target.name, e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 mt-4 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-purple-400">UIT</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Hủy bỏ
          </button>
          <button
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditDocumentModal;