import React from "react";
import { Users, UserCheck, BookOpen } from "lucide-react";
export default function Overview({ users, documents }) {
  const totalUsers = users.length;
  const totalDocs = documents.length;
  /* const totalRevenue = authors.reduce((sum, a) => {
    const val = parseInt(a.revenue.replace(/\D/g, '') || '0');
    return sum + val;
  }, 0); */
  const formatRevenue = (rev) => {
    if (rev >= 1000000) return (rev / 1000000).toFixed(1) + "M";
    if (rev >= 1000) return (rev / 1000).toFixed(1) + "K";
    return rev.toString();
  };
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Tổng người dùng</p>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
            <UserCheck size={24} />
          </div>
          {/*  <div>
            <p className="text-sm text-gray-500 font-medium">
              Tác giả đã duyệt
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {verifiedAuthors}
            </p>
          </div> */}
        </div>
        <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Tài liệu hiện có
            </p>
            <p className="text-2xl font-bold text-gray-800">{totalDocs}</p>
          </div>
        </div>
        <div className="bg-[#131722] p-6 rounded-xl shadow-sm border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg">
            <span className="font-bold text-xl">₫</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Doanh thu tháng</p>
            {/* <p className="text-2xl font-bold text-gray-800">
              {formatRevenue(totalRevenue)}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
