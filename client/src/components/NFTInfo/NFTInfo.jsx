import { Copy } from "lucide-react";

export default function NFTInfo({ nft }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-purple-400"
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

      <div className="grid grid-cols-2 gap-5">
        {[
          { label: "Giá",        value: `${nft.price} ${nft.currency}`, highlight: true },
          { label: "Token ID",   value: nft.tokenId },
          { label: "Blockchain", value: nft.chain },
          { label: "Owner",      value: nft.owner },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`text-sm font-semibold ${item.highlight ? "text-purple-400 text-lg" : "text-white"}`}>
              {item.value}
            </p>
          </div>
        ))}

        <div className="col-span-2">
          <p className="text-xs text-gray-500 mb-1">Contract Address</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white font-mono">
              {nft.contractAddress.slice(0, 20)}...
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(nft.contractAddress)}
              className="text-white/40 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}