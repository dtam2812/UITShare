import React, { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-[#1c1e2f] pt-40 pb-40 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
        </div>

        {/* Contact Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
              <div className="text-purple-600 mt-1">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-500 tracking-wider uppercase mb-1">
                    Gọi cho chúng tôi
                </h3>
                <p className="font-semibold text-gray-900">+84 363 363 369</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
              <div className="text-purple-600 mt-1">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-500 tracking-wider uppercase mb-1">
                    Email 
                </h3>
                <p className="font-semibold text-gray-900">
                  support@uitshare.com
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-start gap-4">
              <div className="text-purple-600 mt-1">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-500 tracking-wider uppercase mb-1">
                    Địa chỉ
                </h3>
                <p className="font-semibold text-gray-900">
                  Trường ĐH Công nghệ Thông tin 
                  <br />
                 Thủ Đức, TP.HCM 
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-slate-700 mb-6">
                <span>🤝</span> Hợp tác cùng UITShare
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1b4b] mb-6">
                Cùng nhau phát triển cộng đồng học tập
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Chia sẻ ý tưởng hoặc thắc mắc của bạn với UITShare.
                Nếu bạn cần hỗ trợ về tài khoản, tài liệu hoặc hợp tác, hãy gửi tin nhắn cho chúng tôi.
                Chúng tôi luôn sẵn sàng hỗ trợ sinh viên UIT.
              </p>
            </div>

            {/* Right form */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="bg-[#f4f5fa] text-gray-700 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm"
                  placeholder="Tên"
                />
                <input
                  type="text"
                  className="bg-[#f4f5fa] text-gray-700 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm"
                  placeholder="Họ và tên đệm"
                />
              </div>
              <input
                type="email"
                className="bg-[#f4f5fa] text-gray-700 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm"
                placeholder="Email"
              />
              <input
                type="text"
                className="bg-[#f4f5fa] text-gray-700 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm"
                placeholder="Tiêu đề"
              />
              <textarea
                className="bg-[#f4f5fa] text-gray-700 rounded-md px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm resize-none"
                placeholder="Nội dung liên hệ"
              />
              <button
                type="button"
                className="w-full bg-purple-600 hover:bg-indigo-600 text-white font-medium py-3.5 rounded-md transition-colors text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full h-24 sm:h-32 bg-[#1c1e2f]"></div>
      <Footer />
    </div>
  );
}
