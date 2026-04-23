import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiFile, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const Step1Dropzone = ({ onNextStep, initialFile = [] }) => {
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const [fileUploaded, setFileUploaded] = useState(initialFile);
  const [showMenu, setShowMenu] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputFile = (e) => {
    const files = Array.from(e.files);

    const validFile = files.filter((item) => {
      const fileSize = item.size <= 200 * 1024 * 1024;
      const fileType = item.name.match(/\.(pdf)$/i);

      if (!fileSize)
        toast.error(`File ${item.name} có dung lượng lớn hơn 200MB`);
      if (!fileType) toast.error(`File ${item.name} không đúng định dạng`);

      return fileSize && fileType;
    });

    const finalFile = validFile.filter((item) => {
      const isDuplicate = fileUploaded.some(
        (uploaded) => uploaded.name === item.name,
      );

      if (isDuplicate) {
        toast.error(`File có tên ${item.name} đã tồn tại`);
        return false;
      }

      return true;
    });

    if (finalFile.length === 0) return;

    setFileUploaded((prev) => [...prev, ...finalFile]);

    fileInputRef.current.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    dragCounter.current -= 1;
    if (dragCounter.current == 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);
    dragCounter.current = 0;

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      handleInputFile({ files: droppedFiles });
    }
  };

  const handleDeleteFile = (item) => {
    setFileUploaded((prev) => prev.filter((current) => current != item));
  };

  return (
    <div className="w-full">
      <div
        className={`w-full border-2 border-dashed ${isDragging ? "border-purple-400 bg-white/10" : "border-white/20 bg-white/5"} relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl px-4 py-16 text-center backdrop-blur-md transition-colors hover:border-purple-400 hover:bg-white/10`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div
          className={`flex flex-col items-center transition-opacity duration-200 ${isDragging ? "opacity-0" : "opacity-100"}`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
            <FiUploadCloud className="h-8 w-8" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">
            Kéo thả tài liệu vào đây
          </h3>
          <p className="mb-6 text-sm text-gray-400">
            hoặc click để chọn file từ máy tính của bạn
          </p>

          <button
            className="pointer-events-none cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
            type="button"
          >
            Chọn tập tin
          </button>

          <p className="mt-4 text-xs text-gray-500">
            Hỗ trợ: PDF (Tối đa 200MB)
          </p>
        </div>

        {isDragging && (
          <div className="animate-in fade-in pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050816]/80 backdrop-blur-md duration-200">
            <FiUploadCloud className="mb-3 h-12 w-12 animate-bounce text-purple-400" />
            <h3 className="text-2xl font-bold text-purple-400">
              Thả file vào đây luôn đi!
            </h3>
          </div>
        )}

        <input
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleInputFile(e.target)}
        />
      </div>

      <div className="mt-8">
        <h4 className="mb-4 text-sm font-semibold text-white">
          Tài liệu đã chọn ({fileUploaded.length})
        </h4>

        <div className="flex flex-col gap-3">
          {fileUploaded.map((item, index) => (
            <div
              key={index}
              className="relative flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <FiFile className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.size / (1024 * 1024) >= 1.0
                      ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
                      : `${(item.size / 1024).toFixed(0)} KB`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => setShowMenu(showMenu === index ? null : index)}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>

                {showMenu === index && (
                  <div className="animate-in fade-in zoom-in absolute top-[70%] right-4 z-50 mt-1 w-48 origin-top-right rounded-lg border border-white/10 bg-[#050816] py-1 shadow-2xl duration-200">
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        handleDeleteFile(item);
                        setShowMenu(null);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Xoá tài liệu
                    </button>

                    <button
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10"
                      onClick={() => setShowMenu(null)}
                    >
                      <FiX className="h-4 w-4" />
                      Huỷ
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onNextStep(fileUploaded)}
        >
          Tiếp tục điền chi tiết &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step1Dropzone;
