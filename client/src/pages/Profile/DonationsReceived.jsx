import { Link } from "react-router";
import UploadedDocsStatCard from "../../components/Profile/UploadedDocsStatCard";
import { FiGift, FiTrendingUp, FiAward } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "../../common";

const DonationsReceived = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalETH: 0, maxETH: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("/api/marketplace/donate/received");
        setDonations(res.data.donations);
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  return (
    <div className="mx-auto w-full max-w-6xl p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Donate nhận được</h1>
        <p className="mt-1 text-sm text-gray-400">
          Quản lý và theo dõi các khoản đóng góp ETH từ cộng đồng cho tài liệu
          của bạn.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <UploadedDocsStatCard
          title="Tổng lượt Donate"
          value={String(stats.total)}
          icon={<FiGift className="h-6 w-6" />}
          bgColor="bg-purple-500/10"
          textColor="text-purple-400"
        />
        <UploadedDocsStatCard
          title="Tổng ETH nhận được"
          value={
            <>
              {stats.totalETH}{" "}
              <span className="text-sm font-normal text-gray-400">ETH</span>
            </>
          }
          icon={<FiTrendingUp className="h-6 w-6" />}
          bgColor="bg-green-500/10"
          textColor="text-green-400"
        />
        <UploadedDocsStatCard
          title="Donate cao nhất"
          value={
            <>
              {stats.maxETH}{" "}
              <span className="text-sm font-normal text-gray-400">ETH</span>
            </>
          }
          icon={<FiAward className="h-6 w-6" />}
          bgColor="bg-yellow-500/10"
          textColor="text-yellow-400"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
        <h3 className="mb-6 text-lg font-bold text-white">
          Lịch sử nhận Donate
        </h3>

        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">Đang tải...</p>
        ) : donations.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Chưa có donate nào
          </p>
        ) : (
          <div className="space-y-6">
            {donations.map((donate) => {
              const displayName =
                donate.fromUser?.userName ?? shortenAddress(donate.fromAddress);
              const avatarName = donate.fromUser?.userName?.[0] ?? "A";
              const avatarUrl =
                donate.fromUser?.avatar ??
                `https://ui-avatars.com/api/?name=${avatarName}&background=random`;
              const date = new Date(donate.createdAt).toLocaleDateString(
                "vi-VN",
              );

              return (
                <div
                  key={donate._id}
                  className="border-b border-white/10 pb-6 last:border-0 last:pb-0"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="h-10 w-10 rounded-full bg-white/10"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {displayName}
                        </p>
                        <p className="font-mono text-xs text-gray-400">
                          {shortenAddress(donate.fromAddress)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="mb-0.5 text-lg font-bold text-green-400">
                        + {donate.price} ETH
                      </p>
                      <p className="text-xs text-gray-400">{date}</p>
                    </div>
                  </div>

                  {donate.donateMessage && (
                    <div className="mt-2 rounded-xl border border-white/10 bg-purple-500/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-300 italic">
                        "{donate.donateMessage}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsReceived;
