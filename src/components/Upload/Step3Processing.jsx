import { FiCheckCircle, FiUploadCloud, FiLoader } from "react-icons/fi";
import { Link } from 'react-router';

const Step3Processing = ({ onReset }) => {
    return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4 mx-auto max-w-2xl mt-10">
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Cảm ơn bạn! Hệ thống đang xử lý tài liệu
      </h2>
      
      <p className="text-gray-400 text-base mb-8">
        Quá trình tải lên IPFS và đúc NFT có thể mất vài phút. Kiểm tra{' '}
        <Link to="/profile/uploaded-docs" className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
          trang quản lý tài liệu
        </Link>{' '}
        để xem khi nào tài liệu của bạn sẵn sàng.
      </p>

      <div className="flex justify-center items-center mb-8 h-48">
        <FiLoader className="w-20 h-20 text-purple-400 animate-spin [animation-duration:3s]" />
      </div>

      <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-medium mb-8 text-left backdrop-blur-md">
        <FiCheckCircle size={20} className="text-green-400 shrink-0" />
        <span>Mỗi tài liệu hợp lệ sẽ được đúc thành 1 NFT độc bản để ghi nhận bản quyền.</span>
      </div>

      <button 
        onClick={onReset}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200 cursor-pointer shadow-sm"
      >
        <FiUploadCloud size={22} />
        Tải lên tài liệu khác
      </button>

      <Link to="/" className="text-purple-400 hover:text-purple-300 hover:underline text-sm mt-5 transition-colors">
        Quay lại trang chủ
      </Link>

    </div>
  );
};

export default Step3Processing;