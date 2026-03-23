import { Link } from 'react-router';
import StatusBadge from '../UI/StatusBadge';

const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
        <Link 
          to="/profile/purchase-history" 
          className="text-sm font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="text-xs text-gray-400 uppercase bg-transparent border-b border-white/10 whitespace-nowrap">
            <tr>
              <th className="px-4 py-3 font-medium">Giao dịch</th>
              <th className="px-4 py-3 font-medium">Ngày</th>
              <th className="px-4 py-3 font-medium">Số lượng</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-white font-medium whitespace-nowrap">{tx.title}</td>
                <td className="px-4 py-4 text-gray-400 whitespace-nowrap">{tx.date}</td>
                <td className="px-4 py-4 whitespace-nowrap font-medium text-white">
                    {tx.amount}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;