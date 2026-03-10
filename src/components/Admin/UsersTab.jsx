import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import ModalOverlay from "./ModalOverlay";
export default function UsersTab({ users, setUsers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };
  const openAddModal = () => {
    setForm({
      id: "",
      name: "",
      email: "",
      role: "User",
      status: "Active",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  const openEditModal = (user) => {
    setForm(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setUsers(users.map((u) => (u.id === form.id ? form : u)));
    } else {
      const newUser = {
        id: `U00${users.length + 1}`,
        ...form,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchStatus =
      statusFilter === "All Status" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });
  const columns = [
    {
      header: "No.",
      accessor: "id",
    },
    {
      header: "Name",
      accessor: (row) => (
        <span className="font-medium text-gray-800">{row.name}</span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${row.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Edit",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => openEditModal(row)}
          className="text-gray-400 hover:text-blue-600 transition-colors"
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
          onClick={() => handleDelete(row.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
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
        className="border border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-md px-4 py-2 outline-none"
      >
        <option>All Roles</option>
        <option>User</option>
        <option>Admin</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-md px-4 py-2 outline-none"
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Banned</option>
      </select>
    </>
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Users</h2>
        <button
          onClick={openAddModal}
          className="bg-[#1c1e2f] hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors border border-gray-700"
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
        data={filteredUsers}
        emptyMessage="No users found."
      />

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {isEditMode ? "Edit User" : "Add New User"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option>Active</option>
                <option>Banned</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1c1e2f] text-white rounded-md hover:bg-gray-800"
              >
                Save User
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>
  );
}
