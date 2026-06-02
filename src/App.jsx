import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminPanelProvider } from './context/AdminPanelContext';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';
import { Loader } from './components/common/Loader';
import { AnalyticsScripts, RouteAnalytics } from './components/seo/RouteAnalytics';
import Seo from './components/seo/Seo';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/AuthPages').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages').then((module) => ({ default: module.RegisterPage })));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const RazorpayDemoPage = lazy(() => import('./pages/RazorpayDemoPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

function WhatsAppButton() {
  const whatsappUrl = 'https://wa.me/919842209470?text=Hello%20Vallal Food Products%2C%20I%20need%20help%20with%20my%20order.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#1ebe5d]"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

function AdminShell({ children }) {
  return <AdminPanelProvider>{children}</AdminPanelProvider>;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteAnalytics />
      <AuthProvider>
        <CartProvider>
          <AnalyticsScripts />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '12px', fontFamily: 'Outfit, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } }
            }}
          />
          <WhatsAppButton />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
              <Route path="/products/:slug" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
              <Route path="/categories/:slug" element={<Layout><CategoryDetailPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/payment-demo" element={<Layout><RazorpayDemoPage /></Layout>} />
              <Route path="/privacy-policy" element={<Layout><PolicyPage /></Layout>} />
              <Route path="/terms-and-conditions" element={<Layout><PolicyPage /></Layout>} />
              <Route path="/refund-cancellation-policy" element={<Layout><PolicyPage /></Layout>} />
              <Route path="/safety-guidelines" element={<Layout><PolicyPage /></Layout>} />
              <Route path="/user-verification-policy" element={<Layout><PolicyPage /></Layout>} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/cart" element={<Layout><ProtectedRoute><CartPage /></ProtectedRoute></Layout>} />
              <Route path="/wishlist" element={<Layout><ProtectedRoute><WishlistPage /></ProtectedRoute></Layout>} />
              <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
              <Route path="/order-confirmation/:id" element={<Layout><ProtectedRoute><OrderConfirmationPage /></ProtectedRoute></Layout>} />
              <Route path="/orders" element={<Layout><ProtectedRoute><OrderHistoryPage /></ProtectedRoute></Layout>} />
              <Route path="/orders/:id" element={<Layout><ProtectedRoute><OrderConfirmationPage /></ProtectedRoute></Layout>} />
              <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />

              <Route path="/admin" element={<AdminRoute><AdminShell><Navigate to="/admin/dashboard" replace /></AdminShell></AdminRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminShell><AdminDashboard /></AdminShell></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminShell><AdminProducts /></AdminShell></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminShell><AdminCategories /></AdminShell></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminShell><AdminOrders /></AdminShell></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminShell><AdminUsers /></AdminShell></AdminRoute>} />
              <Route path="/admin/messages" element={<AdminRoute><AdminShell><AdminMessages /></AdminShell></AdminRoute>} />

              <Route
                path="*"
                element={
                  <Layout>
                    <Seo
                      title="Page Not Found"
                      description="The page you requested could not be found on Vallal Food Products."
                      path={typeof window !== 'undefined' ? window.location.pathname : '/404'}
                      robots="noindex,nofollow"
                    />
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                      <div className="mb-4 text-7xl">ðŸ¥¦</div>
                      <h2 className="mb-2 text-3xl font-bold text-gray-800">Page Not Found</h2>
                      <p className="mb-6 text-gray-500">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
