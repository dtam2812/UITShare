import React, { useState, useEffect } from 'react';
import { CheckSquare, User, FileText, ShoppingCart, CreditCard, Download, Ban, AlertTriangle, UserX, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router';

const termsData = [
  {
    id: 'accept',
    title: '1. Chấp nhận điều khoản',
    icon: CheckSquare,
    content: 'Khi truy cập và sử dụng UITShare, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định trong tài liệu này.'
  },
  {
    id: 'account',
    title: '2. Tài khoản người dùng',
    icon: User,
    content: '- Người dùng phải cung cấp thông tin chính xác khi đăng ký\n- Bạn chịu trách nhiệm bảo mật tài khoản của mình\n- Không được chia sẻ tài khoản cho người khác'
  },
  {
    id: 'content',
    title: '3. Nội dung đăng tải',
    icon: FileText,
    content: 'Người dùng cam kết:\n- Chỉ đăng tải tài liệu thuộc quyền sở hữu hoặc được phép sử dụng\n- Không đăng nội dung vi phạm pháp luật, bản quyền hoặc thuần phong mỹ tục\n- Chịu trách nhiệm hoàn toàn về nội dung đã đăng\n\nUITShare có quyền xóa hoặc từ chối nội dung không phù hợp.'
  },
  {
    id: 'trading',
    title: '4. Mua bán tài liệu',
    icon: ShoppingCart,
    content: '- Người dùng có thể mua và bán tài liệu trên nền tảng\n- Giá tài liệu do người đăng quyết định\n- Sau khi thanh toán thành công, người mua có quyền truy cập tài liệu'
  },
  {
    id: 'payment',
    title: '5. Thanh toán',
    icon: CreditCard,
    content: '- UITShare hỗ trợ thanh toán qua crypto (NFT/ETH) hoặc các phương thức khác (nếu có)\n- Người dùng chịu trách nhiệm về các giao dịch đã thực hiện\n- Hệ thống không chịu trách nhiệm với lỗi từ phía ví hoặc blockchain'
  },
  {
    id: 'access',
    title: '6. Quyền truy cập tài liệu',
    icon: Download,
    content: '- Người dùng có thể tải tài liệu sau khi mua\n- Quyền tải lại tài liệu có hiệu lực trong 3 ngày kể từ ngày mua'
  },
  {
    id: 'forbidden',
    title: '7. Hành vi bị cấm',
    icon: Ban,
    content: 'Người dùng không được:\n- Sao chép, phân phối lại tài liệu trái phép\n- Gian lận, lạm dụng hệ thống\n- Can thiệp hoặc phá hoại hệ thống\n \nUITShare có quyền tạm khóa hoặc chấm dứt tài khoản nếu người dùng vi phạm điều khoản.'
  },
  {
    id: 'liability',
    title: '8. Giới hạn trách nhiệm',
    icon: AlertTriangle,
    content: 'UITShare không chịu trách nhiệm đối với:\n- Nội dung do người dùng đăng tải\n- Thiệt hại phát sinh từ việc sử dụng nền tảng\n- Lỗi từ bên thứ ba (ví điện tử, blockchain, v.v.)'
  }
];

export default function TermsOfService({ onNavigate }) {
  const [activeSection, setActiveSection] = useState(termsData[0].id);

  // Tự động cuộn lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeData = termsData.find(item => item.id === activeSection);

  return (
    <div className="w-full font-sans flex flex-col overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="pt-8 pb-6 md:pt-25 md:pb-20 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text mb-4  pb-2">
            ĐIỀU KHOẢN DỊCH VỤ
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 gap-8 lg:gap-16">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <nav className="flex flex-col space-y-3 sticky top-24">
              {termsData.map((item) => {
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
          <div className="w-full h-full md:w-2/3 lg:w-3/4">
            <div className="bg-[#131722] h-fullrounded-2xl p-8 md:p-10 shadow-sm border border-gray-800 min-h-[450px]">
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-gray-800 pt-12  px-4 md:px-8">
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