import React from 'react';
import { Search } from 'lucide-react';

export default function AdminSearchBar({ searchTerm, setSearchTerm, placeholder, filters }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 bg-[#131722] p-4 rounded-lg shadow-sm border border-gray-800 gap-4">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-800 bg-[#1c1e2f] text-white rounded-md outline-none focus:border-purple-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex space-x-3 w-full md:w-auto shrink-0">
        {filters}
      </div>
    </div>
  );
}
