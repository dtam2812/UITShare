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

export default function NFTInfo({ nft }) {
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

        {/* Author wallet address */}
        <div className="col-span-2">
          <p className="mb-1 text-xs text-gray-500">Địa chỉ ví tác giả</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-semibold text-white">
              {nft.authorWallet ? `${nft.authorWallet.slice(0, 20)}...` : "—"}
            </p>
            {nft.authorWallet && (
              <button
                onClick={() => navigator.clipboard.writeText(nft.authorWallet)}
                className="cursor-pointer text-white/40 transition-colors hover:text-cyan-400"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper
function shortenAddress(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
