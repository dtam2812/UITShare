import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { searchDocuments } from '../../api/api_test';

export default function SearchBar({ open, setOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchDocuments(searchQuery);
        setResults(data.slice(0, 5)); // Show top 5 results in dropdown
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleResultClick = (id) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setOpen(false);
    navigate(`/document/${id}`);
  };

  return (
    <form 
      ref={dropdownRef}
      onSubmit={handleSearch} 
      className={`relative flex items-center transition-all duration-300 ${open ? 'w-full bg-gray-700/50 rounded-full' : 'w-10 justify-end'}`}
    >
      <input 
        type="text" 
        placeholder="What do you want to learn?" 
        className={`bg-transparent text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${open ? "flex-1 px-4 py-2 opacity-100" : "w-0 px-0 py-0 opacity-0 border-none"}`}
        autoFocus={open}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          if (searchQuery.trim() && results.length > 0) {
            setIsDropdownOpen(true);
          }
        }}
      />
      <button 
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            setSearchQuery('');
          } else {
            setOpen(true);
          }
        }} 
        className={`bg-transparent hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition duration-200 shrink-0 ${open ? 'mr-1' : ''}`}
      >
        {open ? (
          <X size={18} className="text-gray-400 hover:text-white" />
        ) : (
          <Search size={20} className="text-white hover:text-purple-300" />
        )}
      </button>

      {/* Dropdown Results */}
      {isDropdownOpen && open && (searchQuery.trim() !== '') && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Đang tìm kiếm...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto custom-scrollbar">
              {results.map((doc) => (
                <li 
                  key={doc.id}
                  onClick={() => handleResultClick(doc.id)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded bg-gray-800 shrink-0 overflow-hidden">
                    <img src={doc.thumbnail || `https://picsum.photos/seed/doc${doc.id}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-sm font-medium text-white truncate">{doc.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{doc.subjectName} • {doc.author}</p>
                  </div>
                </li>
              ))}
              <li 
                onClick={handleSearch}
                className="px-4 py-3 text-center text-sm text-purple-400 hover:text-purple-300 hover:bg-white/5 cursor-pointer font-medium border-t border-white/10"
              >
                Xem tất cả kết quả cho "{searchQuery}"
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">Không tìm thấy kết quả nào.</div>
          )}
        </div>
      )}
    </form>
  );
}
