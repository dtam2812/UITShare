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

  const [profileInfo, setProfileInfo] = useState(() => {
    const token = localStorage.getItem("access_token");
    return jwtDecode(token);
  });

  useEffect(() => {
    const handleTokenUpdate = () => {
      const token = localStorage.getItem("access_token");
      if (token) setProfileInfo(jwtDecode(token));
    };
    window.addEventListener("token-updated", handleTokenUpdate);
    return () => window.removeEventListener("token-updated", handleTokenUpdate);
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = payloadDecode?.id;
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
  }, [payloadDecode?.id, queryClient]);

  useEffect(() => {
    if (openSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; 
    };
  }, [openSidebar]);

  const handleClick = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#050816] font-sans text-white">
      <div
        onClick={handleClick}
        className={`fixed inset-0 z-40 bg-[#050816]/80 backdrop-blur-sm transition-opacity md:hidden ${openSidebar ? "" : "hidden"}`}
      />

      <div className="mx-auto flex max-w-7xl min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform border-r border-white/10 bg-[#050816] shadow-xl transition-transform duration-300 ease-in-out
            md:relative md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none
            ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <ProfileSidebar
            avatar={profileInfo.avatar}
            userName={profileInfo.userName}
            email={profileInfo.email}
            onClose={() => setOpenSidebar(false)} 
          />
        </aside>

        <main className={`flex h-screen w-full flex-1 flex-col ${openSidebar ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="md:hidden px-6 pt-4">
            <button
              onClick={handleClick}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              <FiMenu className="h-4 w-4" />
              Menu tài khoản
            </button>
          </div>

          <div className="w-full flex-1 p-6 md:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
