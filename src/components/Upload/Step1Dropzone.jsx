import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiFile, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const Step1Dropzone = ({ onNextStep, initialFile = [] }) => {
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0)

  const [fileUploaded, setFileUploaded] = useState(initialFile)
  const [showMenu, setShowMenu] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleInputFile = (e) => {
    const files = Array.from(e.files)

    const validFile = files.filter(item => {
      const fileSize = item.size <= 200 * 1024 * 1024
      const fileType = item.name.match(/\.(pdf|doc|docx)$/i)

      if (!fileSize) toast.error(`File ${item.name} có dung lượng lớn hơn 200MB`)
      if (!fileType) toast.error(`File ${item.name} không đúng định dạng`)

      return fileSize && fileType
    })

    const finalFile = validFile.filter(item => {
      const isDuplicate = fileUploaded.some(uploaded => uploaded.name === item.name)

      if(isDuplicate) {
        toast.error(`File có tên ${item.name} đã tồn tại`)
        return false
      }

      return true
    })

    if(finalFile.length === 0) return

    setFileUploaded(prev => [
        ...prev,
        ...finalFile
    ])

    fileInputRef.current.value = null
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = () => {
    dragCounter.current += 1
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    dragCounter.current -= 1
    if(dragCounter.current == 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()

    setIsDragging(false)
    dragCounter.current = 0

    const droppedFiles = e.dataTransfer.files
    
    if(droppedFiles && droppedFiles.length > 0) {
      handleInputFile({ files: droppedFiles })
    }
  }

  const handleDeleteFile = (item) => {
    setFileUploaded(prev => prev.filter(current => current != item))
  }
  
  return (
    <div className="w-full">
      <div 
        className={`w-full border-2 border-dashed ${isDragging ? 'border-purple-400 bg-white/10' : 'border-white/20 bg-white/5'} backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-purple-400 transition-colors cursor-pointer flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={`flex flex-col items-center transition-opacity duration-200 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mb-4">
            <FiUploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Kéo thả tài liệu vào đây</h3>
          <p className="text-sm text-gray-400 mb-6">hoặc click để chọn file từ máy tính của bạn</p>

          <button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer pointer-events-none"
            type="button"
          >
            Chọn tập tin
          </button>

          <p className="text-xs text-gray-500 mt-4">Hỗ trợ: PDF, DOC, DOCX (Tối đa 200MB)</p>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-[#050816]/80 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in duration-200 pointer-events-none">
            <FiUploadCloud className="w-12 h-12 text-purple-400 mb-3 animate-bounce" />
            <h3 className="text-2xl font-bold text-purple-400">Thả file vào đây luôn đi!</h3>
          </div>
        )}
        
        <input 
          type="file" 
          multiple 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => handleInputFile(e.target)}
        />
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-semibold text-white mb-4">Tài liệu đã chọn ({fileUploaded.length})</h4>
        
        <div className="flex flex-col gap-3">
            {fileUploaded.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:shadow-sm transition-shadow relative">
                    <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center shrink-0">
                        <FiFile className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                            {
                                item.size / (1024 * 1024) >= 1.00 ? `${((item.size / (1024 * 1024)).toFixed(2))} MB` : `${((item.size / 1024).toFixed(0))} KB`
                            }
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
                            onClick={() => setShowMenu(showMenu === index ? null : index)} 
                        >
                            <FiTrash2 className="w-5 h-5" />
                        </button>

                        {showMenu === index && (
                            <div className="absolute right-4 top-[70%] mt-1 w-48 bg-[#050816] rounded-lg shadow-2xl border border-white/10 py-1 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <button 
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium cursor-pointer"
                                    onClick={() => {
                                      handleDeleteFile(item)
                                      setShowMenu(null)
                                    }}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Xoá tài liệu
                                </button>

                                <button 
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                                    onClick={() => setShowMenu(null)}
                                >
                                    <FiX className="w-4 h-4" />
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
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={() => onNextStep(fileUploaded)}
        >
          Tiếp tục điền chi tiết &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step1Dropzone;