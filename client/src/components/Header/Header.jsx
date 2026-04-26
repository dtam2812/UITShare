import React, { useState, useEffect } from "react";
import { HiOutlineShoppingCart, HiUser, HiX, HiMenu } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { jwtDecode } from "jwt-decode";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Tài liệu", href: "/document" },
  { label: "Hỏi đáp", href: "faq" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token"),
  );
  let decodePayload = null;

  const [cartHovered, setCartHovered] = useState(false);
  const [userHovered, setUserHovered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  const { reloadCartForCurrentUser } = useCart();

  const navigate = useNavigate();

  let userId = null;

  if (accessToken && accessToken !== "undefined") {
    try {
      decodePayload = jwtDecode(accessToken);
      userId = decodePayload?._id;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }, 1000);

    return () => clearInterval(interval);
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
      <header className="relative z-50 my-5 flex w-full justify-center">
        <div className="relative flex w-[90%] max-w-6xl items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md lg:px-8">
          {/* Logo */}
          <Link to="/" onClick={() => setDrawerOpen(false)}>
            <img
              src="/UIT-Share-Logo-2.svg"
              alt="logo"
              className="h-8 object-contain lg:h-10"
            />
          </Link>

          {/* Menu - chỉ hiện trên desktop */}
          {!searchOpen && (
            <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 font-medium text-white lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-purple-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div
            className={`ml-auto flex items-center gap-3 lg:gap-6 ${searchOpen ? "flex-1" : ""}`}
          >
            <SearchBar open={searchOpen} setOpen={setSearchOpen} />

            {!searchOpen && (
              <>
                {/* Desktop: đăng ký / cart / user */}
                <div className="hidden items-center gap-6 lg:flex">
                  {accessToken ? (
                    <>
                      {/* Cart với dropdown */}
                      <div
                        className="relative"
                        onMouseEnter={() => setCartHovered(true)}
                        onMouseLeave={() => setCartHovered(false)}
                      >
                        <div className="relative cursor-pointer">
                          <Link to="/cart">
                            <HiOutlineShoppingCart
                              size={24}
                              className="text-white transition hover:text-purple-300"
                            />
                          </Link>
                          {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                              {cartItems.length}
                            </span>
                          )}
                        </div>

                        {cartHovered && (
                          <div className="absolute top-6 right-0 z-50 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]/95 shadow-xl backdrop-blur-md">
                            <div className="border-b border-white/10 px-4 py-3">
                              <p className="text-sm font-semibold text-white">
                                Giỏ hàng ({cartItems.length})
                              </p>
                            </div>
                            {cartItems.length === 0 ? (
                              <div className="px-4 py-6 text-center text-sm text-gray-500">
                                Giỏ hàng trống
                              </div>
                            ) : (
                              <>
                                <ul className="max-h-64 divide-y divide-white/5 overflow-y-auto">
                                  {cartItems.map((item) => (
                                    <li
                                      key={item.id}
                                      className="flex items-start gap-3 px-4 py-3 transition hover:bg-white/5"
                                    >
                                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                                        <HiOutlineShoppingCart className="h-4 w-4 text-purple-400" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-xs leading-snug font-medium text-white">
                                          {item.title}
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-purple-400">
                                          {item.price > 0
                                            ? `${item.price} ETH`
                                            : "Free"}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="mt-0.5 shrink-0 text-gray-600 transition hover:text-red-400"
                                      >
                                        <HiX size={14} />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                                <div className="border-t border-white/10 px-4 py-3">
                                  <Link to="/cart">
                                    <button className="w-full cursor-pointer rounded-lg bg-purple-500 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600">
                                      Thanh toán
                                    </button>
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div
                        className="relative"
                        onMouseEnter={() => setUserHovered(true)}
                        onMouseLeave={() => setUserHovered(false)}
                      >
                        <HiUser
                          size={26}
                          className="cursor-pointer text-white transition hover:text-purple-300"
                        />

                        {userHovered && (
                          <div className="absolute top-full right-0 z-50 w-40 rounded-xl border border-white/10 bg-[#1a1a2e]/95 shadow-xl backdrop-blur-md">
                            <ul className="py-2 text-sm text-white">
                              <li>
                                <Link
                                  to={`/profile/${userId}`}
                                  className="block cursor-pointer px-4 py-2 transition hover:bg-white/5"
                                >
                                  Trang cá nhân
                                </Link>
                              </li>

                              {decodePayload.role === "admin" ? (
                                <li>
                                  <Link to="/admin">
                                    <button className="w-full cursor-pointer px-4 py-2 text-left transition hover:bg-white/5 hover:text-red-400">
                                      Quản lý
                                    </button>
                                  </Link>
                                </li>
                              ) : (
                                <div></div>
                              )}

                              <li>
                                <button
                                  onClick={() => {
                                    localStorage.removeItem("access_token");
                                    navigate("/login");
                                    reloadCartForCurrentUser();
                                  }}
                                  className="w-full cursor-pointer px-4 py-2 text-left transition hover:bg-white/5 hover:text-red-400"
                                >
                                  Đăng xuất
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <Link to="/login">
                      <button className="cursor-pointer rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-2 text-white transition hover:opacity-90">
                        Đăng nhập
                      </button>
                    </Link>
                  )}
                </div>

                {/* Mobile/Tablet: cart + hamburger */}
                <div className="flex items-center gap-3 lg:hidden">
                  {accessToken && (
                    <div className="relative cursor-pointer">
                      <HiOutlineShoppingCart
                        size={22}
                        className="text-white"
                        onClick={() => setDrawerOpen(true)}
                      />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="p-1 text-white"
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col border-l border-white/10 bg-[#0f0f1a] transition-transform duration-300 ease-in-out lg:hidden ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <img
            src="/UIT-Share-Logo-2.svg"
            alt="logo"
            className="h-8 object-contain"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-gray-400 transition hover:text-white"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 border-b border-white/10 px-5 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg px-3 py-2.5 font-medium text-white transition-colors hover:bg-white/5 hover:text-purple-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Cart section (chỉ khi đã login) */}
        {accessToken && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="border-b border-white/10 px-5 py-3">
              <p className="text-sm font-semibold text-white">
                Giỏ hàng ({cartItems.length})
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-500">
                Giỏ hàng trống
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/5 overflow-y-auto">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 px-5 py-3 transition hover:bg-white/5"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                        <HiOutlineShoppingCart className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs leading-snug font-medium text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs font-bold text-purple-400">
                          {item.price > 0 ? `${item.price} ETH` : "Free"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="mt-0.5 shrink-0 text-gray-600 transition hover:text-red-400"
                      >
                        <HiX size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/10 px-5 py-3">
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full rounded-lg bg-purple-500 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
                  >
                    Thanh toán
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Auth buttons */}
        <div className="mt-auto border-t border-white/10 px-5 py-4">
          {!accessToken ? (
            <button
              onClick={() => {
                setDrawerOpen(false);
              }}
              className="w-full rounded-full bg-linear-to-r from-purple-600 to-indigo-600 py-2.5 font-medium text-white transition hover:opacity-90"
            >
              Đăng nhập
            </button>
          ) : (
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white transition hover:bg-white/5">
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
