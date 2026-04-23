import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import ModalOverlay from "./ModalOverlay";
import axios from "../../common";
import { useNavigate } from "react-router";

export default function UsersTab({ users, setUsers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    walletAddress: "",
    avatar: "",
    role: "user",
    status: "active",
  });

  const handleDelete = async (userId) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        const response = await axios.delete(
          `/auth/admin/user/delete/${userId}`,
        );
        if (response.status === 200) {
          setUsers(users.filter((element) => element._id !== userId));
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const openAddModal = () => {
    setForm({
      id: "",
      userName: "",
      email: "",
      password: "",
      walletAddress: "",
      avatar: "",
      role: "user",
      status: "active",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setForm(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmitAddUser = async (e) => {
    e.preventDefault();
    try {
      const userName = document.getElementById("userName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      const status = document.getElementById("status").value;

      const response = await axios.post("auth/admin/user/create", {
        userName: userName,
        email: email,
        password: password,
        role: role,
        status: status,
      });

      if (response.status === 200) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.id || "").toLowerCase().includes(searchTerm.toLowerCase());
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
    {
      header: "No.",
      accessor: "no",
    },
    {
      header: "Name",
      accessor: (row) => (
        <span className="font-medium text-white">{row.userName}</span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: (row) => row.role.charAt(0).toUpperCase() + row.role.slice(1),
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Edit",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => openEditModal(row)}
          className="text-gray-400 transition-colors hover:text-blue-600"
        >
          <Edit size={18} className="mx-auto" />
        </button>
      ),
    },
    {
      header: "Delete",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-gray-400 transition-colors hover:text-red-600"
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
        className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 outline-none"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Users</h2>
        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by user name or ID (e.g. U001)"
        filters={filters}
      />

      <DataTable
        title="Users"
        count={filteredUsers.length}
        columns={columns}
        data={dataWithIndex}
        emptyMessage="No users found."
      />

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-800">
            {isEditMode ? "Edit User" : "Add New User"}
          </h3>
          <form onSubmit={handleSubmitAddUser} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="userName"
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
                id="email"
                required
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#1c1e2f] px-4 py-2 text-white hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>
  );
}
