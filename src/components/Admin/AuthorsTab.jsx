import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminSearchBar from './AdminSearchBar';
import DataTable from './DataTable';
import ModalOverlay from './ModalOverlay';

export default function AuthorsTab({authors, setAuthors}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    status: 'Pending'
  });
  const handleDelete = id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };
  const openAddModal = () => {
    setForm({
      id: '',
      name: '',
      email: '',
      status: 'Pending'
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  const openEditModal = author => {
    setForm(author);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (isEditMode) {
      setAuthors(authors.map(a => a.id === form.id ? {
        ...a,
        ...form
      } : a));
    } else {
      const newAuthor = {
        id: `A00${authors.length + 1}`,
        ...form,
        docsCount: 0,
        revenue: '0đ'
      };
      setAuthors([...authors, newAuthor]);
    }
    setIsModalOpen(false);
  };
  const filteredAuthors = authors.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const columns = [{
    header: 'No.',
    accessor: 'id'
  }, {
    header: 'Name',
    accessor: row => <span className="font-medium text-white">{row.name}</span>
  }, {
    header: 'Email',
    accessor: 'email'
  }, {
    header: 'Docs',
    accessor: 'docsCount'
  }, {
    header: 'Revenue',
    accessor: row => <span className="font-medium text-green-400">{row.revenue}</span>
  }, {
    header: 'Status',
    accessor: row => <span className={`px-2 py-1 rounded-md text-xs font-medium ${row.status === 'Verified' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
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
  const filters = <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-800 bg-[#1c1e2f] text-gray-300 text-sm rounded-md px-4 py-2 outline-none focus:border-purple-500">
      <option>All Status</option>
      <option>Verified</option>
      <option>Pending</option>
    </select>;
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Authors</h2>
        <button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors border border-purple-500">
          <Plus size={18} /> Add Author
        </button>
      </div>

      <AdminSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by author name or ID (e.g. A001)" filters={filters} />
      
      <DataTable title="Authors" count={filteredAuthors.length} columns={columns} data={filteredAuthors} emptyMessage="No authors found." />

      <ModalOverlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 bg-[#131722] rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">{isEditMode ? 'Edit Author' : 'Add New Author'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Author Name</label>
              <input required type="text" className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.name} onChange={e => setForm({
              ...form,
              name: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input required type="email" className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.email} onChange={e => setForm({
              ...form,
              email: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select className="w-full border border-gray-800 bg-[#1c1e2f] text-white rounded-md px-3 py-2 outline-none focus:border-purple-500" value={form.status} onChange={e => setForm({
              ...form,
              status: e.target.value
            })}>
                <option>Verified</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save Author</button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </div>;
}