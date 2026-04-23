import { Outlet } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import axios from "../../common";

const ProfileLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const accessToken = localStorage.getItem("access_token");
  const payloadDecode = jwtDecode(accessToken);

  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = payloadDecode.id;
    if (!userId) return;

    queryClient.prefetchQuery({
      queryKey: ["walletInfo", userId],
      queryFn: async () => {
        const { data } = await axios.get(`/api/wallet/walletInfo/${userId}`);
        if (data.connected) {
          return {
            balance: data.balance,
            nftCount: data.nftCount,
            nfts: data.nfts,
            transactions: data.transactions,
            walletAddress: data.walletAddress,
          };
        }
        return {
          balance: "0",
          nftCount: 0,
          nfts: [],
          transactions: [],
          walletAddress: null,
        };
      },
      staleTime: 5 * 60 * 1000,
    });
  }, []);

  const handleClick = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#050816] font-sans text-white">
      <button
        onClick={handleClick}
        className={`fixed top-4 right-4 z-50 rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 shadow-md backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white focus:outline-none md:hidden`}
      >
        {openSidebar ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      <div
        onClick={handleClick}
        className={`fixed inset-0 z-40 bg-[#050816]/80 backdrop-blur-sm transition-opacity md:hidden ${openSidebar ? "" : "hidden"}`}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform border-r border-white/10 bg-[#050816] shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ProfileSidebar
          avatar={payloadDecode.avatar}
          userName={payloadDecode.userName}
          email={payloadDecode.email}
        />
      </aside>

      <main className="flex h-screen w-full flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl flex-1 p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;
