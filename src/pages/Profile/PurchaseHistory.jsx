import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronDown, FiCopy, FiCheck } from "react-icons/fi";
import StatusBadge from "../../components/UI/StatusBadge";
import { useState } from "react";

const baseHistory = [
  { id: '0x1a2b...3c4d', type: 'Bán tài liệu', detail: 'Giải tích 1 - Đề thi 2024', date: '17/10/2026', amount: '+ 50 ETH', status: 'Thành công' },
  { id: '0x5e6f...7g8h', type: 'Rút ETH', detail: 'Rút về ví MetaMask', date: '01/02/2026', amount: '- 200 ETH', status: 'Đang xử lý' },
  { id: '0x9i0j...1k2l', type: 'Mua tài liệu', detail: 'Tài liệu ôn tập OOP', date: '21/09/2026', amount: '- 30 ETH', status: 'Thành công' },
  { id: '0x3m4n...5o6p', type: 'Nạp ETH', detail: 'Nạp từ ví MetaMask', date: '08/09/2026', amount: '+ 500 ETH', status: 'Thất bại' },
  { id: '0x7q8r...9s0t', type: 'Bán tài liệu', detail: 'Đại số tuyến tính căn bản', date: '15/02/2026', amount: '+ 120 ETH', status: 'Thành công' },
];

const mockHistory = Array.from({ length: 24 }, (_, i) => ({
  ...baseHistory[i % 5],
  id: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
}));

const PurchaseHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dropDown, setDropDown] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleOnChange = (e) => setDropDown(e.target.value);

  const handleSearch = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); 
  };
  
  const lowerSearchTerm = searchTerm.toLowerCase();

  const filterData = mockHistory.filter(item => 
    item.id.toLowerCase().includes(lowerSearchTerm) ||
    item.detail.toLowerCase().includes(lowerSearchTerm) ||
    item.type.toLowerCase().includes(lowerSearchTerm)
  );
  
  const sortedData = dropDown === 'latest' ? filterData : [...filterData].reverse();
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);
  
  return (
    <div className="w-full min-h-screen bg-transparent p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-sm backdrop-blur-md p-6 md:p-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">Lịch sử giao dịch</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm rounded-lg focus:ring-purple-400/20 focus:border-purple-400 block w-full pl-10 p-2.5 outline-none transition-all" 
                placeholder="Tìm kiếm mã GD, tên tài liệu, loại..." 
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-purple-400/20 focus:border-purple-400 block w-full pr-10 pl-3 py-2.5 outline-none cursor-pointer"
                onChange={handleOnChange}
                value={dropDown}
              >
                <option value="latest" className="bg-[#050816] text-white">Mới nhất</option>
                <option value="oldest" className="bg-[#050816] text-white">Cũ nhất</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="px-4 py-4 font-medium">Mã GD (TxHash)</th>
                <th className="px-4 py-4 font-medium">Loại</th>
                <th className="px-4 py-4 font-medium">Chi tiết</th>
                <th className="px-4 py-4 font-medium">Ngày</th>
                <th className="px-4 py-4 font-medium">Số lượng</th>
                <th className="px-4 py-4 font-medium text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiSearch className="w-8 h-8 text-gray-500" />
                      <p>Không tìm thấy giao dịch nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/10 hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-5 flex items-center gap-2">
                      <span className="text-gray-300 font-medium">{tx.id}</span>
                      <button 
                        onClick={() => handleCopy(tx.id)}
                        className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-md transition-all cursor-pointer"
                        title="Copy TxHash"
                      >
                        {copiedId === tx.id ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-5 text-white font-medium">{tx.type}</td>
                    <td className="px-4 py-5 text-gray-400">{tx.detail}</td>
                    <td className="px-4 py-5 text-gray-400">{tx.date}</td>
                    <td className="px-4 py-5 font-medium text-white">{tx.amount}</td>
                    <td className="px-4 py-5 text-center">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center justify-center mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              
              <button 
                className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <FiChevronLeft className="w-5 h-5" /> 
              </button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-transparent text-gray-400 border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <FiChevronRight className="w-5 h-5" /> 
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PurchaseHistory;