import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { useAdminPanel } from '../../context/AdminPanelContext';

const EMPTY = { name: '', description: '', icon: '🛒', image: '', sortOrder: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { currentSearch } = useAdminPanel();

  const load = () => getCategories().then(r => { setCategories(r.data.categories); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c) => { setEditing(c._id); setForm(c); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateCategory(editing, form); toast.success('Category updated!'); }
      else { await createCategory(form); toast.success('Category created!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(id); toast.success('Category deleted'); load();
  };

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = categories.filter(category => {
    if (!keyword) return true;
    return [category.name, category.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex justify-end">
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2"><FiPlus /> Add Category</button>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No matching records found</p>
            <p className="mt-2 text-sm text-gray-500">Try another category name or description keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(cat => (
              <div key={cat._id} className="card p-5 flex items-center gap-4">
                <div className="text-4xl">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{cat.description || 'No description'}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(cat)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"><FiEdit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"><FiTrash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg">{editing ? 'Edit Category' : 'New Category'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'icon', label: 'Icon (emoji)', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'image', label: 'Image URL', type: 'text' },
                { key: 'sortOrder', label: 'Sort Order', type: 'number' }
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    required={f.key === 'name'} className="input-field" />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
