import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  ArrowLeftRight,
  Menu,
  X,
} from "lucide-react";
import Overview from "../../components/Admin/Overview";
import UsersTab from "../../components/Admin/UsersTab";
import DocumentsTab from "../../components/Admin/DocumentsTab";
import SubjectsTab from "../../components/Admin/SubjectTab";
import TransactionsTab from "../../components/Admin/TransactionsTab";
import axios from "../../common";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
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

  const getListSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const response = await axios.get("/api/subjects");
      if (response.status === 200) setSubjects(response.data);
    } catch (error) {
      console.error("Lỗi khi tải môn học:", error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const getListTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const response = await axios.get("/api/transactions/admin/all");
      if (response.status === 200) setTransactions(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch tất cả ngay khi mount → Overview có đủ số liệu ngay
  useEffect(() => {
    getListUser();
    getListDocuments();
    getListSubjects();
    getListTransactions();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    reloadCartForCurrentUser();
    navigate("/login");
  };

  const navItems = [
    { key: "overview",     label: "Tổng quan",  icon: <LayoutDashboard size={20} /> },
    { key: "users",        label: "Người dùng", icon: <Users size={20} /> },
    { key: "documents",    label: "Tài liệu",   icon: <BookOpen size={20} /> },
    { key: "subjects",     label: "Môn học",    icon: <GraduationCap size={20} /> },
    { key: "transactions", label: "Giao dịch",  icon: <ArrowLeftRight size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] font-sans">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4 md:hidden">
        <h1 className="text-lg font-bold text-white">Trang Quản trị</h1>
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-gray-800 bg-[#0b0f19] text-gray-300 shadow-xl transition-transform duration-300 md:static md:translate-x-0 md:z-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-6">
            <h1 className="text-lg font-bold text-white">Trang Quản trị</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors md:hidden"
              aria-label="Đóng menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 py-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setSidebarOpen(false);
                }}
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
            <Overview
              users={users}
              documents={documents}
              subjects={subjects}
              transactions={transactions}
            />
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
          {activeTab === "subjects" && (
            <SubjectsTab
              subjects={subjects}
              setSubjects={setSubjects}
              loading={loadingSubjects}
              onRefresh={getListSubjects}
            />
          )}
          {activeTab === "transactions" && (
            <TransactionsTab
              transactions={transactions}
              loading={loadingTransactions}
              onRefresh={getListTransactions}
            />
          )}
        </div>
      </div>
    </div>
  );
}