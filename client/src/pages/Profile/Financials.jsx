import { useState, useEffect, useCallback, useRef } from "react";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import BalanceCard from "../../components/Profile/BalanceCard";
import FinanceStatCard from "../../components/Profile/FinanceStatCard";
import TransactionTable from "../../components/Profile/TransactionTable";
import WalletCard from "../../components/Profile/WalletCard";
import { useParams } from "react-router";
import axios from "../../common";

// Trạng thái ví mặc định
const DEFAULT_WALLET_INFO = {
  balance: "0",
  nftCount: 0,
  nfts: [],
  transactions: [],
};

const Financials = () => {
  const { userId } = useParams();
  const { mutate: connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { mutate: disconnect } = useDisconnect();
  const chainId = useChainId();
  const { mutate: switchChain } = useSwitchChain();

  const [walletInfo, setWalletInfo] = useState(DEFAULT_WALLET_INFO);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [walletError, setWalletError] = useState(null);

  const [isWalletLinked, setIsWalletLinked] = useState(false);

  const prevAddressRef = useRef(null);

  // Chỉ true khi user bấm nút "Kết nối ví" thủ công
  // → tránh wagmi auto-reconnect từ localStorage tự link wallet lên server
  const userInitiatedConnect = useRef(false);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Chưa kết nối";
  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  const fetchWalletInfo = useCallback(async () => {
    if (!userId) return;
    setIsLoadingWallet(true);
    setWalletError(null);
    try {
      const { data } = await axios.get(`/api/wallet/walletInfo/${userId}`);
      if (data.connected) {
        setIsWalletLinked(true);
        setWalletInfo({
          balance: data.balance,
          nftCount: data.nftCount,
          nfts: data.nfts,
          transactions: data.transactions,
        });
      } else {
        setIsWalletLinked(false);
        setWalletInfo(DEFAULT_WALLET_INFO);
      }
    } catch (error) {
      console.error("[fetchWalletInfo]", error);
      setWalletError("Không thể tải thông tin ví. Vui lòng thử lại.");
    } finally {
      setIsLoadingWallet(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  // Chỉ link wallet lên server khi user CHỦ ĐỘNG bấm nút kết nối
  // (không chạy khi wagmi auto-reconnect session cũ từ localStorage)
  useEffect(() => {
    if (!address) return;
    if (address === prevAddressRef.current) return;
    if (!userInitiatedConnect.current) {
      // wagmi auto-reconnect → bỏ qua, không link lên server
      prevAddressRef.current = address;
      return;
    }

    prevAddressRef.current = address;
    userInitiatedConnect.current = false;

    const onConnect = async () => {
      try {
        await axios.put(`/api/wallet/updateWallet/${userId}`, {
          walletAddress: address,
        });
        // Đợi blockchain/etherscan sync
        await new Promise((r) => setTimeout(r, 1500));
        await fetchWalletInfo();
      } catch (error) {
        console.error("[onConnect - updateWallet]", error);
        setWalletError(
          error.response?.data?.message ||
            "Không thể liên kết ví. Vui lòng thử lại.",
        );
      }
    };

    onConnect();
  }, [address, userId, fetchWalletInfo]);

  // Ngắt kết nối → xoá address trên server → reset state
  const handleDisconnect = async () => {
    try {
      await axios.delete(`/api/wallet/disconnectWallet/${userId}`);
      setWalletInfo(DEFAULT_WALLET_INFO);
      setIsWalletLinked(false);
      prevAddressRef.current = null;
      userInitiatedConnect.current = false;
    } catch (error) {
      console.error("[handleDisconnect]", error);
    } finally {
      disconnect();
    }
  };

  // Tính giá trị VNĐ ước tính
  const ETH_TO_VND = 100_000_000;
  const estimatedVnd = (
    parseFloat(walletInfo.balance || "0") * ETH_TO_VND
  ).toLocaleString("vi-VN");

  return (
    <div className="mx-auto w-full max-w-6xl p-2">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tài chính & Ví NFT</h1>
          <p className="mt-1 text-sm text-gray-400">
            Quản lý số dư ETH và tài sản NFT của bạn trên UITShare.
          </p>
        </div>

        {!isWalletLinked ? (
          // Chưa link trên server → luôn hiện nút kết nối
          // (kể cả khi wagmi đã auto-reconnect từ localStorage)
          <button
            onClick={() => {
              userInitiatedConnect.current = true;
              connect({ connector: injected() });
            }}
          >
            Kết nối ví MetaMask
          </button>
        ) : isWrongNetwork ? (
          // Đã link nhưng sai mạng → nhắc đổi sang Sepolia
          <button onClick={() => switchChain({ chainId: sepolia.id })}>
            Sai mạng! Đổi sang Sepolia
          </button>
        ) : (
          // Đã link đúng mạng → cho phép ngắt kết nối
          <button onClick={handleDisconnect}>Ngắt kết nối</button>
        )}
      </div>

      {/* Error banner */}
      {walletError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {walletError}
          <button
            className="ml-3 underline hover:text-red-300"
            onClick={fetchWalletInfo}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats cards — dùng isWalletLinked thay vì isConnected để tránh hiện data sai */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard
          balance={
            !isWalletLinked || isLoadingWallet ? "—" : walletInfo.balance
          }
          change="+0.05 ETH (tháng này)"
          onViewExplorer={() =>
            window.open(
              `https://sepolia.etherscan.io/address/${address}`,
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

        <FinanceStatCard
          title="NFT sở hữu"
          value={
            !isWalletLinked || isLoadingWallet ? (
              "—"
            ) : (
              <>
                {walletInfo.nftCount}{" "}
                <span className="text-sm font-medium text-gray-400">Items</span>
              </>
            )
          }
          tagText="Sepolia"
          tagStyle="text-purple-400 bg-purple-500/10 border border-purple-500/20"
          subElement={
            <button className="rounded text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline focus:ring-1 focus:ring-purple-400 focus:outline-none">
              Xem bộ sưu tập &rarr;
            </button>
          }
        />
      </div>

      {/* Transaction table */}
      <TransactionTable
        transactions={isWalletLinked ? walletInfo.transactions : []}
        isLoading={isLoadingWallet}
      />

      {/* Linked wallet card */}
      <h3 className="mb-4 text-lg font-bold text-white">Ví liên kết</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <WalletCard
          isConnected={isConnected && isWalletLinked}
          address={isWalletLinked ? shortAddress : "Chưa kết nối"}
        />
      </div>
    </div>
  );
};

export default Financials;
