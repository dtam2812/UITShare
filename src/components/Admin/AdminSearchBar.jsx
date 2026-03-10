import React from "react";
import { Search } from "lucide-react";
export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder,
  filters,
}) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
      <div className="relative flex-1 bg-gray-50 rounded-md border border-gray-200">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filters}
    </div>
  );
}
