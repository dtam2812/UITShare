import {
  FiFile,
  FiCopy,
  FiBook,
  FiChevronDown,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";

const Step2FileCard = ({ item, index, formData, updateForm, handleClickApply, submit }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
            <FiFile className="w-6 h-6" />
          </div>
          <div className="truncate">
            <p className="font-semibold text-white truncate text-base">
              {item.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.size / (1024 * 1024) >= 1.0
                ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
                : `${(item.size / 1024).toFixed(0)} KB`}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/10 cursor-pointer shrink-0"
          onClick={() => handleClickApply(index)}
        >
          <FiCopy className="w-4 h-4" />
          {index === 0 ? <span className="hidden sm:inline">Áp dụng cho tất cả các file</span> : <span className="hidden sm:inline">Sao chép từ file trên</span>}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Môn học 
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiBook className="text-gray-400" />
          </div>

          <input
            type="text"
            list="course-list"
            name="course"
            value={formData.course}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all text-sm text-white ${
              submit && !formData.course
                ? "border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-500/10"
                : "border-white/20 bg-white/5 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            }`}
            placeholder="Nhập mã môn hoặc đúp chuột để chọn..."
            onChange={(e) => updateForm(index, e.target.name, e.target.value)}
          />

          <datalist id="course-list">
            <option value="IT001 - Nhập môn lập trình" />
            <option value="IT002 - Lập trình hướng đối tượng" />
            <option value="IT003 - Cấu trúc dữ liệu và giải thuật" />
            <option value="IT004 - Cơ sở dữ liệu" />
          </datalist>
        </div>
        {submit && !formData.course && (
          <span className="text-xs text-red-400 mt-1 block">Môn học không được để trống</span>
        )}
      </div>

      {formData.course.trim().length > 0 && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loại tài liệu
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  className={`appearance-none w-full px-4 py-3 pr-10 border rounded-xl outline-none transition-all bg-[#050816] text-white text-sm cursor-pointer ${
                    submit && !formData.category
                      ? "border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-500/10"
                      : "border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  }`}
                  onChange={(e) => updateForm(index, e.target.name, e.target.value)}
                >
                  <option value="">Chọn phân loại...</option>
                  <option value="exam">Đề thi / Đáp án</option>
                  <option value="slide">Slide bài giảng</option>
                  <option value="assignment">Bài tập / Thực hành</option>
                  <option value="project">Đồ án / Báo cáo</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {submit && !formData.category && (
                <span className="text-xs text-red-400 mt-1 block">Vui lòng chọn loại tài liệu</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Năm học
              </label>
              <div className="relative">
                <select
                  name="year"
                  value={formData.year}
                  className={`appearance-none w-full px-4 py-3 pr-10 border rounded-xl outline-none transition-all bg-[#050816] text-white text-sm cursor-pointer ${
                    submit && !formData.year
                      ? "border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-500/10"
                      : "border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  }`}
                  onChange={(e) => updateForm(index, e.target.name, e.target.value)}
                >
                  <option value="">Chọn năm học...</option>
                  <option value="2025-2026">2025 - 2026</option>
                  <option value="2024-2025">2024 - 2025</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {submit && !formData.year && (
                <span className="text-xs text-red-400 mt-1 block">Vui lòng chọn năm học</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mô tả tài liệu
            </label>
            <textarea
              name="description"
              value={formData.description}
              rows="2"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all resize-none text-sm placeholder-gray-500"
              placeholder="Tóm tắt ngắn gọn nội dung tài liệu này (không bắt buộc)..."
              onChange={(e) => updateForm(index, e.target.name, e.target.value)}
            ></textarea>
          </div>

          <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5">
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FiDollarSign className="text-purple-400" />
                Định giá NFT & Bản quyền
            </label>
            
            <div className="border-2 border-purple-500/50 bg-[#050816]/50 backdrop-blur-md rounded-xl p-5 shadow-sm relative">
                <div className="flex items-start justify-between mb-4">
                <div>
                    <span className="font-bold text-white text-sm block mb-1">
                      Định giá bằng ETH
                    </span>
                    <p className="text-xs text-gray-400">
                      Yêu cầu người khác trả ETH để được mở khoá file này. Vẫn đúc NFT để lưu bản quyền.
                    </p>
                </div>
                <div className="bg-purple-500/20 p-1 rounded-full shrink-0">
                    <FiCheck className="text-purple-400 w-4 h-4" />
                </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Nhập giá bán
                </label>
                <div className="relative">
                    <input
                    type="number"
                    name="price"
                    value={formData.price}
                    min="0"
                    step="any"
                    className={`w-full pl-4 pr-12 py-2.5 border rounded-lg outline-none text-sm transition-colors text-white ${
                      submit && !formData.price
                        ? "border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-500/10"
                        : "border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/5 focus:bg-white/10"
                    }`}
                    placeholder="VD: 10"
                    onChange={(e) => updateForm(index, e.target.name, e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs font-bold text-purple-400">UIT</span>
                    </div>
                </div>
                {submit && !formData.price && (
                  <span className="text-xs text-red-400 mt-1 block">Vui lòng nhập giá bán</span>
                )}
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Step2FileCard;