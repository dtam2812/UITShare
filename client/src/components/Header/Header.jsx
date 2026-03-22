import React, { useState } from "react";
import { HiOutlineShoppingCart, HiBell, HiUser } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { Link } from "react-router";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  return (
    <header className="my-5 w-full flex justify-center z-50">
      <div className="w-[90%] max-w-6xl bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center px-8 py-3 relative">
        {/*Logo*/}
        <Link to="/">
          <img
            src="/UIT-Share-Logo-2.svg"
            alt="logo"
            className="h-10 object-contain"
          />
        </Link>

        {/*Menu*/}
        {!searchOpen && (
          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-10 text-white font-medium">
            <a
              href="#"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              Tài liệu
            </a>
            <a
              href="#"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              Kho tài liệu
            </a>
            <a
              href="#"
              className="hover:text-purple-300 transition-colors duration-200"
            >
              Hỏi đáp
            </a>
          </nav>
        )}

        {/*Right side*/}
        <div
          className={`flex items-center gap-6 ml-auto ${searchOpen ? "flex-1" : ""}`}
        >
          <SearchBar open={searchOpen} setOpen={setSearchOpen} />

          {!searchOpen && (
            <>
              {!accessToken ? (
                <Link to="/login">
                  <button className="bg-linear-to-r cursor-pointer from-purple-600 to-indigo-600 px-6 py-2 rounded-full text-white transition hover:opacity-90">
                    Đăng nhập
                  </button>
                </Link>
              ) : (
                <>
                  <HiOutlineShoppingCart
                    size={24}
                    className="text-white hover:text-purple-300 transition cursor-pointer"
                  />
                  <HiUser
                    size={26}
                    className="text-white hover:text-purple-300 transition cursor-pointer"
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
