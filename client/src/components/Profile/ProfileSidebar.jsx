import {
  FiUser,
  FiFileText,
  FiCreditCard,
  FiClock,
  FiStar,
  FiLogOut,
  FiGift,
} from "react-icons/fi";
import { NavLink, useNavigate, useParams } from "react-router";

const ProfileSidebar = ({ avatar, userName, email }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 font-medium transition-all rounded-r-xl border-l-4 
    ${isActive ? "bg-purple-500/10 text-purple-400 border-purple-400" : "text-gray-400 hover:bg-white/5 hover:text-white border-transparent"}`;

  const navigate = useNavigate();
  const { userId } = useParams();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col bg-white/5 px-4 py-6 backdrop-blur-md">
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
        <img
          src={avatar}
          alt="Avatar"
          className="h-12 w-12 rounded-full border border-white/20 object-cover"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold text-white">
            {userName}
          </span>
          <span className="truncate text-xs text-gray-400">{email}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <p className="mt-2 mb-4 flex justify-center px-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
          Quản lý tài khoản
        </p>

        <NavLink to={`/profile/${userId}`} end className={navLinkClass}>
          <FiUser className="h-5 w-5" />
          Thông tin cá nhân
        </NavLink>

        <NavLink
          to={`/profile/${userId}/uploadedDocs`}
          className={navLinkClass}
        >
          <FiFileText className="h-5 w-5" />
          Tài liệu đã tải lên
        </NavLink>

        <NavLink to={`/profile/${userId}/purchased`} className={navLinkClass}>
          <FiFileText className="h-5 w-5" />
          Tài liệu đã mua
        </NavLink>

        <NavLink to={`/profile/${userId}/financials`} className={navLinkClass}>
          <FiCreditCard className="h-5 w-5" />
          Tài chính & Ví NFT
        </NavLink>

        <NavLink
          to={`/profile//${userId}/purchase-history`}
          className={navLinkClass}
        >
          <FiClock className="h-5 w-5" />
          Lịch sử giao dịch
        </NavLink>

        <NavLink
          to={`/profile//${userId}/reviewsManagement`}
          className={navLinkClass}
        >
          <FiStar className="h-5 w-5" />
          Đánh giá nhận được
        </NavLink>

        <NavLink
          to={`/profile//${userId}/donationsReceived`}
          className={navLinkClass}
        >
          <FiGift className="h-5 w-5" />
          Donate nhận được
        </NavLink>
      </nav>

      <div className="mt-4 border-t border-white/10 pt-6">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-4 py-2.5 font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <FiLogOut className="h-5 w-5 text-red-400" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
