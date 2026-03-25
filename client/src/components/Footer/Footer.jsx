import React from 'react';
import { FaTelegram, FaDiscord, FaXTwitter, FaFacebookF, FaTiktok, FaYoutube, FaThreads, FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router';

export default function Footer({ onNavigate }) {
  return <footer className="relative z-20 bg-black  text-gray-300 py-10 px-6 md:px-12 border-t border-gray-800 mt-auto z-10">
      <div className="max-w-7xl ml-0 mr-auto">
        {/* Top section: Logo and Socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8 gap-6">
          <div className="flex items-center mx-auto md:mx-0 gap-4">
            <img src="../public/UIT-Share-Logo-2.svg" alt="UITShare Logo" className="h-20 object-contain" />
            <div className="h-10 w-px bg-gray-700 hidden md:block"></div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaTelegram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaDiscord size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaXTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaTiktok size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaYoutube size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaThreads size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#1c1e2f] flex items-center justify-center hover:bg-gray-600 transition-colors text-white hover:text-purple-300">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6 mb-6 text-sm font-medium">
          <Link to="/faq" className="hover:text-purple-300 transition-colors">Hỏi-Đáp</Link>
          <Link to="/privacy" className="hover:text-purple-300 transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-purple-300 transition-colors">Điều khoản sử dụng</Link>
          <Link to="/about" className="hover:text-purple-300 transition-colors">Giới thiệu</Link>
          <Link to="/contact" className="hover:text-purple-300 transition-colors">Liên hệ</Link>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-5xl">
          UITShare – Nền tảng chia sẻ và mua bán tài liệu học tập dành riêng cho sinh viên Trường Đại học Công nghệ Thông tin (UIT). UITShare giúp sinh viên dễ dàng trao đổi tài liệu các môn học như lập trình, cơ sở dữ liệu, mạng máy tính, trí tuệ nhân tạo, hệ thống thông tin, toán học và nhiều học phần chuyên ngành khác.
        </p>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          © 2026 UITShare
        </p>
      </div>
    </footer>;
}