import React, { useState, useEffect } from "react";
import { HiOutlineShoppingCart, HiUser, HiX, HiMenu } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Tài liệu", href: "/document" },
  { label: "Hỏi đáp", href: "faq" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const [cartHovered, setCartHovered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  // Đóng drawer khi resize lên desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Khóa scroll khi drawer mở
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="my-5 w-full flex justify-center z-50 relative">
        <div className="w-[90%] max-w-6xl bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center px-5 lg:px-8 py-3 relative">
          {/* Logo */}
          <Link to="/" onClick={() => setDrawerOpen(false)}>
            <img
              src="/UIT-Share-Logo-2.svg"
              alt="logo"
              className="h-8 lg:h-10 object-contain"
            />
          </Link>

          {/* Menu - chỉ hiện trên desktop */}
          {!searchOpen && (
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-10 text-white font-medium">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-purple-300 transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div
            className={`flex items-center gap-3 lg:gap-6 ml-auto ${searchOpen ? "flex-1" : ""}`}
          >
            <SearchBar open={searchOpen} setOpen={setSearchOpen} />

            {!searchOpen && (
              <>
                {/* Desktop: đăng ký / cart / user */}
                <div className="hidden lg:flex items-center gap-6">
                  {!accessToken ? (
                    <Link to="/login">
                      <button className="bg-linear-to-r cursor-pointer from-purple-600 to-indigo-600 px-6 py-2 rounded-full text-white transition hover:opacity-90">
                        Đăng nhập
                      </button>
                    </Link>
                  ) : (
                    <>
                      {/* Cart với dropdown */}
                      <div
                        className="relative"
                        onMouseEnter={() => setCartHovered(true)}
                        onMouseLeave={() => setCartHovered(false)}
                      >
                        <div className="relative cursor-pointer">
                          <HiOutlineShoppingCart
                            size={24}
                            className="text-white hover:text-purple-300 transition"
                          />
                          {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                              {cartItems.length}
                            </span>
                          )}
                        </div>

                        {cartHovered && (
                          <div className="absolute right-0 top-8 w-72 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10">
                              <p className="text-white text-sm font-semibold">
                                Giỏ hàng ({cartItems.length})
                              </p>
                            </div>
                            {cartItems.length === 0 ? (
                              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                Giỏ hàng trống
                              </div>
                            ) : (
                              <>
                                <ul className="max-h-64 overflow-y-auto divide-y divide-white/5">
                                  {cartItems.map((item) => (
                                    <li
                                      key={item.id}
                                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition"
                                    >
                                      <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <HiOutlineShoppingCart className="text-purple-400 w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                                          {item.title}
                                        </p>
                                        <p className="text-purple-400 text-xs font-bold mt-1">
                                          {item.nft.price} {item.nft.currency}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-600 hover:text-red-400 transition mt-0.5 shrink-0"
                                      >
                                        <HiX size={14} />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                                <div className="px-4 py-3 border-t border-white/10">
                                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                                    Thanh toán
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <HiUser
                        size={26}
                        className="text-white hover:text-purple-300 transition cursor-pointer"
                      />
                    </>
                  )}
                </div>

                {/* Mobile/Tablet: cart + hamburger */}
                <div className="flex lg:hidden items-center gap-3">
                  {accessToken && (
                    <div className="relative cursor-pointer">
                      <HiOutlineShoppingCart
                        size={22}
                        className="text-white"
                        onClick={() => setDrawerOpen(true)}
                      />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="text-white p-1"
                  >
                    <HiMenu size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0f0f1a] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <img
            src="/UIT-Share-Logo-2.svg"
            alt="logo"
            className="h-8 object-contain"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-5 py-4 gap-1 border-b border-white/10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="text-white font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 hover:text-purple-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Cart section (chỉ khi đã login) */}
        {accessToken && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10">
              <p className="text-white text-sm font-semibold">
                Giỏ hàng ({cartItems.length})
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="px-5 py-6 text-center text-gray-500 text-sm">
                Giỏ hàng trống
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <HiOutlineShoppingCart className="text-purple-400 w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-purple-400 text-xs font-bold mt-1">
                          {item.nft.price} {item.nft.currency}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-400 transition mt-0.5 shrink-0"
                      >
                        <HiX size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-5 py-3 border-t border-white/10">
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                    Thanh toán
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Auth buttons */}
        <div className="px-5 py-4 border-t border-white/10 mt-auto">
          {!accessToken ? (
            <button
              onClick={() => {
                setDrawerOpen(false);
              }}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 py-2.5 rounded-full text-white font-medium transition hover:opacity-90"
            >
              Đăng nhập
            </button>
          ) : (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-white">
              <HiUser size={20} />
              <span className="text-sm font-medium">Trang cá nhân</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
