import React, { useState, useEffect } from "react";
import { Info, Database, Target, Shield, Share2, UserCheck, Cookie, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router';

const policyData = [
  {
    id: "intro",
    title: "1. Giới thiệu",
    icon: Info,
    content:
      "UITShare cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng nền tảng UITShare.",
  },
  {
    id: "collection",
    title: "2. Thông tin chúng tôi thu thập",
    icon: Database,
    content:
      "Khi bạn sử dụng UITShare, chúng tôi có thể thu thập một số thông tin sau:\n\n- Thông tin tài khoản: họ tên, email, mật khẩu.\n- Thông tin giao dịch: lịch sử mua tài liệu, thanh toán.\n- Thông tin sử dụng: các tài liệu bạn xem, tải xuống hoặc đăng tải.\n- Thông tin kỹ thuật: địa chỉ IP, loại thiết bị, trình duyệt.",
  },
  {
    id: "purpose",
    title: "3. Mục đích sử dụng thông tin",
    icon: Target,
    content:
      "Thông tin được thu thập nhằm các mục đích sau:\n\n- Cung cấp và vận hành nền tảng UITShare.\n- Xử lý giao dịch mua bán tài liệu.\n- Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.\n- Hỗ trợ người dùng khi có vấn đề phát sinh.\n- Đảm bảo an toàn và bảo mật hệ thống.",
  },
  {
    id: "security",
    title: "4. Bảo mật thông tin",
    icon: Shield,
    content:
      "Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của người dùng khỏi việc truy cập trái phép, thay đổi hoặc tiết lộ thông tin.",
  },
  {
    id: "sharing",
    title: "5. Chia sẻ thông tin",
    icon: Share2,
    content:
      "UITShare cam kết không bán hoặc chia sẻ thông tin cá nhân của người dùng cho bên thứ ba, ngoại trừ các trường hợp sau:\n\n- Khi có yêu cầu từ cơ quan pháp luật.\n- Khi cần thiết để xử lý thanh toán hoặc giao dịch.\n- Khi người dùng đồng ý chia sẻ thông tin.",
  },
  {
    id: "rights",
    title: "6. Quyền của người dùng",
    icon: UserCheck,
    content:
      "Người dùng có quyền:\n\n- Truy cập và chỉnh sửa thông tin cá nhân.\n- Yêu cầu xóa tài khoản.\n- Liên hệ với chúng tôi để giải quyết các vấn đề liên quan đến quyền riêng tư.",
  },
  {
    id: "cookies",
    title: "7. Cookies",
    icon: Cookie,
    content:
      "UITShare có thể sử dụng cookies để cải thiện trải nghiệm người dùng, ghi nhớ thông tin đăng nhập và phân tích cách người dùng sử dụng nền tảng.",
  },
];

export default function Privacy({ onNavigate }) {
  const [activeSection, setActiveSection] = useState(policyData[0].id);

  // Tự động cuộn lên đầu trang 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeData = policyData.find((item) => item.id === activeSection);

  return (
    <div className="w-full font-sans flex flex-col overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="pt-8 pb-6 md:pt-25 md:pb-20 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text pb-2">
            CHÍNH SÁCH BẢO MẬT
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 gap-8 lg:gap-16">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <nav className="flex flex-col space-y-3 sticky top-24">
              {policyData.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 768) {
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }
                    }}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 border text-left w-full ${
                      isActive
                        ? "bg-purple-600/20 text-purple-400 border-purple-500/50"
                        : "bg-[#131722] text-gray-400 border-gray-800 hover:bg-[#1c1e2f] hover:text-gray-300"
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-[#131722] rounded-2xl p-8 md:p-10 shadow-sm border border-gray-800 min-h-[400px]">
              <h2 className="text-3xl font-bold text-white mb-8 pb-4 border-b border-gray-800">
                {activeData.title}
              </h2>
              <div className="prose prose-purple max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-[15px]">
                  {activeData.content}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Contact Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-gray-800 pt-12  px-4 md:px-8 ">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-white mb-2">Câu hỏi khác?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nếu bạn còn bất kỳ thắc mắc nào hoặc cần thêm thông tin, đừng ngần
                ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
              </p>
            </div>
            <Link to="/contact" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-md font-medium transition-colors shrink-0 text-sm inline-block">
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
