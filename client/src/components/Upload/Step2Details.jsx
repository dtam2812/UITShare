import { FiChevronLeft } from "react-icons/fi";
import Step2FileCard from "./Step2FileCard";
import { useState } from "react";
import axios from "../../common";
import { FiAlertTriangle, FiXCircle } from "react-icons/fi";

const Step2Detail = ({ file, prevStep, onSubmit, onReset }) => {
  const [formData, setFormData] = useState(
    {
      title: "",
      subject: "",
      category: "",
      description: "",
      price: "",
      royaltyPercent: 10,
      amount: 1,
    }
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleUpdateForm = (name, value) => {
    setFormData(
      (prev) => ({ ...prev, [name]: value })
    );
  };

  const handleSubmit = async (formData) => {
    setIsSubmitted(true);

    const isValid = 
        formData.title.trim() !== "" &&
        formData.subject.trim() !== "" &&
        formData.category.trim() !== "" &&
        formData.price.toString().trim() !== "";

    if (!isValid) return;

    try {
      setIsLoading(true);
      setUploadError(null);

      const data = new FormData();
      data.append("file", file[0]);
      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("royaltyPercent", formData.royaltyPercent);
      data.append("amount", formData.amount);

      await axios.post("/api/documents/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSubmit();
    } catch (error) {
      if (error.response?.status === 409) {
        setUploadError({
          type: "duplicate",
          message: error.response.data.message,
          existingDocumentId: error.response.data.existingDocumentId,
          existingTitle: error.response.data.existingTitle,
        });
      } else {
        setUploadError({
          type: "generic",
          message:
            error.response?.data?.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in w-full duration-300">
      <div className="mb-6 border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Chi tiết tài liệu</h3>
        <p className="mt-1 text-sm text-gray-400">
          Đang cấu hình cho{" "}
          <span className="font-semibold text-purple-400">
            {file.length} tài liệu
          </span>
          . Điền thông tin để sinh viên khác dễ tìm thấy.
        </p>
      </div>

      <div className="relative z-20 space-y-8">
        <Step2FileCard
          item={file[0]}
          formData={formData}
          updateForm={handleUpdateForm}
          submit={isSubmitted}
        />
      </div>

      {uploadError && (
        <div
          className={`mt-3 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur-md ${
            uploadError.type === "duplicate"
              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {uploadError.type === "duplicate" ? (
            <FiAlertTriangle
              className="mt-0.5 shrink-0 text-yellow-400"
              size={16}
            />
          ) : (
            <FiXCircle className="mt-0.5 shrink-0 text-red-400" size={16} />
          )}
          <div>
            <p className="font-semibold">
              {uploadError.type === "duplicate"
                ? "Tài liệu đã tồn tại"
                : "Tải lên thất bại"}
            </p>
            <p className="mt-0.5 opacity-80">{uploadError.message}</p>
            {uploadError.type === "duplicate" && (
              <button
                onClick={onReset()}
                className="mt-1.5 inline-block text-xs font-medium text-yellow-400 underline hover:text-yellow-300"
              >
                Tải lên tài liệu khác
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6 relative z-10">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => prevStep()}
        >
          <FiChevronLeft className="h-5 w-5" /> Quay lại bước 1
        </button>

        <button
          type="button"
          disabled={isLoading}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleSubmit(formData)}
        >
          {isLoading ? "Đang tải lên..." : "Hoàn tất & Đăng tài liệu"}
        </button>
      </div>
    </div>
  );
};

export default Step2Detail;