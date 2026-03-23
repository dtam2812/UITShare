import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({title, count, columns, data, emptyMessage = "No data found."}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return <div className="bg-[#131722] rounded-lg shadow-sm overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <h3 className="text-white font-medium">{title} <span className="text-gray-400 font-normal">({count})</span></h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col, idx) => <th key={idx} className={`py-4 px-6 text-sm font-semibold text-gray-300 ${col.className || ''}`}>
                {col.header}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-gray-800 hover:bg-[#1c1e2f] transition-colors">
              {columns.map((col, colIndex) => <td key={colIndex} className={`py-4 px-6 text-sm text-gray-400 ${col.className || ''}`}>
                  {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                </td>)}
            </tr>)}
          {paginatedData.length === 0 && <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-500">{emptyMessage}</td>
            </tr>}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 p-4 border-t border-gray-800">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full bg-[#1c1e2f] text-gray-300 flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-[#1c1e2f] transition-colors border border-gray-700">
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <span className="bg-purple-600/20 px-3 py-1 rounded text-purple-400 border border-purple-500/30">{currentPage}</span>
          <span>/ {totalPages}</span>
        </div>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full bg-[#1c1e2f] text-gray-300 flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-[#1c1e2f] transition-colors border border-gray-700">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>;
}