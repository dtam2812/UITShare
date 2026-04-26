import React, { useState } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "./AdminSearchBar";

const TYPE_COLORS = {
  buy:      { label: "Mua",      cls: "bg-green-100 text-green-700" },
  donate:   { label: "Donate",   cls: "bg-pink-100 text-pink-700" },
  transfer: { label: "Chuyển",   cls: "bg-blue-100 text-blue-700" },
  royalty:  { label: "Hoa hồng", cls: "bg-amber-100 text-amber-700" },
  mint:     { label: "Mint",     cls: "bg-purple-100 text-purple-700" },
  list:     { label: "Đăng bán", cls: "bg-cyan-100 text-cyan-700" },
  cancel:   { label: "Hủy bán",  cls: "bg-gray-100 text-gray-600" },
};

const STATUS_COLORS = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed:  "bg-red-100 text-red-700",
};
const STATUS_LABELS = { success: "Thành công", pending: "Đang xử lý", failed: "Thất bại" };

const ITEMS_PER_PAGE = 5;

export default function TransactionsTab({ transactions, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.document?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromUser?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toUser?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType   = typeFilter   === "All" || tx.type   === typeFilter;
    const matchStatus = statusFilter === "All" || tx.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const filters = (
    <>
      <select
        value={typeFilter}
        onChange={handleFilterChange(setTypeFilter)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option value="All">Tất cả loại</option>
        {Object.entries(TYPE_COLORS).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={handleFilterChange(setStatusFilter)}
        className="rounded-md border border-gray-800 bg-[#1c1e2f] px-4 py-2 text-sm text-gray-300 outline-none focus:border-purple-500"
      >
        <option value="All">Tất cả trạng thái</option>
        <option value="success">Thành công</option>
        <option value="pending">Đang xử lý</option>
        <option value="failed">Thất bại</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Giao dịch</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1c1e2f] px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(v) => { setSearchTerm(v); setCurrentPage(1); }}
        placeholder="Tìm theo tài liệu, người gửi, người nhận..."
        filters={filters}
      />

      {loading ? (
        <div className="py-16 text-center text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#131722] shadow-sm">
          {/* Title row */}
          <div className="border-b border-gray-800 p-4">
            <h3 className="font-medium text-white">
              Giao dịch <span className="font-normal text-gray-400">({filtered.length})</span>
            </h3>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="w-12 px-4 py-4 font-semibold text-gray-300">STT</th>
                  <th className="w-24 px-4 py-4 font-semibold text-gray-300">Loại</th>
                  <th className="w-48 px-4 py-4 font-semibold text-gray-300">Tài liệu</th>
                  <th className="w-32 px-4 py-4 font-semibold text-gray-300">Người gửi</th>
                  <th className="w-32 px-4 py-4 font-semibold text-gray-300">Người nhận</th>
                  <th className="w-24 px-4 py-4 font-semibold text-gray-300">Giá (ETH)</th>
                  <th className="w-28 px-4 py-4 font-semibold text-gray-300">Phí GD</th>
                  <th className="w-24 px-4 py-4 font-semibold text-gray-300">Ngày</th>
                  <th className="w-28 px-4 py-4 font-semibold text-gray-300">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      Không tìm thấy giao dịch.
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx, i) => {
                    const typeInfo = TYPE_COLORS[tx.type] || { label: tx.type, cls: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={tx.txHash ?? i} className="border-b border-gray-800 transition-colors hover:bg-[#1c1e2f]">
                        {/* STT */}
                        <td className="px-4 py-4 text-gray-400">
                          {(safePage - 1) * ITEMS_PER_PAGE + i + 1}
                        </td>
                        {/* Loại */}
                        <td className="px-4 py-4">
                          <span className={`inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${typeInfo.cls}`}>
                            {typeInfo.label}
                          </span>
                        </td>
                        {/* Tài liệu */}
                        <td className="px-4 py-4">
                          <span
                            className="block max-w-[180px] truncate text-white"
                            title={tx.document?.title}
                          >
                            {tx.document?.title ?? "—"}
                          </span>
                        </td>
                        {/* Người gửi */}
                        <td className="px-4 py-4">
                          <span
                            className="block max-w-[120px] truncate text-gray-300"
                            title={tx.fromUser?.userName}
                          >
                            {tx.fromUser?.userName ?? "—"}
                          </span>
                        </td>
                        {/* Người nhận */}
                        <td className="px-4 py-4">
                          <span
                            className="block max-w-[120px] truncate text-gray-300"
                            title={tx.toUser?.userName}
                          >
                            {tx.toUser?.userName ?? "—"}
                          </span>
                        </td>
                        {/* Giá */}
                        <td className="px-4 py-4">
                          <span className="whitespace-nowrap font-medium text-green-400">
                            {tx.price > 0 ? `${tx.price} ETH` : "—"}
                          </span>
                        </td>
                        {/* Phí GD */}
                        <td className="px-4 py-4 text-xs text-gray-400">
                          {tx.marketplaceFee > 0 ? `${tx.marketplaceFee} ETH` : "—"}
                        </td>
                        {/* Ngày */}
                        <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-400">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString("vi-VN")
                            : "—"}
                        </td>
                        {/* Trạng thái */}
                        <td className="px-4 py-4">
                          <span className={`inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${STATUS_COLORS[tx.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[tx.status] ?? tx.status ?? "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 border-t border-gray-800 p-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-[#1c1e2f] text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="rounded border border-purple-500/30 bg-purple-600/20 px-3 py-1 text-purple-400">
                {safePage}
              </span>
              <span>/ {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-[#1c1e2f] text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}