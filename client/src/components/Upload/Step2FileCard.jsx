import {
  FiFile,
  FiCopy,
  FiBook,
  FiChevronDown,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";

const Step2FileCard = ({
  item,
  index,
  formData,
  updateForm,
  handleClickApply,
  submit,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <FiFile className="h-6 w-6" />
          </div>
          <div className="truncate">
            <p className="truncate text-base font-semibold text-white">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {item.size / (1024 * 1024) >= 1.0
                ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
                : `${(item.size / 1024).toFixed(0)} KB`}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
          onClick={() => handleClickApply(index)}
        >
          <FiCopy className="h-4 w-4" />
          {index === 0 ? (
            <span className="hidden sm:inline">
              Áp dụng cho tất cả các file
            </span>
          ) : (
            <span className="hidden sm:inline">Sao chép từ file trên</span>
          )}
        </button>
      </div>

      {/* Môn học */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Môn học
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiBook className="text-gray-400" />
          </div>
          <input
            type="text"
            list="course-list"
            name="subject"
            value={formData.subject}
            className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm text-white transition-all outline-none ${
              submit && !formData.subject
                ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                : "border-white/20 bg-white/5 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
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
        {submit && !formData.subject && (
          <span className="mt-1 block text-xs text-red-400">
            Môn học không được để trống
          </span>
        )}
      </div>

      {formData.subject?.trim().length > 0 && (
        <div className="animate-in slide-in-from-top-4 fade-in mt-6 space-y-6 duration-300">
          {/* Loại tài liệu */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Loại tài liệu
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                className={`w-full cursor-pointer appearance-none rounded-xl border bg-[#050816] px-4 py-3 pr-10 text-sm text-white transition-all outline-none ${
                  submit && !formData.category
                    ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                }`}
                onChange={(e) =>
                  updateForm(index, e.target.name, e.target.value)
                }
              >
                <option value="">Chọn phân loại...</option>
                <option value="exam">Đề thi / Đáp án</option>
                <option value="slide">Slide bài giảng</option>
                <option value="assignment">Bài tập / Thực hành</option>
                <option value="project">Đồ án / Báo cáo</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
            </div>
            {submit && !formData.category && (
              <span className="mt-1 block text-xs text-red-400">
                Vui lòng chọn loại tài liệu
              </span>
            )}
          </div>

          {/*Tên tài liệu*/}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tên tài liệu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiBook className="text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm text-white transition-all outline-none ${
                  submit && !formData.title
                    ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-white/20 bg-white/5 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                }`}
                placeholder="Nhập tên tài liệu..."
                onChange={(e) =>
                  updateForm(index, e.target.name, e.target.value)
                }
              />
            </div>
            {submit && !formData.title && (
              <span className="mt-1 block text-xs text-red-400">
                Tên tài liệu không được để trống
              </span>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Mô tả tài liệu
            </label>
            <textarea
              name="description"
              value={formData.description}
              rows="2"
              className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
              placeholder="Tóm tắt ngắn gọn nội dung tài liệu này (không bắt buộc)..."
              onChange={(e) => updateForm(index, e.target.name, e.target.value)}
            />
          </div>

          {/* Định giá & Royalty */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-900/10 p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FiDollarSign className="text-purple-400" />
              Định giá NFT & Bản quyền
            </label>

            <div className="relative rounded-xl border-2 border-purple-500/50 bg-[#050816]/50 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="mb-1 block text-sm font-bold text-white">
                    Định giá bằng ETH
                  </span>
                  <p className="text-xs text-gray-400">
                    Yêu cầu người khác trả ETH để được mở khoá file này. Vẫn đúc
                    NFT để lưu bản quyền.
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-purple-500/20 p-1">
                  <FiCheck className="h-4 w-4 text-purple-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
                {/* Giá bán */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Giá bán
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      min="0"
                      step="any"
                      className={`w-full rounded-lg border py-2.5 pr-12 pl-4 text-sm text-white transition-colors outline-none ${
                        submit && !formData.price
                          ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                          : "border-white/20 bg-white/5 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400"
                      }`}
                      placeholder="VD: 0.01"
                      onChange={(e) =>
                        updateForm(index, e.target.name, e.target.value)
                      }
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-xs font-bold text-purple-400">
                        ETH
                      </span>
                    </div>
                  </div>
                  {submit && !formData.price && (
                    <span className="mt-1 block text-xs text-red-400">
                      Vui lòng nhập giá bán
                    </span>
                  )}
                </div>

                {/* Royalty */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Royalty (% nhận mỗi lần bán lại)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="royaltyPercent"
                      value={formData.royaltyPercent}
                      min="0"
                      max="50"
                      step="1"
                      className="w-full rounded-lg border border-white/20 bg-white/5 py-2.5 pr-12 pl-4 text-sm text-white transition-colors outline-none focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400"
                      placeholder="VD: 10"
                      onChange={(e) =>
                        updateForm(index, e.target.name, e.target.value)
                      }
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-xs font-bold text-purple-400">
                        %
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tối đa 50%. Mặc định 10%.
                  </p>
                </div>
                {/* Amount */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Số lượng NFT
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    min="1"
                    step="1"
                    max="1000"
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                    placeholder="VD: 10"
                    onChange={(e) =>
                      updateForm(index, e.target.name, e.target.value)
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Số lượng bản sao NFT có thể bán trên marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2FileCard;
