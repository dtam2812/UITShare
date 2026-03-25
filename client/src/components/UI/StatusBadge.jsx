const StatusBadge = ({ status }) => {
  let colorClass = 'bg-white/5 text-gray-300 border-white/10'; 

  if (['Thành công', 'Đã duyệt'].includes(status)) {
    colorClass = 'bg-green-500/10 text-green-400 border-green-500/20';
  } else if (['Đang xử lý', 'Chờ duyệt'].includes(status)) {
    colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  } else if (['Thất bại', 'Từ chối'].includes(status)) {
    colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';
  }

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-block border backdrop-blur-sm ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;