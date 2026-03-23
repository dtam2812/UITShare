const UploadedDocsStatCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm hover:bg-white/10 transition-all cursor-pointer">
      <div className={`flex items-center justify-center shrink-0 w-12 h-12 rounded-xl ${bgColor} ${textColor}`}>
        {icon}
      </div>

      <div className="flex flex-col min-w-0 w-full">
        <span className="text-sm font-semibold text-gray-400 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </span>
        <span className="text-xl sm:text-2xl font-extrabold text-white truncate">
          {value}
        </span>
      </div>
    </div>
  );
};

export default UploadedDocsStatCard;