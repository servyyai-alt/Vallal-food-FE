import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiUser  } from 'react-icons/fi';
import { FaHome } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
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

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="FreshMart" className="h-20 w-auto object-contain" />
        </Link>
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
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600"><FiMenu className="w-6 h-6" /></button>
            <h1 className="font-bold text-gray-800">{NAV.find(n => n.to === pathname)?.label || 'Admin'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* <Link
              to="/orders"
              className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-primary-600"
            >
              <FiPackage className="w-4 h-4" />
              My Orders
            </Link>
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-primary-600"
            >
              <FiUser className="w-4 h-4" />
              My Profile
            </Link> */}
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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
