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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center space-x-4 rounded-xl border border-gray-800 bg-[#131722] p-6 shadow-sm">
          <div className="rounded-lg bg-blue-500/20 p-3 text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Tổng người dùng</p>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rounded-xl border border-gray-800 bg-[#131722] p-6 shadow-sm">
          <div className="rounded-lg bg-purple-500/20 p-3 text-purple-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Tài liệu hiện có
            </p>
            <p className="text-2xl font-bold text-white">{totalDocs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
