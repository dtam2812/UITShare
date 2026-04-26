import React, { useState } from "react";
import { Trash2, RefreshCw, Plus, Pencil } from "lucide-react";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import ModalOverlay from "./ModalOverlay";
import axios from "../../common";

const emptyForm = { _id: "", name: "", category: "Đại cương" };
const CATEGORIES = ["Đại cương", "Cơ sở ngành", "Chuyên ngành"];

export default function SubjectsTab({ subjects, setSubjects, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm(`Xóa môn học "${id}"?`)) return;
    try {
      await axios.delete(`/api/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Xóa thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setSubmitError("");
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setForm({ _id: subject.id, name: subject.name, category: subject.category });
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
        const res = await axios.put(`/api/subjects/${form._id}`, {
          name: form.name,
          category: form.category,
        });
        if (res.status === 200) {
          setSubjects((prev) =>
            prev.map((s) => (s.id === form._id ? { id: form._id, name: form.name, category: form.category } : s))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await axios.post("/api/subjects", {
          _id: form._id.toUpperCase(),
          name: form.name,
          category: form.category,
        });
        if (res.status === 200 || res.status === 201) {
          setSubjects((prev) => [...prev, res.data]);
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColor = {
    "Đại cương": "bg-blue-100 text-blue-700",
    "Cơ sở ngành": "bg-amber-100 text-amber-700",
    "Chuyên ngành": "bg-purple-100 text-purple-700",
  };

  const filtered = subjects.filter((s) => {
    const matchSearch =
      s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === "All" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const dataWithIndex = filtered.map((s, i) => ({ ...s, no: i + 1 }));

  const columns = [
    { header: "STT", accessor: "no" },
    {
      header: "Mã môn",
      accessor: (row) => (
        <span className="font-mono font-semibold text-purple-400">{row.id}</span>
      ),
    },
    {
      header: "Tên môn học",
      accessor: (row) => <span className="font-medium text-white">{row.name}</span>,
    },
    {
      header: "Phân loại",
      accessor: (row) => (
        <span className={`rounded-md px-2 py-1 text-xs font-medium ${categoryColor[row.category] || "bg-gray-100 text-gray-600"}`}>
          {row.category}
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
          <Pencil size={16} className="mx-auto" />
        </button>
      ),
    },
    {
      header: "Xóa",
      className: "text-center",
      accessor: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-gray-400 transition-colors hover:text-red-500"
        >
          <Trash2 size={16} className="mx-auto" />
        </button>
      ),
    },
  ];

  const filters = (
    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
    >
      <option value="All">Tất cả phân loại</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Môn học</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            <Plus size={18} />
            Thêm môn học
          </button>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo mã môn hoặc tên môn học..."
        filters={filters}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <DataTable
          title="Môn học"
          count={filtered.length}
          columns={columns}
          data={dataWithIndex}
          emptyMessage="Không tìm thấy môn học."
        />
      )}

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
          </h3>

          {submitError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mã môn (VD: IT001, MA006)
              </label>
              <input
                required
                type="text"
                disabled={isEditMode}
                placeholder="IT001"
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono uppercase outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                value={form._id}
                onChange={(e) => setForm({ ...form, _id: e.target.value.toUpperCase() })}
              />
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-400">Mã môn không thể thay đổi sau khi tạo.</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên môn học
              </label>
              <input
                required
                type="text"
                placeholder="Nhập tên môn học..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phân loại
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
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
                {submitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>
  );
}