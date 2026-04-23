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
import { useCart } from "../../context/CartContext";

export default function Admin({ onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const { reloadCartForCurrentUser } = useCart();
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

  const getListDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await axios.get("/api/documents/documentList");
      if (response.status === 200) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      getListUser();
    }
  }, [activeTab, users.length]);

  useEffect(() => {
    if (activeTab === "documents" && documents.length === 0) {
      getListDocuments();
    }
  }, [activeTab, documents.length]);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
    reloadCartForCurrentUser();
  };

  return (
    <div className="bg-[#0b0f19] font-sans">
      {/* Background Blurs */}
      <div className="flex h-[800px]">
        {/* Sidebar */}
        <div className="z-10 flex w-64 shrink-0 flex-col text-gray-300 shadow-xl">
          <nav className="flex-1 space-y-1 py-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "overview" ? "border-r-4 border-purple-500 bg-purple-600/20 font-medium text-purple-400" : "hover:bg-white/5"}`}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex w-full items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "users" ? "border-r-4 border-purple-500 bg-purple-600/20 font-medium text-purple-400" : "hover:bg-white/5"}`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex w-full cursor-pointer items-center space-x-3 px-6 py-3 transition-colors ${activeTab === "documents" ? "mr-4 rounded-r-full bg-white font-medium text-[#1c1e2f]" : "hover:bg-white/5"}`}
            >
              <BookOpen size={20} />
              <span>Documents</span>
            </button>

            <button
              onClick={onSignOut}
              className="flex w-full cursor-pointer items-center space-x-3 px-6 py-3 transition-colors hover:bg-white/5"
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
