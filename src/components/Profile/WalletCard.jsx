import { FaEthereum } from "react-icons/fa6";

const WalletCard = ({ address, isConnected }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
      <div className="absolute top-2 right-2 p-2 opacity-20 text-6xl text-white">
        <FaEthereum />
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm mb-1">"MetaMask"</p>
        <p className="font-mono text-lg text-white tracking-wider mb-6 truncate">{address}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-400 text-xs">Mạng lưới</p>
            <p className="font-medium text-gray-300 text-sm">"Sepolia Testnet"</p>
          </div>
          {isConnected && (
            <div className="bg-green-400 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;