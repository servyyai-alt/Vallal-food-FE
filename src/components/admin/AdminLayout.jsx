import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiUser, FiBell, FiSearch } from 'react-icons/fi';
import { FaHome } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdminPanel } from '../../context/AdminPanelContext';
import logo from '../../assets/logo.jpeg';
const NAV = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/products', icon: <FiShoppingBag />, label: 'Products' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { to: '/admin/orders', icon: <FiPackage />, label: 'Orders' },
  { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { to: '/', icon: <FaHome  />, label: 'home' }

];

const ACCOUNT_NAV = [
  { to: '/profile', icon: <FiUser />, label: 'My Profile' },
  { to: '/orders', icon: <FiPackage />, label: 'My Orders' }
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bellRef = useRef(null);
  const {
    currentSearch,
    setCurrentSearch,
    searchPlaceholder,
    notifications,
    unreadCount,
    notificationOpen,
    setNotificationOpen,
    markAllAsRead
  } = useAdminPanel();

  const handleLogout = () => { logout(); navigate('/'); };
  const pageTitle = NAV.find(n => n.to === pathname)?.label || 'Admin';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setNotificationOpen]);

  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const formatTime = (value) => {
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-800">
          <img src={logo} alt="FreshMart" className="h-20 w-auto object-contain rounded-xl" />
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(n => (
          <Link key={n.to} to={n.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === n.to ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setSidebarOpen(false)}>
            <span className="w-5 h-5">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
      {/* <div className="px-4 pb-4 space-y-1">
        {ACCOUNT_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === item.to ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div> */}
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 w-full transition-all">
          <FiLogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col flex-shrink-0"><Sidebar /></aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60"><Sidebar /></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600"><FiMenu className="w-6 h-6" /></button>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-800">{pageTitle}</h1>
              <p className="hidden sm:block text-xs text-gray-500 mt-0.5">Manage orders, products, users, and records efficiently.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative hidden sm:block w-full max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={currentSearch}
                onChange={e => setCurrentSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-field pl-10 py-2.5 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            <div ref={bellRef} className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                aria-label="New order notifications"
              >
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-[min(92vw,360px)] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-30">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div>
                      <h2 className="font-semibold text-gray-900">New Orders</h2>
                      <p className="text-xs text-gray-500">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <FiBell className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-gray-700">No recent order notifications</p>
                        <p className="text-sm text-gray-500 mt-1">New orders will appear here automatically.</p>
                      </div>
                    ) : (
                      recentNotifications.map(item => (
                        <Link
                          key={item.id}
                          to="/admin/orders"
                          onClick={() => setNotificationOpen(false)}
                          className={`block px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                            item.unread ? 'bg-primary-50/70' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-xs font-semibold text-gray-700">#{item.orderId.slice(-6).toUpperCase()}</p>
                                {item.unread && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                              </div>
                              <p className="mt-1 text-sm font-semibold text-gray-900 truncate">{item.customerName}</p>
                              <p className="mt-1 text-xs text-gray-500">Rs. {Number(item.totalAmount || 0).toLocaleString('en-IN')} · {formatTime(item.createdAt)}</p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold capitalize text-gray-600">
                              {item.status}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="sm:hidden mb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={currentSearch}
                onChange={e => setCurrentSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-field pl-10 py-2.5 text-sm bg-white"
              />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
