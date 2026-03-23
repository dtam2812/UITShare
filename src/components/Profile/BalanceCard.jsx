const BalanceCard = ({ balance, change, onViewExplorer }) => {
  return (
    <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">Số dư ví (ETH)</p>
        <h2 className="text-4xl font-bold text-white">
          {balance} <span className="text-lg text-gray-400 font-medium">ETH</span>
        </h2>
        <p className="inline-block text-sm text-green-400 bg-green-500/10 px-2 py-1 rounded-md font-medium mt-2">
          {change}
        </p>
      </div>
      <div className="flex mt-6">
        <button 
          onClick={onViewExplorer}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-3 rounded-lg font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        >
          Xem lịch sử ví trên Explorer
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;