import {
  Copy,
  ShieldCheck,
  ArrowLeftRight,
  Tag,
  XCircle,
  Coins,
  ArrowDownToLine,
} from "lucide-react";

const TYPE_CONFIG = {
  mint: {
    label: "Mint",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    icon: <Coins className="h-3 w-3" />,
  },
  buy: {
    label: "Mua",
    color: "text-green-400",
    bg: "bg-green-500/20",
    icon: <ShieldCheck className="h-3 w-3" />,
  },
  transfer: {
    label: "Transfer",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    icon: <ArrowLeftRight className="h-3 w-3" />,
  },
  list: {
    label: "Listing",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    icon: <Tag className="h-3 w-3" />,
  },
  cancel: {
    label: "Huỷ",
    color: "text-red-400",
    bg: "bg-red-500/20",
    icon: <XCircle className="h-3 w-3" />,
  },
  donate: {
    label: "Donate",
    color: "text-pink-400",
    bg: "bg-pink-500/20",
    icon: <ArrowDownToLine className="h-3 w-3" />,
  },
};

export default function NFTInfo({ nft, nftHistory = [] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
          <svg
            className="h-3.5 w-3.5 text-purple-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-white">Thông tin NFT</h3>
      </div>

      {/* NFT Stats */}
      <div className="mb-6 grid grid-cols-3 gap-5">
        {[
          { label: "Giá", value: `${nft.price} ETH`, highlight: true },
          { label: "Token ID", value: `#${nft.tokenId}` },
          { label: "Hoa hồng tác giả", value: `${nft.royaltyPercent ?? 0}%` },
          { label: "Tổng số bản", value: `${nft.totalSupply} bản` },
          { label: "Số bản còn lại", value: `${nft.remainingSupply ?? 0} bản` },
        ].map((item) => (
          <div key={item.label}>
            <p className="mb-1 text-xs text-gray-500">{item.label}</p>
            <p
              className={`text-sm font-semibold ${item.highlight ? "text-lg text-purple-400" : "text-white"}`}
            >
              {item.value}
            </p>
          </div>
        ))}

        {/* Contract address */}
        <div className="col-span-2">
          <p className="mb-1 text-xs text-gray-500">Địa chỉ hợp đồng</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-semibold text-white">
              {nft.contractAddress?.slice(0, 20)}...
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(nft.contractAddress)}
              className="cursor-pointer text-white/40 transition-colors hover:text-cyan-400"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          Lịch sử giao dịch
        </p>

        {nftHistory.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-600">
            Chưa có giao dịch nào
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {nftHistory.map((tx) => {
              const cfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.transfer;
              return (
                <div
                  key={tx._id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5"
                >
                  {/* Left: type badge + actors */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </div>
                    <p className="text-xs text-gray-400">
                      {tx.fromUser?.userName ?? shortenAddress(tx.fromAddress)}
                      {tx.toUser && (
                        <span className="text-gray-600">
                          {" → "}
                          {tx.toUser.userName ?? shortenAddress(tx.toAddress)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Right: price + date */}
                  <div className="text-right">
                    {tx.price > 0 && (
                      <p className="text-xs font-semibold text-white">
                        {tx.price} ETH
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper
function shortenAddress(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
