import { FiEdit2, FiTrash2 } from "react-icons/fi";
import StatusBadge from "../UI/StatusBadge";

const DocumentTable = ({ columns, data, onDelete }) => {
  console.log(data);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed text-left text-sm text-gray-300">
          <thead className="border-b border-white/10 bg-transparent text-[11px] font-bold text-gray-400 uppercase">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 tracking-wider ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {data.map((item) => (
              <tr
                key={item.id}
                className="bg-transparent transition-colors hover:bg-white/5"
              >
                <td className="px-6 py-4 font-bold text-white">
                  <div className="w-full truncate" title={item.title}>
                    {item.title}
                  </div>
                </td>
                <td className="py-4 pr-6 font-medium whitespace-nowrap text-gray-400">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center font-semibold whitespace-nowrap text-gray-300">
                  {item.downloadCount}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span>{item.price} ETH</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none"
                      onClick={() => onDelete(item.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
