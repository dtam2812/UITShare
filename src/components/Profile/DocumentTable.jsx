import { FiEdit2, FiTrash2 } from 'react-icons/fi'; 
import StatusBadge from '../UI/StatusBadge';

const DocumentTable = ({ columns, data, onEdit, onDelete }) => {

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left text-gray-300 table-fixed">
          
          <thead className="text-[11px] text-gray-400 font-bold uppercase bg-transparent border-b border-white/10">
            <tr>
                {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 tracking-wider ${col.className}`}>
                    {col.label}
                </th>
                ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors bg-transparent">
                <td className="px-6 py-4 font-bold text-white">
                  <div className="truncate w-full" title={item.tenTaiLieu}>
                    {item.tenTaiLieu}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap font-medium">
                  {item.ngayDang}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-300 whitespace-nowrap text-center">
                  {item.luotTai}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={item.trangThai} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                        className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                        onClick={() => onEdit(item.id)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button 
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                        onClick={() => onDelete(item.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
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