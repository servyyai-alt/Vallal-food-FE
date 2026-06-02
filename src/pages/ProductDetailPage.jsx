import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { getProduct, getProducts, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import RecommendedProductsSection from '../components/common/RecommendedProductsSection';
import toast from 'react-hot-toast';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema, buildProductSchema } from '../seo/schema';
import { trackEvent } from '../services/analytics';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user, refreshUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then(res => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product?._id) return;

    trackEvent('view_item', {
      currency: 'INR',
      value: Number(product.price) || 0,
      item_name: product.name,
      item_id: product._id
    });
  }, [product?._id, product?.name, product?.price]);

  useEffect(() => {
    if (!user?.wishlist || !product?._id) {
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
  }, [user, product?._id]);

  useEffect(() => {
    let active = true;

    const fetchRecommendations = async () => {
      if (!product?._id) {
        if (active) {
          setRecommendedProducts([]);
          setRecommendationsLoading(false);
        }
        return;
      }

      setRecommendationsLoading(true);

      const categoryId = product.category?._id || product.category;
      const price = Number(product.price) || 0;

      const requests = [
        categoryId ? getProducts({ category: categoryId, sort: 'rating', limit: 8 }) : Promise.resolve({ data: { products: [] } }),
        price
          ? getProducts({
              minPrice: Math.max(0, Math.floor(price * 0.75)),
              maxPrice: Math.ceil(price * 1.25),
              sort: 'rating',
              limit: 8
            })
          : Promise.resolve({ data: { products: [] } }),
        getProducts({ rating: 4, sort: 'rating', limit: 8 })
      ];

      try {
        const responses = await Promise.all(requests);
        if (!active) return;

        const merged = [];
        const seenIds = new Set([product._id]);

        responses.forEach(response => {
          (response.data.products || []).forEach(item => {
            if (seenIds.has(item._id)) return;
            seenIds.add(item._id);
            merged.push(item);
          });
        });

        setRecommendedProducts(merged.slice(0, 4));
      } catch {
        if (!active) return;
        setRecommendedProducts([]);
      } finally {
        if (!active) return;
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      active = false;
    };
  }, [product?._id, product?.category, product?.price]);

  const handleAddToCart = () => {
    if (isAdmin) return;
    trackEvent('add_to_cart', {
      currency: 'INR',
      value: (Number(product.price) || 0) * qty,
      item_name: product.name,
      item_id: product._id,
      quantity: qty
    });
    addToCart(product._id, qty);
  };

  const handleWishlist = async () => {
    if (isAdmin) return;

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

  if (loading) return <Loader />;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Seo
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.category?.name || 'food product'}, Vallal Food Products`}
        path={`/products/${product.slug}`}
        image={product.images?.[0]}
        type="product"
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.name, path: `/products/${product.slug}` }
          ]),
          buildProductSchema(product)
        ]}
      />
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="eager"
            decoding="async"
            className="w-full h-[550px] rounded-2xl "
          />
        </div>

        <div>
          <Link
            to="/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Link
              to={product.category?.slug ? `/categories/${product.category.slug}` : '/categories'}
              className="text-sm text-green-600 font-semibold"
            >
              {product.category?.name}
            </Link>

            {product.isOrganic && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                 🌿 Organic
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-xs text-gray-400 mb-3">
            SKU: {product.sku || 'VALLAL-001'}
          </p>

          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(s => (
              <FiStar
                key={s}
                className={`${
                  s <= Math.round(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-500">
              ({product.numReviews})
            </span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold">₹{product.price}</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {!isAdmin ? (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>
                  <FiMinus />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-4 py-3 rounded-xl inline-flex items-center gap-2 whitespace-nowrap"
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className={`border px-4 py-3 rounded-xl inline-flex items-center justify-center transition-colors ${
                  isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'text-gray-600'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                title={isWishlisted ? 'Added to wishlist' : 'Add to wishlist'}
              >
                <FiHeart className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>
          ) : (
            <></>
          )}

          <p className="mt-4 text-sm text-gray-500">
            Stock: {product.stock}
          </p>
        </div>
      </div>

      <RecommendedProductsSection
        title="Recommended Products"
        products={recommendedProducts}
        loading={recommendationsLoading}
      />
    </div>
  );
}
