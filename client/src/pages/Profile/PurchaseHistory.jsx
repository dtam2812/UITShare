// PurchaseHistory.jsx
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiCopy,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import StatusBadge from "../../components/UI/StatusBadge";
import { useState, useEffect, useCallback } from "react";
import axios from "../../common";

const PurchaseHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropDown, setDropDown] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search 400ms để tránh gọi API liên tục
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset về trang 1 khi search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/transactions/history", {
        params: {
          page: currentPage,
          limit: 5,
          sort: dropDown,
          search: debouncedSearch,
        },
      });
      setTransactions(data.transactions);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, dropDown, debouncedSearch]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOnChange = (e) => {
    setDropDown(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleCopy = (txHash) => {
    navigator.clipboard.writeText(txHash);
    setCopiedId(txHash);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <h1 className="text-xl font-bold text-white">Lịch sử giao dịch</h1>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-white/10 bg-white/5 p-2.5 pl-10 text-sm text-white transition-all outline-none placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
                placeholder="Tìm kiếm mã GD, tên tài liệu, loại..."
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="block w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 py-2.5 pr-10 pl-3 text-sm text-white outline-none focus:border-purple-400 focus:ring-purple-400/20"
                onChange={handleOnChange}
                value={dropDown}
              >
                <option value="latest" className="bg-[#050816] text-white">
                  Mới nhất
                </option>
                <option value="oldest" className="bg-[#050816] text-white">
                  Cũ nhất
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/10 text-xs tracking-wider text-gray-400 uppercase">
                <th className="px-4 py-4 font-medium">Mã GD (TxHash)</th>
                <th className="px-4 py-4 font-medium">Loại</th>
                <th className="px-4 py-4 font-medium">Chi tiết</th>
                <th className="px-4 py-4 font-medium">Ngày</th>
                <th className="px-4 py-4 font-medium">Số lượng</th>
                <th className="px-4 py-4 text-center font-medium">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <FiLoader className="h-8 w-8 animate-spin text-purple-400" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-red-400">
                      <p>{error}</p>
                      <button
                        onClick={fetchTransactions}
                        className="mt-1 rounded-lg border border-red-400/30 px-4 py-1.5 text-sm hover:bg-red-400/10"
                      >
                        Thử lại
                      </button>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiSearch className="h-8 w-8 text-gray-500" />
                      <p>Không tìm thấy giao dịch nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.txHash}
                    className="group border-b border-white/10 transition-colors hover:bg-white/5"
                  >
                    <td className="flex items-center gap-2 px-4 py-5">
                      <span className="font-medium text-gray-300">
                        {/* Hiển thị rút gọn txHash */}
                        {tx.txHash
                          ? `${tx.txHash.slice(0, 6)}...${tx.txHash.slice(-4)}`
                          : "—"}
                      </span>
                      {tx.txHash && (
                        <button
                          onClick={() => handleCopy(tx.txHash)}
                          className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-all hover:bg-purple-500/10 hover:text-purple-400"
                          title="Copy TxHash"
                        >
                          {copiedId === tx.txHash ? (
                            <FiCheck className="h-4 w-4 text-green-400" />
                          ) : (
                            <FiCopy className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-5 font-medium text-white">
                      {tx.type || "—"}
                    </td>
                    <td className="px-4 py-5 text-gray-400">
                      {tx.detail || "—"}
                    </td>
                    <td className="px-4 py-5 text-gray-400">{tx.date}</td>
                    <td className="px-4 py-5 font-medium text-white">
                      {tx.amount}
                    </td>
                    <td className="px-4 py-5 text-center">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-8 flex items-center justify-center border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-gray-600"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-gray-600"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
