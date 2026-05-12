// import { Link } from 'react-router-dom';
// import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { toggleWishlist } from '../../services/api';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function ProductCard({ product }) {
//   const { addToCart, cart, increaseQty, decreaseQty } = useCart();
//   const { user, refreshUser } = useAuth();

//   const [isWishlisted, setIsWishlisted] = useState(false);

//   // ✅ Check if product already in wishlist
//   useEffect(() => {
//     if (!user?.wishlist) {
//       setIsWishlisted(false);
//       return;
//     }

//     const isAdded = user.wishlist.some((item) => {
//       if (typeof item === 'object') {
//         return item?._id === product._id;
//       }

//       return item === product._id;
//     });

//     setIsWishlisted(isAdded);
//   }, [user, product._id]);

//   // ✅ Get product quantity in cart
//   const cartItem = cart.items?.find(item => item.product._id === product._id);
//   const qty = cartItem?.quantity || 0;

//   const handleWishlist = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast.error('Please login first');
//       return;
//     }

//     try {
//       const { data } = await toggleWishlist({ productId: product._id });

//       // toggle UI instantly
//       setIsWishlisted(prev => !prev);
//       await refreshUser();

//       toast.success(data.message);
//     } catch {
//       toast.error('Failed to update wishlist');
//     }
//   };

//   return (
//     <Link to={`/products/${product.slug}`} className="block">
//       <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">

//         {/* Image */}
//         <div className="relative overflow-hidden aspect-square bg-gray-50">
//           <img
//             src={product.images?.[0] || 'https://via.placeholder.com/300'}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//           />

//           {product.discount > 0 && (
//             <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
//               -{product.discount}%
//             </span>
//           )}

//           {product.isOrganic && (
//             <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
//               Organic
//             </span>
//           )}

//           {/* ❤️ Wishlist Button */}
//           <button
//             onClick={handleWishlist}
//             className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition 
//               ${isWishlisted ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-red-500'}
//             `}
//           >
//             <FiHeart className={isWishlisted ? 'fill-red-600' : ''} />
//           </button>

//           {/* 🛒 Quantity Badge (only if > 0) */}
//           {qty > 0 && (
//             <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
//               {qty}
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4">

//           <p className="text-xs text-gray-400 mb-1 uppercase">
//             {product.category?.name}
//           </p>

//           <h3 className="font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
//             {product.name}
//           </h3>

//           <p className="text-xs text-gray-400 mt-1">
//             SKU: {product.sku || 'AMALA-001'}
//           </p>

//           {/* <div className="flex items-center gap-1 mt-2 mb-2">
//             <FiStar className="text-yellow-400 fill-yellow-400" />
//             <span className="text-sm text-gray-600">
//               {product.rating?.toFixed(1) || '4.5'} ({product.numReviews || 0})
//             </span>
//           </div> */}

//           <div className="flex items-center justify-between mt-3">

//             <div>
//               <span className="text-lg font-bold text-gray-900">
//                 ₹{product.price}
//               </span>
//             </div>

//             {/* 🛒 Cart Controls */}
//             {qty > 0 ? (
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     decreaseQty(product._id);
//                   }}
//                   className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition active:scale-95"
//                 >
//                   -
//                 </button>

//                 <span className="text-sm font-semibold w-6 text-center">{qty}</span>

//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     increaseQty(product._id);
//                   }}
//                   className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition active:scale-95"
//                 >
//                   +
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   addToCart(product._id);
//                 }}
//                 className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 active:scale-95"
//               >
//                 <FiShoppingCart />
//               </button>
//             )}

//           </div>

//           <div className="mt-3">
//             <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
//               🌿 Homemade
//             </span>
//           </div>

//         </div>
//       </div>
//     </Link>
//   );
// }


import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../services/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart, cart, increaseQty, decreaseQty } = useCart();
  const { user, refreshUser } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user?.wishlist) {
      setIsWishlisted(false);
      return;
    }

    const isAdded = user.wishlist.some((item) => {
      if (typeof item === 'object') {
        return item?._id === product._id;
      }
      return item === product._id;
    });

    setIsWishlisted(isAdded);
  }, [user, product._id]);

  const cartItem = cart.items?.find(item => item.product._id === product._id);
  const qty = cartItem?.quantity || 0;

  const handleWishlist = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      const { data } = await toggleWishlist({ productId: product._id });
      setIsWishlisted(prev => !prev);
      await refreshUser();
      toast.success(data.message);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
  <Link to={`/products/${product.slug}`} className="block h-full">
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full">

        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}

          {product.isOrganic && (
            <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              Organic
            </span>
          )}

          {/* Wishlist button - hide for admin */}
          {!isAdmin && (
            <button
              onClick={handleWishlist}
              className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition 
                ${isWishlisted ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-red-500'}
              `}
            >
              <FiHeart className={isWishlisted ? 'fill-red-600' : ''} />
            </button>
          )}

          {/* Quantity Badge - hide for admin */}
          {!isAdmin && qty > 0 && (
            <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {qty}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1 uppercase">
            {product.category?.name}
          </p>

          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            SKU: {product.sku || 'AMALA-001'}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price}
              </span>
            </div>

            {/* Cart controls - hide for admin */}
            {!isAdmin && (
              qty > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      decreaseQty(product._id);
                    }}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition active:scale-95"
                  >
                    -
                  </button>

                  <span className="text-sm font-semibold w-6 text-center">{qty}</span>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      increaseQty(product._id);
                    }}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition active:scale-95"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product._id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 active:scale-95"
                >
                  <FiShoppingCart />
                </button>
              )
            )}
          </div>

          <div className="mt-3">
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
            Homemade
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}