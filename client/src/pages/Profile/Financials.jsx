import { useState, useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BalanceCard from "../../components/Profile/BalanceCard";
import FinanceStatCard from "../../components/Profile/FinanceStatCard";
import TransactionTable from "../../components/Profile/TransactionTable";
import WalletCard from "../../components/Profile/WalletCard";
import { useParams } from "react-router";
import axios from "../../common";
import { FiCreditCard, FiAlertTriangle, FiX } from "react-icons/fi";

const DEFAULT_WALLET_INFO = {
  balance: "0",
  nftCount: 0,
  nfts: [],
  transactions: [],
  walletAddress: null,
};

const Financials = () => {
  const { userId } = useParams();
  const { mutate: connect } = useConnect();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const [walletError, setWalletError] = useState(null);
  const [isLinking, setIsLinking] = useState(false);

  const {
    data: walletInfo = DEFAULT_WALLET_INFO,
    isLoading: isLoadingWallet,
    refetch,
  } = useQuery({
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
      return DEFAULT_WALLET_INFO;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!userId,
  });

  const isWalletLinked = !!walletInfo.walletAddress;
  const shortAddress = walletInfo.walletAddress
    ? `${walletInfo.walletAddress.slice(0, 6)}...${walletInfo.walletAddress.slice(-4)}`
    : "Chưa kết nối";

  useEffect(() => {
    if (!address || !isLinking) return;

    const linkWallet = async () => {
      try {
        await axios.put(`/api/wallet/updateWallet/${userId}`, {
          walletAddress: address,
        });
        await new Promise((r) => setTimeout(r, 1500));
        await queryClient.invalidateQueries({
          queryKey: ["walletInfo", userId],
        });
      } catch (error) {
        setWalletError(
          error.response?.data?.message ||
            "Không thể liên kết ví. Vui lòng thử lại.",
        );
      } finally {
        setIsLinking(false);
      }
    };

    linkWallet();
  }, [address, isLinking, userId, queryClient]);

  const handleConnect = () => {
    setIsLinking(true);
    connect({ connector: injected() });
  };

  const ETH_TO_VND = 100_000_000;
  const estimatedVnd = (
    parseFloat(walletInfo.balance || "0") * ETH_TO_VND
  ).toLocaleString("vi-VN");

  return (
    <div className="mx-auto w-full max-w-6xl p-2">
      <div className="mb-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tài chính & Ví NFT</h1>
          <p className="mt-1 text-sm text-gray-400">
            Quản lý số dư ETH và tài sản NFT của bạn trên UITShare.
          </p>
        </div>
        {!isWalletLinked && (
          <button
            onClick={handleConnect}
            disabled={isLinking}
            className="cursor-pointer rounded-2xl bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            {isLinking ? "Đang kết nối..." : "Kết nối ví MetaMask"}
          </button>
        )}
      </div>

      {walletError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {walletError}
          <button
            className="ml-3 underline hover:text-red-300"
            onClick={() => refetch()}
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BalanceCard
          balance={
            !isWalletLinked || isLoadingWallet ? "—" : walletInfo.balance
          }
          onViewExplorer={() =>
            window.open(
              `https://sepolia.etherscan.io/address/${walletInfo.walletAddress}`,
              "_blank",
            )
          }
        />
        <FinanceStatCard
          title="Giá trị ước tính"
          value={!isWalletLinked || isLoadingWallet ? "—" : `${estimatedVnd}đ`}
          tagText="VNĐ"
          tagStyle="text-gray-300 bg-white/10 border border-white/10"
          subElement={
            <p className="text-xs text-gray-400">
              Tỉ giá: 1 ETH = ~100,000,000đ
            </p>
          }
        />
      </div>

      <h3 className="mb-4 text-lg font-bold text-white">Ví liên kết</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <WalletCard isConnected={isWalletLinked} address={shortAddress} />
      </div>
    </div>
  );
};

export default Financials;
