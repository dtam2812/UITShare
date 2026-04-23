const FinanceStatCard = ({ title, value, tagText, tagStyle, subElement }) => {
  return (
    <div className="flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md xl:col-span-2">
      <div>
        <div className="mb-1 flex items-start justify-between gap-2">
          <p className="text-sm leading-tight font-medium text-gray-400">
            {title}
          </p>
          <span
            className={`shrink-0 rounded px-2 py-1 text-xs font-bold whitespace-nowrap ${tagStyle}`}
          >
            {tagText}
          </span>
        </div>
        <h3 className="font-bold break-words text-white xl:text-4xl">
          {value}
        </h3>
      </div>
      <div className="mt-4">{subElement}</div>
    </div>
  );
};

export default FinanceStatCard;
