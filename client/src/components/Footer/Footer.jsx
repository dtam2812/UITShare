import React from "react";
import {
  FaTelegram,
  FaDiscord,
  FaXTwitter,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaThreads,
  FaInstagram,
} from "react-icons/fa6";
import { Link } from "react-router";

export default function Footer({ onNavigate }) {
  return (
    <footer className="relative z-20 mt-auto border-t border-gray-800 bg-black px-4 py-8 text-gray-300 sm:px-6 sm:py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Top: Logo + Socials */}
        <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
          <img
            src="./UIT-Share-Logo-2.svg"
            alt="UITShare Logo"
            className="h-14 object-contain sm:h-20"
          />

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: <FaDiscord size={16} aria-hidden="true" />, label: "Discord" },
              { icon: <FaFacebookF size={16} aria-hidden="true" />, label: "Facebook" },
              { icon: <FaTiktok size={16} aria-hidden="true" />, label: "TikTok" },
              { icon: <FaYoutube size={16} aria-hidden="true" />, label: "YouTube" },
              { icon: <FaThreads size={16} aria-hidden="true" />, label: "Threads" },
              { icon: <FaInstagram size={16} aria-hidden="true" />, label: "Instagram" },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                aria-label={`UITShare trên ${item.label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1e2f] text-white transition-colors hover:bg-gray-600 hover:text-purple-300 sm:h-10 sm:w-10"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium sm:justify-start sm:text-sm">
          <Link to="/faq" className="transition-colors hover:text-purple-300">
            Hỏi-Đáp
          </Link>
          <Link
            to="/privacy"
            className="transition-colors hover:text-purple-300"
          >
            Chính sách bảo mật
          </Link>
          <Link to="/terms" className="transition-colors hover:text-purple-300">
            Điều khoản sử dụng
          </Link>
          <Link to="/about" className="transition-colors hover:text-purple-300">
            Giới thiệu
          </Link>
          <Link
            to="/contact"
            className="transition-colors hover:text-purple-300"
          >
            Liên hệ
          </Link>
        </div>

        {/* Description */}
        <p className="mb-4 text-center text-xs leading-relaxed text-gray-400 sm:text-left sm:text-sm">
          UITShare – Nền tảng chia sẻ và mua bán tài liệu học tập dành riêng cho
          sinh viên Trường Đại học Công nghệ Thông tin (UIT). UITShare giúp sinh
          viên dễ dàng trao đổi tài liệu các môn học như lập trình, cơ sở dữ
          liệu, mạng máy tính, trí tuệ nhân tạo, hệ thống thông tin, toán học và
          nhiều học phần chuyên ngành khác.
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-500 sm:text-left sm:text-sm">
          © 2026 UITShare
        </p>
      </div>
    </footer>
  );
}