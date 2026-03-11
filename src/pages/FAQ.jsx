import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const tabs = ["Sản phẩm", "Thanh toán", "Mua hàng & Hoàn trả"];

const faqData = {
  "Sản phẩm": [
    {
      id: 1,
      question: "1. Tôi có thể tìm thấy những loại tài liệu nào trên UITShare?",
      answer:
        "UITShare cung cấp nhiều loại tài liệu học tập như slide bài giảng, đề thi, tài liệu ôn tập, bài tập, và tài liệu tham khảo cho các môn học tại Trường Đại học Công nghệ Thông tin.",
    },
    {
      id: 2,
      question: "2. Làm sao để tìm tài liệu mình cần?",
      answer:
        "Bạn có thể sử dụng thanh tìm kiếm hoặc duyệt theo danh mục môn học để tìm tài liệu phù hợp với nhu cầu học tập của mình.",
    },
    {
      id: 3,
      question: "3. Làm sao để tải tài liệu xuống?",
      answer:
        "Bạn chỉ cần: Chọn tài liệu muốn mua -> Nhấn Mua tài liệu -> Thanh toán theo hướng dẫn -> Sau khi thanh toán thành công, bạn có thể tải tài liệu ngay.",
    },
  ],
  "Thanh toán": [
    {
      id: 5,
      question: "1. Tôi có thể thanh toán bằng những phương thức nào?",
      answer:
        "UITShare hỗ trợ thanh toán bằng tiền điện tử thông qua blockchain.\nHiện tại người dùng có thể thanh toán bằng:\n- NFT Token của nền tảng\n- Ethereum (ETH) thông qua ví crypto\n\nSau khi kết nối ví và xác nhận giao dịch, hệ thống sẽ xử lý thanh toán và cho phép bạn tải tài liệu ngay.",
    },
    {
      id: 6,
      question: "2. Khi nào tôi có thể tải tài liệu sau khi thanh toán?",
      answer:
        "Sau khi thanh toán thành công, bạn có thể tải tài liệu ngay lập tức từ trang chi tiết tài liệu hoặc trong mục Tài liệu của tôi.",
    },
    {
      id: 9,
      question: "3. Thanh toán trên UITShare có an toàn không?",
      answer:
        "Có. Hệ thống thanh toán được thiết kế để đảm bảo an toàn và bảo mật thông tin người dùng trong quá trình giao dịch.",
    },
  ],
  "Mua hàng & Hoàn trả": [
    {
      id: 7,
      question: "1. Sau khi mua, tôi nhận tài liệu như thế nào?",
      answer:
        "Sau khi thanh toán thành công, bạn có thể tải tài liệu ngay lập tức từ trang chi tiết tài liệu hoặc trong mục Tài liệu của tôi.",
    },
    {
      id: 8,
      question: "2. Tôi có thể tải lại tài liệu đã mua không?",
      answer:
        "Có. Sau khi mua tài liệu thành công, bạn có thể tải lại tài liệu trong vòng 3 ngày kể từ ngày mua.\nSau thời gian này, quyền tải lại có thể bị giới hạn. Nếu gặp vấn đề khi tải tài liệu, vui lòng liên hệ với bộ phận hỗ trợ của UITShare để được giúp đỡ.",
    },
    {
      id: 10,
      question: "3. Tôi có thể yêu cầu hoàn tiền không?",
      answer:
        "Nếu gặp lỗi thanh toán hoặc không thể tải tài liệu, bạn có thể liên hệ bộ phận hỗ trợ của UITShare để được kiểm tra và xử lý.",
    },
  ],
};

export default function FAQ({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("Sản phẩm");
  const [activeFaq, setActiveFaq] = useState(1);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="bg-[#1c1e2f] pt-40 pb-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            CÂU HỎI THƯỜNG GẶP
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveFaq(faqData[tab][0]?.id || null);
              }}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-purple-100 text-gray-800 border-[#8b5cf6]"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto mt-12 space-y-4">
          {faqData[activeTab]?.map((faq) => {
            const isActive = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                onClick={() => setActiveFaq(isActive ? null : faq.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                  isActive
                    ? "bg-purple-600 border-[#8b5cf6] text-white shadow-md"
                    : "bg-[#fcfcfd] border-gray-100 text-[#1e1b4b] hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3
                    className={`font-bold text-lg ${isActive ? "text-white" : "text-[#1e1b4b]"}`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-white text-[#8b5cf6]"
                        : "bg-white text-gray-500 shadow-sm border border-gray-100"
                    }`}
                  >
                    {isActive ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>
                </div>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActive
                      ? "max-h-60 opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <p className="text-white/90 text-sm leading-relaxed pr-12 whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-24 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-gray-100 pt-12">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-[#1e1b4b] mb-2">
              Câu hỏi khác?
            </h3>
            <p className="text-gray-900 text-sm leading-relaxed">
              Nếu bạn còn bất kỳ thắc mắc nào hoặc cần thêm thông tin, đừng ngần
              ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("contact")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-md font-medium transition-colors shrink-0 text-sm"
          >
            Liên hệ với chúng tôi
          </button>
        </div>
      </div>
      <div className="w-full h-24 sm:h-32 bg-[#1c1e2f]"></div>

      <Footer />
    </div>
  );
}
