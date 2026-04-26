import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_API_URL;

async function searchDocumentsAPI(query) {
  const res = await fetch(
    `${BASE_URL}/api/documents/search?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export default function SearchBar({ open, setOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const formRef = useRef(null);
  const navigate = useNavigate();

  const updateDropdownPos = () => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        const data = await searchDocumentsAPI(searchQuery);
        setResults(data.slice(0, 5));
        updateDropdownPos();
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
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleResultClick = (id) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    setOpen(false);
    navigate(`/documentDetail/${id}`);
  };

  const dropdown = isDropdownOpen && open && searchQuery.trim() !== "" && (
    <div
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
      }}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl"
    >
      {isLoading ? (
        <div className="p-4 text-center text-sm text-gray-400">
          Đang tìm kiếm...
        </div>
      ) : results.length > 0 ? (
        <ul className="max-h-80 overflow-y-auto">
          {results.map((doc) => (
            <li
              key={doc._id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleResultClick(doc._id);
              }}
              className="flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-0 hover:bg-white/5"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-800">
                <img
                  src="public\default_thumbnail.png"
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h4 className="truncate text-sm font-medium text-white">
                  {doc.title}
                </h4>
                <p className="truncate text-xs text-gray-400">
                  {doc.subject} • {doc.author?.userName ?? doc.authorWallet}
                </p>
              </div>
            </li>
          ))}
          <li
            onMouseDown={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="cursor-pointer border-t border-white/10 px-4 py-3 text-center text-sm font-medium text-purple-400 hover:bg-white/5 hover:text-purple-300"
          >
            Xem tất cả kết quả cho "{searchQuery}"
          </li>
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-gray-400">
          Không tìm thấy kết quả nào.
        </div>
      )}
    </div>
  );

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSearch}
        className={`relative ml-4 flex origin-right items-center transition-all duration-300 ${open ? "w-full rounded-full bg-gray-700/50" : "w-10 justify-end"}`}
      >
        <input
          type="text"
          placeholder="Bạn muốn tìm kiếm tài liệu gì?"
          className={`bg-transparent text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${open ? "flex-1 px-4 py-2 opacity-100" : "w-0 border-none px-0 py-0 opacity-0"}`}
          autoFocus={open}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim() && results.length > 0) {
              updateDropdownPos();
              setIsDropdownOpen(true);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (open) {
              setOpen(false);
              setSearchQuery("");
              setIsDropdownOpen(false);
            } else {
              setOpen(true);
            }
          }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent transition duration-200 hover:bg-white/10 ${open ? "mr-1" : ""}`}
        >
          {open ? (
            <X size={18} className="text-gray-400 hover:text-white" />
          ) : (
            <Search size={20} className="text-white hover:text-purple-300" />
          )}
        </button>
      </form>

      {createPortal(dropdown, document.body)}
    </>
  );
}
