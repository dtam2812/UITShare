import React, { useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import SearchBar from "./AdminSearchBar";
import DataTable from "./DataTable";
import axios from ".././../common";

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
      setDocuments(documents.filter((d) => d._id !== id));
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
    const matchAccess = accessFilter === "All" || d.accessType === accessFilter;
    return matchSearch && matchCategory && matchAccess;
  });

  const columns = [
    {
      header: "Title",
      accessor: (row) => (
        <span
          className="block max-w-[200px] truncate font-medium text-white"
          title={row.title}
        >
          {row.title}
        </span>
      ),
    },
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {row.category}
        </span>
      ),
    },
    {
      header: "Author",
      accessor: (row) => <span>{row.author?.userName || "—"}</span>,
    },
    {
      header: "Price (ETH)",
      accessor: (row) => (
        <span className="font-medium text-green-600">
          {row.price > 0 ? `${row.price} ETH` : "Free"}
        </span>
      ),
    },
    {
      header: "Pages",
      accessor: (row) => <span>{row.pageCount ?? "—"}</span>,
    },
    {
      header: "Downloads",
      accessor: "downloadCount",
    },
    {
      header: "Token ID",
      accessor: (row) => (
        <span className="font-mono text-xs">{row.tokenId ?? "—"}</span>
      ),
    },
    {
      header: "Royalty (%)",
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
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 outline-none"
      >
        <option value="All">All Categories</option>
        <option value="exam">Exam</option>
        <option value="slide">Slide</option>
        <option value="assignment">Assignment</option>
        <option value="project">Project</option>
      </select>
      <select
        value={accessFilter}
        onChange={(e) => setAccessFilter(e.target.value)}
        className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 outline-none"
      >
        <option value="All">All Access</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
        <option value="nft-gated">NFT Gated</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Documents</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by title, subject or author"
        filters={filters}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <DataTable
          title="Documents"
          count={filteredDocs.length}
          columns={columns}
          data={filteredDocs}
          emptyMessage="No documents found."
        />
      )}
    </div>
  );
}
