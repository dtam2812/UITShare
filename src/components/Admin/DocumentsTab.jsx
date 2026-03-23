import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminSearchBar from './AdminSearchBar';
import DataTable from './DataTable';
import ModalOverlay from './ModalOverlay';

const SUBJECTS = [
  { id: 'IT002', name: 'Lập trình hướng đối tượng' },
  { id: 'IT003', name: 'Cấu trúc dữ liệu và giải thuật' },
  { id: 'IT004', name: 'Cơ sở dữ liệu' },
  { id: 'IT005', name: 'Nhập môn mạng máy tính' },
  { id: 'IT012', name: 'Tổ chức và cấu trúc máy tính II' },
  { id: 'IT007', name: 'Hệ điều hành' },
  { id: 'IE005', name: 'Giới thiệu ngành Công nghệ Thông tin' },
  { id: 'IE101', name: 'Cơ sở hạ tầng công nghệ thông tin' },
  { id: 'IE103', name: 'Quản lý thông tin' },
  { id: 'IE104', name: 'Internet và công nghệ Web' },
  { id: 'IE106', name: 'Thiết kế giao diện người dùng' },
  { id: 'IE105', name: 'Nhập môn đảm bảo và an ninh thông tin' },
  { id: 'IE108', name: 'Phân tích thiết kế phần mềm' },
  { id: 'IS402', name: 'Điện toán đám mây' }
];

export default function DocumentsTab({documents, setDocuments}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    title: '',
    subjectId: '',
    subject: '',
    author: '',
    buyPrice: '',
    fileName: '',
    status: 'Pending'
  });
  const handleDelete = id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };
  const openAddModal = () => {
    setForm({
      id: '',
      title: '',
      subjectId: '',
      subject: '',
      author: '',
      buyPrice: '',
      fileName: '',
      status: 'Pending'
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  const openEditModal = doc => {
    setForm(doc);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (isEditMode) {
      setDocuments(documents.map(d => d.id === form.id ? {
        ...d,
        ...form
      } : d));
    } else {
      const newDoc = {
        id: `D00${documents.length + 1}`,
        ...form,
        sales: 0
      };
      setDocuments([...documents, newDoc]);
    }
    setIsModalOpen(false);
  };
  const filteredDocs = documents.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || (d.subjectId && d.subjectId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSubject = subjectFilter === 'All Subjects' || d.subjectId === subjectFilter;
    const matchStatus = statusFilter === 'All Status' || d.status === statusFilter;
    return matchSearch && matchSubject && matchStatus;
  });
  const columns = [{
    header: 'No.',
    accessor: 'id'
  }, {
    header: 'Title',
    accessor: row => <span className="font-medium text-white max-w-[200px] truncate block" title={row.title}>{row.title}</span>
  }, {
    header: 'Subject ID',
    accessor: 'subjectId'
  }, {
    header: 'Subject',
    accessor: 'subject'
  }, {
    header: 'Author',
    accessor: 'author'
  }, {
    header: 'Price',
    accessor: row => <span className="font-medium text-green-400">{row.buyPrice}</span>
  }, {
    header: 'Sales',
    accessor: 'sales'
  }, {
    header: 'Status',
    accessor: row => <span className={`px-2 py-1 rounded-md text-xs font-medium ${row.status === 'Approved' ? 'bg-green-500/20 text-green-400' : row.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
        {row.status}
      </span>
  }, {
    header: 'Edit',
    className: 'text-center',
    accessor: row => <button onClick={() => openEditModal(row)} className="text-gray-400 hover:text-blue-400 transition-colors"><Edit size={18} className="mx-auto" /></button>
  }, {
    header: 'Delete',
    className: 'text-center',
    accessor: row => <button onClick={() => handleDelete(row.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={18} className="mx-auto" /></button>
  }];
  const filters = <>
      <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="border border-gray-800 bg-[#1c1e2f] text-gray-300 text-sm rounded-md px-4 py-2 outline-none max-w-[200px] truncate focus:border-purple-500">
        <option value="All Subjects">All Subjects</option>
        {SUBJECTS.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.id} - {sub.name}</option>
        ))}
      </select>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-800 bg-[#1c1e2f] text-gray-300 text-sm rounded-md px-4 py-2 outline-none focus:border-purple-500">
        <option>All Status</option>
        <option>Approved</option>
        <option>Pending</option>
        <option>Rejected</option>
      </select>
    </>;
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Documents</h2>
        <button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors border border-purple-500">
          <Plus size={18} /> Add Document
        </button>
      </div>

      <AdminSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by document title or ID (e.g. D001)" filters={filters} />
      
      <DataTable title="Documents" count={filteredDocs.length} columns={columns} data={filteredDocs} emptyMessage="No documents found." />

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 bg-[#131722] rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">{isEditMode ? 'Edit Document' : 'Add New Document'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input required type="text" className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.title} onChange={e => setForm({
              ...form,
              title: e.target.value
            })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <select required className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.subjectId} onChange={e => {
                  const selectedSubject = SUBJECTS.find(s => s.id === e.target.value);
                  setForm({
                    ...form,
                    subjectId: selectedSubject?.id || '',
                    subject: selectedSubject?.name || ''
                  });
                }}>
                  <option value="" disabled>Select Subject</option>
                  {SUBJECTS.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.id} - {sub.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                <input required type="text" className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.author} onChange={e => setForm({
                ...form,
                author: e.target.value
              })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Buy Price</label>
              <input required type="text" placeholder="e.g. 50,000đ" className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.buyPrice} onChange={e => setForm({
              ...form,
              buyPrice: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upload Document (Word/PDF)</label>
              <input type="file" accept=".pdf,.doc,.docx" className="w-full border border-gray-800 bg-[#1c1e2f] text-gray-300 rounded-md px-3 py-1.5 outline-none focus:border-purple-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-400 hover:file:bg-purple-600/30" onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                setForm({
                  ...form,
                  fileName: e.target.files[0].name
                });
              }
            }} />
              {form.fileName && <p className="text-xs text-gray-500 mt-1 truncate">File: {form.fileName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.status} onChange={e => setForm({
              ...form,
              status: e.target.value
            })}>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save Document</button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>;
}