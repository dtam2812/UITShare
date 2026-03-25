import { useConnect, useConnection, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import BalanceCard from '../../components/Profile/BalanceCard';
import FinanceStatCard from '../../components/Profile/FinanceStatCard';
import TransactionTable from '../../components/Profile/TransactionTable';
import WalletCard from '../../components/Profile/WalletCard';

const Financials = () => {
  const { mutate: connect } = useConnect()
  const { address, isConnected } = useConnection()
  const disconnect = useDisconnect()
  const { data: balanceData } = useBalance({ address })
  const chainId = useChainId()
  const { mutate: switchChain } = useSwitchChain()
  
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Chưa kết nối"
  const isWrongNetwork = isConnected && chainId !== sepolia.id

  const mockTransactions = [
    { title: 'Bán tài liệu "Giải tích 1"', date: '01/03/2026', amount: '+ 0.05 ETH', status: 'Thành công' },
    { title: 'Mua tài liệu "Ôn tập OOP"', date: '25/02/2026', amount: '- 0.01 ETH', status: 'Thành công' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tài chính & Ví NFT</h1>
          <p className="text-sm text-gray-400 mt-1">Quản lý số dư ETH và tài sản NFT của bạn trên UITShare.</p>
        </div>
        {!isConnected ? (
          <button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={() => connect({ connector: injected() })}
          >
            Kết nối ví Web3
          </button>
        ) : isWrongNetwork ? (
          <button 
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer animate-pulse focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => switchChain({ chainId: sepolia.id })}
          >
            Sai mạng! Đổi sang Sepolia
          </button>
        ) : (
          <button 
            className="bg-transparent border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 text-gray-300 hover:text-red-400 px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => disconnect.mutate()}
          >
            Ngắt kết nối
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <BalanceCard 
          balance={balanceData?.formatted || "0"}
          change="+0.05 ETH (tháng này)" 
          onViewExplorer={() => window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')}
        />
        
        <FinanceStatCard 
          title="Giá trị ước tính"
          value="15,000,000đ" 
          tagText="VNĐ"
          tagStyle="text-gray-300 bg-white/10 border border-white/10"
          subElement={<p className="text-xs text-gray-400">Tỉ giá: 1 ETH = ~100,000,000đ</p>}
        />

        <FinanceStatCard 
          title="NFT sở hữu"
          value={<>12 <span className="text-sm text-gray-400 font-medium">Items</span></>}
          tagText="Sepolia" 
          tagStyle="text-purple-400 bg-purple-500/10 border border-purple-500/20"
          subElement={<button className="text-sm text-purple-400 font-medium hover:text-purple-300 hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-purple-400 rounded">Xem bộ sưu tập &rarr;</button>}
        />
      </div>

      <TransactionTable transactions={mockTransactions} />

      <h3 className="text-lg font-bold text-white mb-4">Ví liên kết</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletCard 
          isConnected={isConnected}
          address={shortAddress}
        />
      </div>
    </div>
  );
};

export default Financials;