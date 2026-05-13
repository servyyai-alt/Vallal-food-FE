import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.jpeg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const isAdmin = user?.role === 'admin';
  const hideNavbarSearch = location.pathname === '/products';

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearch('');
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="FreshMart" className="h-16 w-auto object-contain" />
          </Link>

          {/* Search Bar */}
          {!hideNavbarSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search fresh produce, snacks..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </form>
          )}

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all">Home</Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all">Shop</Link>
            {user && !isAdmin && (
              <>
                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  <FiHeart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  <FiShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative ml-1">
                <button onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium">
                  <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700">{user.name.split(' ')[0]}</span>
                </button>
                {dropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2">

                    {/* Normal User Only */}
                    {!isAdmin && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
                        >
                          <FiUser className="w-4 h-4 text-gray-400" />
                          My Profile
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
                        >
                          <FiPackage className="w-4 h-4 text-gray-400" />
                          My Orders
                        </Link>
                      </>
                    )}

                    {/* Admin Only */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-primary-600 font-medium"
                      >
                        <FiSettings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 w-full"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
  <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 animate-slide-up">
    
    <form onSubmit={handleSearch}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10"
        />
      </div>
    </form>
    <Link
      to="/"
      onClick={() => setMobileOpen(false)}
      className="block py-2 text-gray-700 font-medium"
    >
      Home
    </Link>

    <Link
      to="/products"
      onClick={() => setMobileOpen(false)}
      className="block py-2 text-gray-700 font-medium"
    >
      Shop
    </Link>

    {user ? (
      <>
        {!isAdmin && (
          <>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-700"
            >
              <FiShoppingCart />
              Cart

              {cartCount > 0 && (
                <span className="bg-accent-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-700"
            >
              <FiHeart />
              Wishlist
            </Link>

            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-700"
            >
              <FiPackage />
              Orders
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-gray-700"
            >
              <FiUser />
              Profile
            </Link>
          </>
        )}

        {/* Admin Only */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-2 text-primary-600 font-medium"
          >
            <FiSettings />
            Admin Panel
          </Link>
        )}

        <button
          onClick={() => {
            logout();
            setMobileOpen(false);
          }}
          className="flex items-center gap-2 py-2 text-red-500 w-full"
        >
          <FiLogOut />
          Logout
        </button>
      </>
    ) : (
      <div className="flex gap-3">
        <Link
          to="/login"
          onClick={() => setMobileOpen(false)}
          className="btn-outline flex-1 text-center text-sm"
        >
          Login
        </Link>

        <Link
          to="/register"
          onClick={() => setMobileOpen(false)}
          className="btn-primary flex-1 text-center text-sm"
        >
          Sign Up
        </Link>
      </div>
    )}
  </div>
)}
    </header>
  );
}
