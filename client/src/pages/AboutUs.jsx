import React, { useEffect } from 'react';
import { Target, Zap, ShieldCheck, Globe, Users, Heart, Share2 } from 'lucide-react';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full font-sans flex flex-col overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="pt-8 pb-6 md:pt-25 md:pb-20 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text mb-4  pb-2">
            Giới thiệu UITShare
          </h1>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Section 1: Sứ mệnh & Tầm nhìn */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-6">Sứ mệnh & Tầm nhìn</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Chúng tôi hướng đến việc xây dựng một cộng đồng học tập mở, nơi sinh viên có thể tiếp cận tài liệu chất lượng và hỗ trợ lẫn nhau trong quá trình học tập.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-purple-900/50 p-1.5 rounded-full text-purple-400"><Target size={16} /></div>
                  <span className="text-gray-300">Giúp sinh viên tiếp cận tài liệu học tập nhanh chóng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-purple-900/50 p-1.5 rounded-full text-purple-400"><Zap size={16} /></div>
                  <span className="text-gray-300">Tạo cơ hội để sinh viên chia sẻ kiến thức và kiếm thêm thu nhập.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-purple-900/50 p-1.5 rounded-full text-purple-400"><ShieldCheck size={16} /></div>
                  <span className="text-gray-300">Xây dựng một hệ sinh thái học tập minh bạch, an toàn và hiệu quả.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-900/50 p-1.5 rounded-full text-indigo-400"><Globe size={16} /></div>
                  <span className="text-gray-300 font-medium">Tầm nhìn: Trở thành nền tảng chia sẻ tài liệu học tập hàng đầu dành cho sinh viên công nghệ tại Việt Nam.</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-2xl p-8 h-full flex items-center justify-center">
               <img src="../public/UIT-Share-Logo-2.svg" alt="Students studying" className="h-80 rounded-xl shadow-lg object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>

          {/* Section 2: UITShare cung cấp gì? */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">UITShare cung cấp gì?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Những tính năng và giá trị cốt lõi mà nền tảng mang lại cho cộng đồng sinh viên.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-lg flex items-center justify-center mb-4 text-2xl">📚</div>
                <h3 className="font-bold text-white mb-2">Tài liệu học tập</h3>
                <p className="text-gray-400 text-sm">Slide bài giảng, đề thi, bài tập, tài liệu ôn tập đa dạng.</p>
              </div>
              <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-lg flex items-center justify-center mb-4 text-2xl">💰</div>
                <h3 className="font-bold text-white mb-2">Mua bán hợp lý</h3>
                <p className="text-gray-400 text-sm">Mua bán tài liệu với chi phí hợp lý, minh bạch.</p>
              </div>
              <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-purple-900/30 text-purple-400 rounded-lg flex items-center justify-center mb-4 text-2xl">🔍</div>
                <h3 className="font-bold text-white mb-2">Tìm kiếm dễ dàng</h3>
                <p className="text-gray-400 text-sm">Tìm kiếm tài liệu nhanh chóng theo từng môn học cụ thể.</p>
              </div>
              <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 bg-orange-900/30 text-orange-400 rounded-lg flex items-center justify-center mb-4 text-2xl">👤</div>
                <h3 className="font-bold text-white mb-2">Quản lý cá nhân</h3>
                <p className="text-gray-400 text-sm">Quản lý tài khoản và kho tài liệu cá nhân hiệu quả.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
