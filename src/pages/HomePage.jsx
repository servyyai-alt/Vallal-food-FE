import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import { Loader } from '../components/common/Loader';
import Seo from '../components/seo/Seo';
import { getCategories, getProducts } from '../services/api';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '../seo/schema';
import heroImg from '../assets/amala-heroimg.png';
import heroImg1 from '../assets/amala-heroimg1.png';
import storyImg from '../assets/home-kitchen.png';
import naturalfood from '../assets/natural-food.png';
import homemadecooking from '../assets/homemade-cooking.png';
import fastDelivery from '../assets/FastDelivery.png';
import reviewImg from '../assets/reviewImg.png';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const currentReview = reviews[current] || reviews[0];

  useEffect(() => {
    if (reviews.length === 0) {
      setCurrent(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getCategories()
        ]);

        let featuredProducts = productsResponse.data.products || [];

        if (featuredProducts.length < 8) {
          const fillerResponse = await getProducts({ limit: 8 });
          const fillerProducts = (fillerResponse.data.products || []).filter(
            (product) => !featuredProducts.some((featuredProduct) => featuredProduct._id === product._id)
          );

          featuredProducts = [...featuredProducts, ...fillerProducts].slice(0, 8);
        }

        setFeatured(featuredProducts);
        setCategories(categoriesResponse.data.categories || []);

        const allReviews = featuredProducts.flatMap((product) =>
          (product.reviews || []).map((review) => ({
            name: review.name,
            text: review.comment,
            rating: review.rating
          }))
        );

        setReviews(allReviews.slice(0, 6));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Seo
        title="Natural Homemade Foods and Fresh Groceries"
        description="Discover natural homemade foods, fresh groceries, and fast doorstep delivery from Vallal Food Products in Vadalur."
        keywords="natural homemade foods, fresh groceries, Vallal Food Products, healthy food delivery, Vadalur grocery store"
        path="/"
        schema={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }])
        ]}
      />

      <section className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[140vh]">
        <img
          src={heroImg}
          alt="Vallal Food Products natural food hero"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 mx-auto hidden h-full w-full max-w-full object-cover lg:block"
        />
        <img
          src={heroImg1}
          alt="Vallal Food Products mobile hero"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 block h-full w-full max-w-full object-cover lg:hidden"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
          <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
            <div className="max-w-2xl text-white">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-green-200">Fresh From Vallal Food</p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Natural Homemade Foods And Fresh Grocery Delivery
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-100 md:text-base">
                Order wholesome homemade foods, natural staples, and fresh groceries with reliable doorstep delivery from Vallal Food Products.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
              >
                Shop Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-green-50 py-10 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-green-600">Fresh from Vallal Food</p>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Featured Products</h2>
            </div>

            <Link to="/products" className="font-semibold text-green-600 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">Why Choose Vallal?</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: '100% Natural',
                text: 'No chemicals, no preservatives - just pure goodness.',
                image: naturalfood,
                alt: 'Natural food products'
              },
              {
                title: 'Homemade',
                text: 'Prepared using traditional and authentic methods.',
                image: homemadecooking,
                alt: 'Homemade cooking'
              },
              {
                title: 'Fast Delivery',
                text: 'Quick, safe, and reliable doorstep delivery.',
                image: fastDelivery,
                alt: 'Fast delivery service'
              }
            ].map((item) => (
              <div key={item.title} className="group flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition duration-300 hover:shadow-2xl">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="flex flex-1 flex-col justify-center p-6">
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="text-center md:text-left">
            <p className="mb-2 text-sm font-semibold text-green-600">Testimonials</p>
            <h2 className="mb-8 text-2xl font-bold md:text-4xl">What Our Customers Say</h2>

            {reviews.length > 0 && (
              <div className="rounded-2xl border bg-white p-8 shadow-xl">
                <div className="mb-4 flex justify-center md:justify-start">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      className={`text-lg ${
                        index < (currentReview?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="mb-6 text-lg italic leading-relaxed text-gray-600">
                  "{currentReview?.text || 'Very tasty and fresh product'}"
                </p>

                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                    {(currentReview?.name || 'H')[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{currentReview?.name || 'Happy Customer'}</p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-2 md:justify-start">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full ${current === index ? 'w-4 bg-green-600' : 'w-2 bg-gray-300'}`}
                  aria-label={`Show review ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <img
            src={reviewImg}
            alt="Happy customers enjoying Vallal food"
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full rounded-3xl object-contain transition duration-500"
          />
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="relative">
            <img
              src={storyImg}
              alt="Homemade Vallal kitchen"
              loading="lazy"
              decoding="async"
              className="h-[350px] w-full rounded-3xl object-cover shadow-lg md:h-[450px]"
            />

            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold shadow backdrop-blur">
              Made Fresh Daily
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-green-600">Our Promise</p>
            <h2 className="mb-4 text-2xl font-bold leading-snug md:text-4xl">
              From Our Kitchen <br /> To Your Home
            </h2>

            <p className="mb-4 leading-relaxed text-gray-600">
              At Vallal Food, every product is prepared with care, just like how we cook for our own family. We use traditional recipes, natural ingredients, and zero chemicals to keep taste and health together.
            </p>

            <p className="mb-6 text-sm text-gray-500">
              No shortcuts. No preservatives. Only real food made with love.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
