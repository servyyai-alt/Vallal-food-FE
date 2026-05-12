import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from 'react-icons/fi';
import { getAllProductsAdmin, getCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { useAdminPanel } from '../../context/AdminPanelContext';

const EMPTY = { name: '', description: '', price: '', originalPrice: '', discount: '', category: '', stock: '', unit: 'kg', images: [''], isOrganic: false, isFeatured: false, tags: '', nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' } };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { currentSearch } = useAdminPanel();

  const load = async () => {
    const [p, c] = await Promise.all([getAllProductsAdmin(), getCategories()]);
    setProducts(p.data.products); setCategories(c.data.categories); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, category: p.category?._id || '', images: p.images?.length ? p.images : [''], tags: p.tags?.join(', ') || '', nutrition: p.nutrition || EMPTY.nutrition });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { 
      ...form, 
      tags: form.tags
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      price: Number(form.price || 0), 
      originalPrice: Number(form.originalPrice || 0), 
      stock: Number(form.stock || 0), 
      discount: Number(form.discount || 0),
      images: form.images.filter(Boolean)
    };
    try {
      if (editing) { await updateProduct(editing, payload); toast.success('Product updated!'); }
      else { await createProduct(payload); toast.success('Product created!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving product'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(product => product._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = products.filter(product => {
    if (!keyword) return true;
    const searchable = [
      product.name,
      product.description,
      product.category?.name,
      ...(product.tags || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return searchable.includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2"><FiPlus /> Add Product</button>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No matching products found</p>
            <p className="mt-2 text-sm text-gray-500">Try another product name, category, or tag keyword.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                            {p.isOrganic && <span className="text-xs text-primary-600">🌱 Organic</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{p.category?.name || '—'}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">₹{p.price}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${p.stock > 10 ? 'text-primary-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-500'}`}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows={3} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                  <input type="number" required value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                   <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="input-field">
                     {['piece', 'kg', 'g', 'litre', 'ml', 'pack', 'dozen', 'jar', 'bottle', 'box'].map(u => <option key={u}>{u}</option>)}
                   </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                 <div className="col-span-2">
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                   <input 
                     ref={fileInputRef} 
                     type="file" 
                     accept="image/*" 
                     onChange={async (e) => {
                       const file = e.target.files[0];
                       if (!file) return;
                       
                       setUploading(true);
                       try {
                         const res = await uploadImage(file);
                         setForm(f => ({ ...f, images: [res.data.url] }));
                         toast.success('Image uploaded!');
                       } catch (err) {
                         toast.error('Failed to upload image');
                       }
                       setUploading(false);
                     }} 
                     className="hidden" 
                   />
                   
                   {form.images?.[0] ? (
                     <div className="relative">
                       <img src={form.images[0]} alt="Preview" className="w-full h-40 object-cover rounded-xl border" />
                       <button 
                         type="button" 
                         onClick={() => setForm(f => ({ ...f, images: [''] }))}
                         className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                       >
                         <FiTrash2 size={14} />
                       </button>
                     </div>
                   ) : (
                     <button 
                       type="button" 
                       onClick={() => fileInputRef.current.click()}
                       disabled={uploading}
                       className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
                     >
                       {uploading ? (
                         <Loader size="sm" />
                       ) : (
                         <>
                           <FiUpload size={24} />
                           <span className="font-medium">Click to upload image</span>
                           <span className="text-xs text-gray-400">JPG, PNG, WebP supported</span>
                         </>
                       )}
                     </button>
                   )}
                 </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input-field" placeholder="organic, fresh, seasonal" />
                </div>
                {/* <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={form.isOrganic} onChange={e => setForm(f => ({ ...f, isOrganic: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
                    Organic
                  </label>
                </div> */}
              </div>
              <div className="flex gap-3 pt-2">
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
