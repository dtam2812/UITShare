import { Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from 'react-router';
import { useEffect } from "react";

export default function Contact({ onNavigate }) {
  const navigate = useNavigate();

  // Tự động cuộn lên đầu trang 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);  

  return (
    <div className="w-full font-sans flex flex-col overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <div className="pt-8 pb-32 md:pt-25 md:pb-40 px-4 text-center mt-10">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text  pb-2">
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
        </div>

      {/* Contact Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#131722] rounded-xl shadow-sm border border-gray-800 p-8 flex items-start gap-4">
              <div className="text-purple-400 mt-1"><Phone size={24} /></div>
              <div>
                <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase mb-1"> Gọi cho chúng tôi</h3>
                <p className="font-semibold text-gray-200">+84 363 363 369</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#131722] rounded-xl shadow-sm border border-gray-800 p-8 flex items-start gap-4">
              <div className="text-purple-400 mt-1"><Mail size={24} /></div>
              <div>
                <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase mb-1">Email</h3>
                <p className="font-semibold text-gray-200"> support@uitshare.com</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-[#131722] rounded-xl shadow-sm border border-gray-800 p-8 flex items-start gap-4">
              <div className="text-purple-400 mt-1"><MapPin size={24} /></div>
              <div>
                <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase mb-1">Địa chỉ</h3>
                <p className="font-semibold text-gray-200"> Trường ĐH Công nghệ Thông tin <br/>Thủ Đức, TP.HCM </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c1e2f] border border-gray-800 rounded-full text-sm font-medium text-gray-300 mb-6">
                <span>🤝</span> Hợp tác cùng UITShare
              </div>
              <h2 className="text-3xl justify-center md:text-4xl font-bold text-white mb-6">Hợp tác cùng chúng tôi</h2>
              <p className="text-gray-500 leading-relaxed">
                Chia sẻ ý tưởng hoặc thắc mắc của bạn với UITShare.
                Nếu bạn cần hỗ trợ về tài khoản, tài liệu hoặc hợp tác, hãy gửi tin nhắn cho chúng tôi.
                Chúng tôi luôn sẵn sàng hỗ trợ sinh viên UIT.
              </p>
            </div>
            
            {/* Right form */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" className="bg-[#131722] border border-gray-800 text-gray-200 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm" placeholder="Họ" />
                <input type="text" className="bg-[#131722] border border-gray-800 text-gray-200 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm" placeholder="Tên" />
              </div>
              <input type="email" className="bg-[#131722] border border-gray-800 text-gray-200 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm" placeholder="Email" />
              <input type="text" className="bg-[#131722] border border-gray-800 text-gray-200 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm" placeholder="Chủ đề" />
              <textarea className="bg-[#131722] border border-gray-800 text-gray-200 rounded-md px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm resize-none" placeholder="Nội dung liên hệ" />
              <button type="button" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3.5 rounded-md transition-colors text-sm">
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
