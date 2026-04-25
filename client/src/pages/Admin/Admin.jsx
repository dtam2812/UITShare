import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Overview from "../../components/Admin/Overview";
import UsersTab from "../../components/Admin/UsersTab";
import DocumentsTab from "../../components/Admin/DocumentsTab";
import axios from "../../common";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const { reloadCartForCurrentUser } = useCart();
  const navigate = useNavigate();

  const getListUser = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("/auth/admin/user");
      if (response.status === 200) setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const getListDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await axios.get("/api/documents/documentList");
      if (response.status === 200) setDocuments(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoadingDocuments(false);
    }
  };

  // ✅ Fetch cả 2 ngay khi mount → Overview có số liệu ngay
  useEffect(() => {
    getListUser();
    getListDocuments();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    reloadCartForCurrentUser();
    navigate("/login");
  };

  const navItems = [
    { key: "overview", label: "Tổng quan", icon: <LayoutDashboard size={20} /> },
    { key: "users", label: "Người dùng", icon: <Users size={20} /> },
    { key: "documents", label: "Tài liệu", icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] font-sans">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Sidebar */}
        <div className="z-10 flex w-64 shrink-0 flex-col border-r border-gray-800 text-gray-300 shadow-xl">
          <div className="border-b border-gray-800 px-6 py-6">
            <h1 className="text-lg font-bold text-white">Trang Quản trị</h1>
          </div>
          <nav className="flex-1 space-y-1 py-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center space-x-3 px-6 py-3 transition-colors ${
                  activeTab === item.key
                    ? "border-r-4 border-purple-500 bg-purple-600/20 font-medium text-purple-400"
                    : "hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="border-t border-gray-800 py-4">
            <button
              onClick={handleLogOut}
              className="flex w-full cursor-pointer items-center space-x-3 px-6 py-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "overview" && (
            <Overview users={users} documents={documents} />
          )}
          {activeTab === "users" && (
            <UsersTab
              users={users}
              setUsers={setUsers}
              loading={loadingUsers}
              onRefresh={getListUser}
            />
          )}
          {activeTab === "documents" && (
            <DocumentsTab
              documents={documents}
              setDocuments={setDocuments}
              loading={loadingDocuments}
              onRefresh={getListDocuments}
            />
          )}
        </div>
      </div>
    </div>
  );
}