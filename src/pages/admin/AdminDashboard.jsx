import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getDashboardStats, getStoreSettingsAdmin, updateStoreSettings } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminPanel } from '../../context/AdminPanelContext';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    taxRatePercent: 5,
    shippingCharge: 49,
    freeShippingThreshold: 499
  });
  const { currentSearch } = useAdminPanel();

  useEffect(() => {
    Promise.all([getDashboardStats(), getStoreSettingsAdmin()])
      .then(([statsRes, settingsRes]) => {
        setStats(statsRes.data.stats);
        if (settingsRes.data?.settings) {
          setPricingForm({
            taxRatePercent: settingsRes.data.settings.taxRatePercent ?? 5,
            shippingCharge: settingsRes.data.settings.shippingCharge ?? 49,
            freeShippingThreshold: settingsRes.data.settings.freeShippingThreshold ?? 499
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePricingChange = (key, value) => {
    setPricingForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handlePricingSave = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        taxRatePercent: Number(pricingForm.taxRatePercent),
        shippingCharge: Number(pricingForm.shippingCharge),
        freeShippingThreshold: Number(pricingForm.freeShippingThreshold)
      };
      const res = await updateStoreSettings(payload);
      setPricingForm({
        taxRatePercent: res.data.settings.taxRatePercent,
        shippingCharge: res.data.settings.shippingCharge,
        freeShippingThreshold: res.data.settings.freeShippingThreshold
      });
      toast.success('Pricing settings updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pricing settings');
    }
    setSavingSettings(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader size="lg" />
      </AdminLayout>
    );
  }

  const keyword = currentSearch.trim().toLowerCase();
  const recentOrders = (stats?.recentOrders || []).filter(order => {
    if (!keyword) return true;
    return [order._id, order.user?.name, order.orderStatus]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  const cards = [
    { label: 'Total Revenue', value: `Rs. ${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: <FiDollarSign />, color: 'bg-primary-500', to: '/admin/orders' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiPackage />, color: 'bg-blue-500', to: '/admin/orders' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FiShoppingBag />, color: 'bg-purple-500', to: '/admin/products' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'bg-accent-500', to: '/admin/users' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Link key={index} to={card.to} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center text-white`}>{card.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg text-gray-900">Pricing Settings</h2>
            <span className="text-xs font-medium text-gray-500">Used in cart, checkout, and order totals</span>
          </div>
          <form onSubmit={handlePricingSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            {[
              { key: 'taxRatePercent', label: 'Tax %', step: '0.01' },
              { key: 'shippingCharge', label: 'Shipping Charge', step: '1' },
              { key: 'freeShippingThreshold', label: 'Free Shipping Above', step: '1' }
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  step={field.step}
                  value={pricingForm[field.key]}
                  onChange={(e) => handlePricingChange(field.key, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
            <div className="md:self-end">
              <button type="submit" disabled={savingSettings} className="btn-primary w-full md:w-auto px-6 py-3">
                {savingSettings ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(heading => (
                    <th key={heading} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                      No matching recent orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{order.user?.name}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">Rs. {order.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
