import React, { useState } from "react";
import { Trash2, RefreshCw, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import axios from "../../common";

export default function DocumentsTab({
  documents,
  setDocuments,
  loading,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accessFilter, setAccessFilter] = useState("All");

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    try {
      await axios.delete(`/api/documents/deleteDocument/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      alert(
        "Xóa thất bại: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.author?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || d.category === categoryFilter;
    const matchAccess =
      accessFilter === "All" || d.accessType === accessFilter;
    return matchSearch && matchCategory && matchAccess;
  });

  // Thêm số thứ tự
  const dataWithIndex = filteredDocs.map((d, index) => ({
    ...d,
    no: index + 1,
  }));

  const columns = [
    { header: "STT", accessor: "no" },
    {
      header: "Tiêu đề",
      accessor: (row) => (
        <span
          className="block max-w-[180px] truncate font-medium text-white"
          title={row.title}
        >
          {row.title}
        </span>
      ),
    },
    { header: "Môn học", accessor: "subject" },
    {
      header: "Danh mục",
      accessor: (row) => (
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {row.category}
        </span>
      ),
    },
    {
      header: "Tác giả",
      accessor: (row) => <span>{row.author?.userName || "—"}</span>,
    },
    {
      header: "Giá (ETH)",
      accessor: (row) => (
        <span className="font-medium text-green-500">
          {row.price > 0 ? `${row.price} ETH` : "Miễn phí"}
        </span>
      ),
    },
    {
      header: "Số trang",
      accessor: (row) => <span>{row.pageCount ?? "—"}</span>,
    },
    { header: "Lượt tải", accessor: "downloadCount" },
    {
      header: "Token ID",
      accessor: (row) => (
        <span className="font-mono text-xs">{row.tokenId ?? "—"}</span>
      ),
    },
    {
      header: "Bản quyền (%)",
      accessor: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.royaltyPercent
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.royaltyPercent !== undefined ? `${row.royaltyPercent}%` : "—"}
        </span>
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
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option value="All">Tất cả danh mục</option>
        <option value="exam">Đề thi</option>
        <option value="slide">Slide</option>
        <option value="assignment">Bài tập</option>
        <option value="project">Đồ án</option>
      </select>
      <select
        value={accessFilter}
        onChange={(e) => setAccessFilter(e.target.value)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option value="All">Tất cả quyền truy cập</option>
        <option value="free">Miễn phí</option>
        <option value="paid">Trả phí</option>
        <option value="nft-gated">NFT Gated</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Tài liệu</h2>
        <div className="flex items-center gap-2">
          <button
           onClick={onRefresh}
           disabled={loading}
           className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <Link to="/upload">
            <button
              disabled={loading}
              className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              <Plus size={18} />
              Thêm tài liệu
            </button>
          </Link>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tiêu đề, môn học hoặc tác giả..."
        filters={filters}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <DataTable
          title="Tài liệu"
          count={filteredDocs.length}
          columns={columns}
          data={dataWithIndex}
          emptyMessage="Không tìm thấy tài liệu."
        />
      )}
    </div>
  );
}