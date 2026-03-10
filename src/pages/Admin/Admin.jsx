import React, { useState } from 'react';
import { Users, BookOpen, UserCheck, LayoutDashboard, LogOut } from 'lucide-react';
import Overview from '../../components/Admin/Overview';
import UsersTab from '../../components/Admin/UsersTab';
import AuthorsTab from '../../components/Admin/AuthorsTab';
import DocumentsTab from '../../components/Admin/DocumentsTab';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
const INITIAL_USERS = [{
  id: 'U001',
  name: 'Đinh Nguyễn Đức Tâm',
  email: 'tamdinh@gmail.com',
  role: 'User',
  status: 'Active',
  joinDate: '2026-01-15'
}, {
  id: 'U002',
  name: 'Đỗ Tấn Tường',
  email: 'tuongdob@gmail.com',
  role: 'User',
  status: 'Active',
  joinDate: '2026-01-02'
}, {
  id: 'U003',
  name: 'Trần Thành Vinh',
  email: 'vinhtran@gmail.com',
  role: 'User',
  status: 'Banned',
  joinDate: '2026-03-06'
}, {
  id: 'U004',
  name: 'Nguyễn Phước Thịnh',
  email: 'thinhtu@gmail.com',
  role: 'User',
  status: 'Active',
  joinDate: '2026-01-05'
},];
const INITIAL_AUTHORS = [{
  id: 'A001',
  name: 'PGS.TS Nguyễn X',
  email: 'nguyenx@university.edu.vn',
  docsCount: 45,
  revenue: '15,000,000đ',
  status: 'Verified'
}, {
  id: 'A002',
  name: 'ThS. Trần Y',
  email: 'trany@university.edu.vn',
  docsCount: 12,
  revenue: '3,500,000đ',
  status: 'Verified'
}, {
  id: 'A003',
  name: 'Lê Z (Sinh viên giỏi)',
  email: 'lez@student.edu.vn',
  docsCount: 5,
  revenue: '800,000đ',
  status: 'Pending'
}];
const INITIAL_DOCUMENTS = [{
  id: 'D001',
  title: 'Giáo trình Lập trình hướng đối tượng',
  subjectId: 'IT002',
  subject: 'Lập trình hướng đối tượng',
  author: 'PGS.TS Nguyễn X',
  buyPrice: '50,000đ',
  status: 'Approved',
  sales: 120
}, {
  id: 'D002',
  title: 'Tài liệu ôn thi Cấu trúc dữ liệu',
  subjectId: 'IT003',
  subject: 'Cấu trúc dữ liệu và giải thuật',
  author: 'ThS. Trần Y',
  buyPrice: '30,000đ',
  status: 'Approved',
  sales: 85
}, {
  id: 'D003',
  title: 'Đồ án Hệ điều hành xuất sắc',
  subjectId: 'IT007',
  subject: 'Hệ điều hành',
  author: 'Lê Z (Sinh viên giỏi)',
  buyPrice: '100,000đ',
  status: 'Pending',
  sales: 0
}, {
  id: 'D004',
  title: 'Bài tập Cơ sở dữ liệu có lời giải',
  subjectId: 'IT004',
  subject: 'Cơ sở dữ liệu',
  author: 'PGS.TS Nguyễn X',
  buyPrice: '40,000đ',
  status: 'Rejected',
  sales: 0
}, {
  id: 'D005',
  title: 'Internet và công nghệ Web Cơ Bản',
  subjectId: 'IE104',
  subject: 'Internet và công nghệ Web',
  author: 'ThS. Trần Y',
  buyPrice: '45,000đ',
  status: 'Approved',
  sales: 40
}, {
  id: 'D006',
  title: 'Tài liệu Điện toán đám mây',
  subjectId: 'IS402',
  subject: 'Điện toán đám mây',
  author: 'PGS.TS Nguyễn X',
  buyPrice: '60,000đ',
  status: 'Approved',
  sales: 200
}];
export default function Admin({
  onSignOut
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [authors, setAuthors] = useState(INITIAL_AUTHORS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  return (
    <div className="flex flex-col min-h-screen bg-[#2b2d42] font-sans">
      <Header />
      <div className="h-[800px] flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1c1e2f] text-gray-300 flex flex-col shadow-xl z-10 shrink-0">
          <nav className="flex-1 py-4 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "overview" ? "bg-white text-[#1c1e2f] font-medium rounded-r-full mr-4" : "hover:bg-white/5"}`}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "users" ? "bg-white text-[#1c1e2f] font-medium rounded-r-full mr-4" : "hover:bg-white/5"}`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab("authors")}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "authors" ? "bg-white text-[#1c1e2f] font-medium rounded-r-full mr-4" : "hover:bg-white/5"}`}
            >
              <UserCheck size={20} />
              <span>Authors</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "documents" ? "bg-white text-[#1c1e2f] font-medium rounded-r-full mr-4" : "hover:bg-white/5"}`}
            >
              <BookOpen size={20} />
              <span>Documents</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full flex items-center space-x-3 px-6 py-3 transition-colors hover:bg-white/5"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <Overview users={users} authors={authors} documents={documents} />
          )}
          {activeTab === "users" && (
            <UsersTab users={users} setUsers={setUsers} />
          )}
          {activeTab === "authors" && (
            <AuthorsTab authors={authors} setAuthors={setAuthors} />
          )}
          {activeTab === "documents" && (
            <DocumentsTab documents={documents} setDocuments={setDocuments} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 