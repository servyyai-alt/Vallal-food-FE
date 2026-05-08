import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiShield } from 'react-icons/fi';
import { getAllUsers, updateUser, deleteUser } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => getAllUsers().then(r => { setUsers(r.data.users); setLoading(false); });
  useEffect(() => { load(); }, []);

  const toggleRole = async (user) => {
    const currentRole = user.role?.toLowerCase();
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Make ${user.name} a ${newRole}?`)) return;
    await updateUser(user._id, { role: newRole });
    toast.success(`${user.name} is now ${newRole}`);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    await deleteUser(id); toast.success('User deactivated'); load();
  };

  const filtered = users.filter(u =>
    u.role?.toLowerCase().trim() !== 'admin' && (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="relative max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10 py-2 text-sm" />
        </div>

        {loading ? <Loader /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-400">
                        No users available
                      </td>
                    </tr>
                  ) : (
                    filtered.map(user => (
                      <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{user.email}</td>
                      <td className="py-3 px-4 text-gray-500">{user.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          user.role?.toLowerCase() === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-600'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => toggleRole(user)} title="Toggle Role" className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100">
                            <FiShield className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
