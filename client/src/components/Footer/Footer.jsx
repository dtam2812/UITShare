import React from 'react';
import { FaTelegram, FaDiscord, FaXTwitter, FaFacebookF, FaTiktok, FaYoutube, FaThreads, FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router';

export default function Footer({ onNavigate }) {
  return (
    <footer className="relative z-20 bg-black text-gray-300 py-8 px-4 sm:py-10 sm:px-6 md:px-12 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto">

        {/* Top: Logo + Socials */}
        <div className="flex flex-col items-center gap-5 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <img
            src="./UIT-Share-Logo-2.svg"
            alt="UITShare Logo"
            className="h-14 sm:h-20 object-contain"
          />

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { icon: <FaDiscord size={16} /> },
              { icon: <FaFacebookF size={16} /> },
              { icon: <FaTiktok size={16} /> },
              { icon: <FaYoutube size={16} /> },
              { icon: <FaThreads size={16} /> },
              { icon: <FaInstagram size={16} /> },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-xs sm:text-sm font-medium justify-center sm:justify-start">
          <Link to="/faq" className="hover:text-purple-300 transition-colors">Hỏi-Đáp</Link>
          <Link to="/privacy" className="hover:text-purple-300 transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-purple-300 transition-colors">Điều khoản sử dụng</Link>
          <Link to="/about" className="hover:text-purple-300 transition-colors">Giới thiệu</Link>
          <Link to="/contact" className="hover:text-purple-300 transition-colors">Liên hệ</Link>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 text-center sm:text-left">
          UITShare – Nền tảng chia sẻ và mua bán tài liệu học tập dành riêng cho sinh viên Trường Đại học Công nghệ Thông tin (UIT). UITShare giúp sinh viên dễ dàng trao đổi tài liệu các môn học như lập trình, cơ sở dữ liệu, mạng máy tính, trí tuệ nhân tạo, hệ thống thông tin, toán học và nhiều học phần chuyên ngành khác.
        </p>

        {/* Copyright */}
        <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
          © 2026 UITShare
        </p>
      </div>
    </footer>
  );
}