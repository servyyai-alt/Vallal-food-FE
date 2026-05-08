import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiStar } from 'react-icons/fi';
import { getMyOrders } from '../services/api';
import { Loader } from '../components/common/Loader';
import RatingPopup from '../components/common/RatingPopup';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingPopup, setShowRatingPopup] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((r) => {
        setOrders(r.data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <FiPackage className="text-primary-600" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 font-mono text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 transition-colors">
                    <FiChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-4">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                    />
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0">
                    +{order.orderItems.length - 4}
                  </div>
                )}
              </div>

              {order.orderStatus === 'delivered' && (
                <div className="mb-4 space-y-2">
                  {order.orderItems.map((item, i) => {
                    const product = item.product;
                    const canRate = product && typeof product !== 'string';

                    return (
                      <div
                        key={`${order._id}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>

                        {canRate && (
                          <button
                            onClick={() => setShowRatingPopup(product)}
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition flex items-center gap-1"
                          >
                            <FiStar className="w-3 h-3" /> Rate
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-500">
                  {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} · {order.paymentMethod.toUpperCase()}
                </p>
                <p className="font-bold text-gray-900 text-base">₹{order.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRatingPopup && (
        <RatingPopup
          product={showRatingPopup}
          onClose={() => setShowRatingPopup(null)}
        />
      )}
    </div>
  );
}
