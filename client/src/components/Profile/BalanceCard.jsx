const BalanceCard = ({ balance, change, onViewExplorer }) => {
  return (
    <div className="flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md xl:col-span-2">
      <div>
        <p className="mb-1 text-sm font-medium text-gray-400">Số dư ví (ETH)</p>
        <h2 className="text-4xl font-bold text-white">
          {balance}{" "}
          <span className="text-lg font-medium text-gray-400">ETH</span>
        </h2>
        <p className="mt-2 inline-block rounded-md bg-green-500/10 px-2 py-1 text-sm font-medium text-green-400">
          {change}
        </p>
      </div>
      <div className="mt-6 flex">
        <button
          onClick={onViewExplorer}
          className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-500 hover:to-indigo-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          Xem lịch sử ví trên Explorer
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
