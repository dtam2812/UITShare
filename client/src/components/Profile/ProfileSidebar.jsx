import {
  FiUser,
  FiFileText,
  FiCreditCard,
  FiClock,
  FiStar,
  FiLogOut,
  FiGift,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";

const ProfileSidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 font-medium transition-all rounded-r-xl border-l-4 
    ${isActive ? "bg-purple-500/10 text-purple-400 border-purple-400" : "text-gray-400 hover:bg-white/5 hover:text-white border-transparent"}`;

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-md px-4 py-6">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9PgSNNHXLS4qXp-bYah7sjA6a89rLXdrBURyNVEYnVg&s"
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover border border-white/20"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-white truncate">
            Trần Thành Vinh
          </span>
          <span className="text-xs text-gray-400 truncate">
            tranthanhvinh@gmail.com
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 mt-2 flex justify-center">
          Quản lý tài khoản
        </p>

        <NavLink to="/profile" end className={navLinkClass}>
          <FiUser className="w-5 h-5" />
          Thông tin cá nhân
        </NavLink>

        <NavLink to="/profile/uploaded-docs" className={navLinkClass}>
          <FiFileText className="w-5 h-5" />
          Tài liệu đã tải lên
        </NavLink>

        <NavLink to="/profile/financials" className={navLinkClass}>
          <FiCreditCard className="w-5 h-5" />
          Tài chính & Ví NFT
        </NavLink>

        <NavLink to="/profile/purchase-history" className={navLinkClass}>
          <FiClock className="w-5 h-5" />
          Lịch sử giao dịch
        </NavLink>

        <NavLink to="/profile/reviews-management" className={navLinkClass}>
          <FiStar className="w-5 h-5" />
          Đánh giá nhận được
        </NavLink>

        <NavLink to="/profile/donated-received" className={navLinkClass}>
          <FiGift className="w-5 h-5" />
          Donate nhận được
        </NavLink>
      </nav>

      <div className="pt-6 mt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex justify-center items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <FiLogOut className="w-5 h-5 text-red-400" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
