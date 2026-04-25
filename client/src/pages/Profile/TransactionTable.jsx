import { Link } from "react-router";
import StatusBadge from "../UI/StatusBadge";

const TYPE_BADGE = {
  "Mua tài liệu": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Bán tài liệu": "bg-green-500/15 text-green-400 border-green-500/30",
  "Chuyển nhượng tài liệu":
    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Nhận chuyển nhượng": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Đã donate": "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Nhận donate": "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Hoa hồng": "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const TypeBadge = ({ type }) => {
  const cls =
    TYPE_BADGE[type] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {type || "—"}
    </span>
  );
};

const TransactionTable = ({ transactions }) => {
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
        <Link
          to="/profile/:userId/purchase-history"
          className="text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-white/10 bg-transparent text-xs whitespace-nowrap text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Giao dịch</th>
              <th className="px-4 py-3 font-medium">Ngày</th>
              <th className="px-4 py-3 font-medium">Số lượng</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className="border-b border-white/10 transition-colors last:border-0 hover:bg-white/5"
              >
                <td className="px-4 py-4">
                  <TypeBadge type={tx.type} />
                </td>
                <td className="px-4 py-4 font-medium whitespace-nowrap text-white">
                  {tx.title}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-400">
                  {tx.date}
                </td>
                <td className="px-4 py-4 font-medium whitespace-nowrap text-white">
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
