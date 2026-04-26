import React, { useState } from "react";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import ModalOverlay from "./ModalOverlay";
import axios from "../../common";
import { useNavigate } from "react-router";

const emptyForm = {
  _id: "",
  userName: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
};

export default function UsersTab({ users, setUsers, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      const response = await axios.delete(`/auth/admin/user/delete/${userId}`);
      if (response.status === 200) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    }
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setSubmitError("");
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setForm({
      _id: user._id,
      userName: user.userName || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
      status: user.status || "active",
    });
    setSubmitError("");
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      if (isEditMode) {
        const payload = {
          userName: form.userName,
          email: form.email,
          role: form.role,
          status: form.status,
        };
        if (form.password.trim() !== "") payload.password = form.password;

        const response = await axios.put(
          `/auth/admin/user/update/${form._id}`,
          payload,
        );
        if (response.status === 200) {
          setUsers((prev) =>
            prev.map((u) => (u._id === form._id ? response.data : u)),
          );
          setIsModalOpen(false);
        }
      } else {
        const response = await axios.post("/auth/admin/user/create", {
          userName: form.userName,
          email: form.email,
          password: form.password,
          role: form.role,
          status: form.status,
        });
        if (response.status === 200 || response.status === 201) {
          setUsers((prev) => [...prev, response.data]);
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole =
      roleFilter === "All Roles" || u.role === roleFilter.toLowerCase();
    const matchStatus =
      statusFilter === "All Status" || u.status === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const dataWithIndex = filteredUsers.map((u, index) => ({
    ...u,
    no: index + 1,
  }));

  const columns = [
    { header: "STT", accessor: "no" },
    {
      header: "Tên người dùng",
      accessor: (row) => (
        <span className="font-medium text-white">{row.userName}</span>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Vai trò",
      accessor: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {row.role === "admin" ? "Quản trị viên" : "Người dùng"}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      accessor: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status === "active" ? "Hoạt động" : "Bị khóa"}
        </span>
      ),
    },
    {
      header: "Sửa",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => openEditModal(row)}
          className="text-gray-400 transition-colors hover:text-blue-500"
        >
          <Edit size={18} className="mx-auto" />
        </button>
      ),
    },
    {
      header: "Xóa",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-gray-400 transition-colors hover:text-red-500"
        >
          <Trash2 size={18} className="mx-auto" />
        </button>
      ),
    },
  ];

  const filters = (
    <>
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option>All Roles</option>
        <option>User</option>
        <option>Admin</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Banned</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header: tiêu đề + 2 nút cạnh nhau */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Người dùng</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            onClick={openAddModal}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <Plus size={18} />
            Thêm người dùng
          </button>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tên hoặc email..."
        filters={filters}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <DataTable
          title="Người dùng"
          count={filteredUsers.length}
          columns={columns}
          data={dataWithIndex}
          emptyMessage="Không tìm thấy người dùng."
        />
      )}

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h3>

          {submitError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên người dùng
              </label>
              <input
                required
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isEditMode
                  ? "Mật khẩu mới (để trống nếu không đổi)"
                  : "Mật khẩu"}
              </label>
              <input
                required={!isEditMode}
                type="password"
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Hoạt động</option>
                <option value="banned">Bị khóa</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting
                  ? "Đang lưu..."
                  : isEditMode
                    ? "Cập nhật"
                    : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>
  );
}