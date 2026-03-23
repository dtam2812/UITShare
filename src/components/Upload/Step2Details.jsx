import {
  FiChevronLeft
} from "react-icons/fi";
import Step2FileCard from "./Step2Filecard";
import { useState } from "react";

const Step2Detail = ({ file, prevStep, onSubmit }) => {
  const [formData, setFormData] = useState(() => file.map(() => ({
    course: '',
    category: '',
    year: '',
    description: '',
    price: ''
  })))

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleUpdateForm = (index, name, value) => {
    setFormData(prev => prev.map((item, indexInFormData) => indexInFormData === index ? {...item, [name]: value} : item ))
  }

  const handleApply = (index) => {
    if(index === 0) setFormData(prev => prev.map(
      () => ({...prev[0]})
    ))
    else setFormData(prev => prev.map((item, indexCurrent) => index === indexCurrent ? {...prev[index - 1]} : item))
  }

  const handleClick = (formData) => {
    setIsSubmitted(true)
    if(formData.every(item => item.course.trim() != '' && item.category.trim() != '' && item.year.trim() != '' && item.price.trim() != '')) onSubmit(formData)
  }

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-4 mb-6">
        <h3 className="text-xl font-bold text-white">Chi tiết tài liệu</h3>
        <p className="text-sm text-gray-400 mt-1">
          Đang cấu hình cho{" "}
          <span className="font-semibold text-purple-400">
            {file.length} tài liệu
          </span>
          . Điền thông tin để sinh viên khác dễ tìm thấy.
        </p>
      </div>

      <div className="space-y-8">
        {
          file.map(
            (item, index) => (
              <Step2FileCard 
                key={index} 
                item={item} 
                index={index}  
                formData={formData[index]}
                updateForm={handleUpdateForm}
                handleClickApply={handleApply}
                submit={isSubmitted}
              />
          ))
        }
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
        <button
          type="button"
          className="flex items-center gap-2 text-gray-300 hover:text-white font-medium px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 backdrop-blur-md transition-colors cursor-pointer text-sm"
          onClick={() => prevStep()}
        >
          <FiChevronLeft className="w-5 h-5" /> Quay lại bước 1
        </button>

        <button
          type="button"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          onClick={() => handleClick(formData)}
        >
          Hoàn tất & Đăng tài liệu
        </button>
      </div>
    </div>
  );
};

export default Step2Detail;