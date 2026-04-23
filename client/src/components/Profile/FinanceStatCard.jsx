const FinanceStatCard = ({ title, value, tagText, tagStyle, subElement }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-1 gap-2">
          <p className="text-sm font-medium text-gray-400 leading-tight">
            {title}
          </p>
          <span
            className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap shrink-0 ${tagStyle}`}
          >
            {tagText}
          </span>
        </div>
        <h3 className="text-xl xl:text-2xl font-bold text-white break-words">
          {value}
        </h3>
      </div>
      <div className="mt-4">{subElement}</div>
    </div>
  );
};

export default FinanceStatCard;
