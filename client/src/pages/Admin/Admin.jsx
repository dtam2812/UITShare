import React, { useState } from "react";
import {
  Users,
  BookOpen,
  UserCheck,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Overview from "../../components/Admin/Overview";
import UsersTab from "../../components/Admin/UsersTab";
import DocumentsTab from "../../components/Admin/DocumentsTab";
import axios from "../../common";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const INITIAL_DOCUMENTS = [
  {
    id: "D001",
    title: "Giáo trình Lập trình hướng đối tượng",
    subjectId: "IT002",
    subject: "Lập trình hướng đối tượng",
    author: "PGS.TS Nguyễn X",
    buyPrice: "50,000đ",
    status: "Approved",
    sales: 120,
  },
  {
    id: "D002",
    title: "Tài liệu ôn thi Cấu trúc dữ liệu",
    subjectId: "IT003",
    subject: "Cấu trúc dữ liệu và giải thuật",
    author: "ThS. Trần Y",
    buyPrice: "30,000đ",
    status: "Approved",
    sales: 85,
  },
  {
    id: "D003",
    title: "Đồ án Hệ điều hành xuất sắc",
    subjectId: "IT007",
    subject: "Hệ điều hành",
    author: "Lê Z (Sinh viên giỏi)",
    buyPrice: "100,000đ",
    status: "Pending",
    sales: 0,
  },
  {
    id: "D004",
    title: "Bài tập Cơ sở dữ liệu có lời giải",
    subjectId: "IT004",
    subject: "Cơ sở dữ liệu",
    author: "PGS.TS Nguyễn X",
    buyPrice: "40,000đ",
    status: "Rejected",
    sales: 0,
  },
  {
    id: "D005",
    title: "Internet và công nghệ Web Cơ Bản",
    subjectId: "IE104",
    subject: "Internet và công nghệ Web",
    author: "ThS. Trần Y",
    buyPrice: "45,000đ",
    status: "Approved",
    sales: 40,
  },
  {
    id: "D006",
    title: "Tài liệu Điện toán đám mây",
    subjectId: "IS402",
    subject: "Điện toán đám mây",
    author: "PGS.TS Nguyễn X",
    buyPrice: "60,000đ",
    status: "Approved",
    sales: 200,
  },
];
export default function Admin({ onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const navigate = useNavigate();

  const getListUser = async () => {
    try {
      const response = await axios.get("/auth/admin/user");

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    getListUser();
  }, [users]);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className=" bg-[#2b2d42] font-sans">
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
              onClick={() => setActiveTab("documents")}
              className={`w-full cursor-pointer flex items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "documents" ? "bg-white text-[#1c1e2f] font-medium rounded-r-full mr-4" : "hover:bg-white/5"}`}
            >
              <BookOpen size={20} />
              <span>Documents</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full cursor-pointer flex items-center space-x-3 px-6 py-3 transition-colors hover:bg-white/5"
            >
              <LogOut size={20} />
              <span onClick={handleLogOut} className="cursor-pointer">
                Sign Out
              </span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <Overview users={users} documents={documents} />
          )}
          {activeTab === "users" && (
            <UsersTab users={users} setUsers={setUsers} />
          )}
          {activeTab === "documents" && (
            <DocumentsTab documents={documents} setDocuments={setDocuments} />
          )}
        </div>
      </div>
    </div>
  );
}
