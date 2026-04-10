import { FiChevronLeft } from "react-icons/fi";
import Step2FileCard from "./Step2Filecard";
import { useState } from "react";
import axios from "../../common";

const Step2Detail = ({ file, prevStep, onSubmit }) => {
  const [formData, setFormData] = useState(() =>
    file.map(() => ({
      title: "",
      subject: "",
      category: "",
      description: "",
      price: "",
      royaltyPercent: 10,
      amount: 1,
    })),
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateForm = (index, name, value) => {
    setFormData((prev) =>
      prev.map((item, indexInFormData) =>
        indexInFormData === index ? { ...item, [name]: value } : item,
      ),
    );
  };

  const handleApply = (index) => {
    if (index === 0) setFormData((prev) => prev.map(() => ({ ...prev[0] })));
    else
      setFormData((prev) =>
        prev.map((item, indexCurrent) =>
          index === indexCurrent ? { ...prev[index - 1] } : item,
        ),
      );
  };

  const handleSubmit = async (formData) => {
    setIsSubmitted(true);

    const isValid = formData.every(
      (item) =>
        item.title.trim() !== "" &&
        item.subject.trim() !== "" &&
        item.category.trim() !== "" &&
        item.price.toString().trim() !== "",
    );

    if (!isValid) return;

    try {
      setIsLoading(true);

      const data = new FormData();
      data.append("file", file[0]);
      data.append("title", formData[0].title);
      data.append("subject", formData[0].subject);
      data.append("category", formData[0].category);
      data.append("description", formData[0].description);
      data.append("price", formData[0].price);
      data.append("royaltyPercent", formData[0].royaltyPercent);
      data.append("amount", formData[0].amount);

      await axios.post("/api/documents/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSubmit();
    } catch (error) {
      console.log(error);
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

      <div className="space-y-8">
        {file.map((item, index) => (
          <Step2FileCard
            key={index}
            item={item}
            index={index}
            formData={formData[index]}
            updateForm={handleUpdateForm}
            handleClickApply={handleApply}
            submit={isSubmitted}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
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
