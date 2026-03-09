import React, { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const HeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // TODO: Sau này gọi API backend hoặc chuyển hướng trang tìm kiếm ở đây
    console.log('Searching for:', searchQuery);
    // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center bg-gray-700 rounded-full px-4 py-1.5 w-full">
      <input 
        type="text" 
        placeholder="What do you want to learn?" 
        className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none text-white" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="ml-3 bg-black hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
      >
        <HiOutlineSearch size={18} className="text-white" />
      </button>
    </form>
  );
};

export default HeaderSearch;