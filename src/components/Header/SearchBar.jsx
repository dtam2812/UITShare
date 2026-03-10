import React from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";

const SearchBar = ({ open, setOpen }) => {
  return (
    <div className={`flex items-center transition-all duration-300 ${open ? "flex-1 ml-6" : ""}`}>

      {/*Input*/}
      <input
        type="text"
        placeholder="What do you want to learn?"
        className={`bg-gray-700 text-white placeholder-gray-400 rounded-full transition-all duration-300 focus:outline-none
        ${open ? "flex-1 px-4 py-2 opacity-100 mr-2" : "w-0 px-0 py-0 opacity-0"}`}
      />

      {/*Button*/}
      <button
        onClick={() => setOpen(!open)}
        className="bg-transparent hover:bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center transition duration-200"
      >
        {open ? (
          <HiX size={18} className="text-white" />
        ) : (
          <HiOutlineSearch size={18} className="text-white" />
        )}
      </button>

    </div>
  );
};

export default SearchBar;