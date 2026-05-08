// // import { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
// // import { getProducts, getCategories } from '../services/api';
// // import ProductCard from '../components/common/ProductCard';
// // import { Loader } from '../components/common/Loader';

// // const HERO_IMAGES = [
// //   'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80',
// //   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
// //   'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80'
// // ];

// // const TESTIMONIALS = [
// //   { name: 'Priya Sharma', rating: 5, text: 'FreshMart has completely changed how I grocery shop. The produce is incredibly fresh!', avatar: 'P' },
// //   { name: 'Rahul Mehta', rating: 5, text: 'Best quality organic vegetables I\'ve ever had. Fast delivery and great packaging.', avatar: 'R' },
// //   { name: 'Anjali Patel', rating: 5, text: 'Love the variety and freshness. My family only eats FreshMart groceries now!', avatar: 'A' }
// // ];

// // export default function HomePage() {
// //   const [featured, setFeatured] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [heroIdx, setHeroIdx] = useState(0);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const [prodsRes, catsRes] = await Promise.all([
// //           getProducts({ featured: true, limit: 8 }),
// //           getCategories()
// //         ]);
// //         setFeatured(prodsRes.data.products);
// //         setCategories(catsRes.data.categories);
// //       } catch {}
// //       setLoading(false);
// //     };
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
// //     return () => clearInterval(t);
// //   }, []);

// //   return (
// //     <div className="min-h-screen">
// //       {/* Hero */}
// //       <section className="relative h-[520px] md:h-[600px] overflow-hidden">
// //         {HERO_IMAGES.map((img, i) => (
// //           <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}>
// //             <img src={img} alt="Fresh produce" className="w-full h-full object-cover" />
// //             <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
// //           </div>
// //         ))}
// //         <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
// //           <div className="max-w-xl animate-fade-in">
// //             <span className="inline-block bg-primary-500/20 text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-primary-400/30 mb-4">
// //               🌱 Fresh from Farm to Table
// //             </span>
// //             <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-4">
// //               Nature's Best,<br /><em className="text-primary-400">Delivered Fresh</em>
// //             </h1>
// //             <p className="text-gray-200 text-lg mb-8 leading-relaxed">
// //               Premium organic groceries sourced directly from certified farms. Free delivery on orders above ₹499.
// //             </p>
// //             <div className="flex flex-wrap gap-4">
// //               <button onClick={() => navigate('/products')} className="btn-primary text-base px-8 py-3 flex items-center gap-2">
// //                 Shop Now <FiArrowRight />
// //               </button>
// //               <button onClick={() => navigate('/products?filter=organic')} className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm border border-white/30">
// //                 Explore Organic
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //         {/* Dots */}
// //         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
// //           {HERO_IMAGES.map((_, i) => (
// //             <button key={i} onClick={() => setHeroIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'w-6 bg-white' : 'bg-white/50'}`} />
// //           ))}
// //         </div>
// //       </section>

// //       {/* Trust Badges */}
// //       <section className="bg-primary-600 text-white py-4">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             {[
// //               { icon: <FiTruck className="w-5 h-5" />, text: 'Free Delivery over ₹499' },
// //               { icon: <FiShield className="w-5 h-5" />, text: '100% Organic Certified' },
// //               { icon: '🌱', text: 'Farm Fresh Daily' },
// //               { icon: <FiRefreshCw className="w-5 h-5" />, text: 'Easy Returns' }
// //             ].map((b, i) => (
// //               <div key={i} className="flex items-center gap-3 justify-center">
// //                 <span className="text-primary-200">{b.icon}</span>
// //                 <span className="text-sm font-medium">{b.text}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Categories */}
// //       <section className="max-w-7xl mx-auto px-4 py-16">
// //         <div className="flex items-end justify-between mb-8">
// //           <div>
// //             <p className="text-primary-600 font-semibold text-sm mb-1">Browse by Category</p>
// //             <h2 className="text-3xl font-bold text-gray-900">Shop Fresh Categories</h2>
// //           </div>
// //           <Link to="/products" className="text-primary-600 font-semibold hover:underline flex items-center gap-1 text-sm">
// //             View All <FiArrowRight />
// //           </Link>
// //         </div>
// //         {loading ? <Loader /> : (
// //           <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
// //             {categories.map(cat => (
// //               <Link key={cat._id} to={`/products?category=${cat._id}`}
// //                 className="group text-center p-4 rounded-2xl bg-white hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all hover:-translate-y-1 shadow-sm">
// //                 <div className="text-4xl mb-2">{cat.icon}</div>
// //                 <p className="text-sm font-semibold text-gray-700 group-hover:text-primary-600">{cat.name}</p>
// //               </Link>
// //             ))}
// //           </div>
// //         )}
// //       </section>

// //       {/* Featured Products */}
// //       <section className="bg-gray-50 py-16">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="flex items-end justify-between mb-8">
// //             <div>
// //               <p className="text-primary-600 font-semibold text-sm mb-1">Handpicked For You</p>
// //               <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
// //             </div>
// //             <Link to="/products" className="text-primary-600 font-semibold hover:underline flex items-center gap-1 text-sm">
// //               See All <FiArrowRight />
// //             </Link>
// //           </div>
// //           {loading ? <Loader /> : (
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
// //               {featured.map(p => <ProductCard key={p._id} product={p} />)}
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* Banner */}
// //       <section className="max-w-7xl mx-auto px-4 py-16">
// //         <div className="relative bg-gradient-to-r from-primary-700 to-primary-500 rounded-3xl overflow-hidden px-8 md:px-16 py-12 text-white">
// //           <div className="relative z-10">
// //             <p className="text-primary-200 font-semibold mb-2">Limited Time Offer</p>
// //             <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% Off Your First Order</h2>
// //             <p className="text-primary-100 mb-6">Use code <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">FRESH20</span> at checkout</p>
// //             <button onClick={() => navigate('/products')} className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all active:scale-95">
// //               Shop & Save
// //             </button>
// //           </div>
// //           <div className="absolute right-8 bottom-0 text-[120px] opacity-20">🥑</div>
// //         </div>
// //       </section>

// //       {/* Testimonials */}
// //       <section className="bg-gray-50 py-16">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="text-center mb-12">
// //             <p className="text-primary-600 font-semibold text-sm mb-1">Customer Stories</p>
// //             <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             {TESTIMONIALS.map((t, i) => (
// //               <div key={i} className="card p-6">
// //                 <div className="flex gap-1 mb-4">
// //                   {Array(t.rating).fill(0).map((_, j) => <FiStar key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
// //                 </div>
// //                 <p className="text-gray-600 mb-5 leading-relaxed italic">"{t.text}"</p>
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">{t.avatar}</div>
// //                   <div>
// //                     <p className="font-semibold text-gray-900">{t.name}</p>
// //                     <p className="text-xs text-gray-400">Verified Customer</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
// import { getProducts, getCategories } from '../services/api';
// import ProductCard from '../components/common/ProductCard';
// import { Loader } from '../components/common/Loader';

// // ✅ HERO IMAGE
// import heroImg from '../assets/amala-heroimg.png';

// export default function HomePage() {
//   const [featured, setFeatured] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [prodsRes, catsRes] = await Promise.all([
//           getProducts({ featured: true, limit: 8 }),
//           getCategories()
//         ]);
//         setFeatured(prodsRes.data.products);
//         setCategories(catsRes.data.categories);
//       } catch (err) {
//         console.log(err);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* 🔥 HERO SECTION (HEIGHT INCREASED) */}
//       <section className="relative h-[950px] md:h-[1250px] overflow-hidden">

//         {/* Image */}
//         <img
//           src={heroImg}
//           alt="Vallal Food Products"
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         {/* Gradient Overlay */}


//         {/* Content */}

//       </section>

//       {/* 🔒 TRUST BADGES */}
//       {/* <section className="bg-green-600 text-white py-4">
//         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-4 text-sm">
//           <div className="flex items-center justify-center gap-2">
//             <FiTruck /> Free Delivery
//           </div>
//           <div className="flex items-center justify-center gap-2">
//             <FiShield /> 100% Organic
//           </div>
//           <div>🌱 No Chemicals</div>
//           <div className="flex items-center justify-center gap-2">
//             <FiRefreshCw /> Easy Returns
//           </div>
//         </div>
//       </section> */}

//       {/* 🛍️ CATEGORIES */}
//       {/* <section className="max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-2xl font-bold mb-6">Shop Categories</h2>

//         {loading ? <Loader /> : (
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {categories.map(cat => (
//               <Link
//                 key={cat._id}
//                 to={`/products?category=${cat._id}`}
//                 className="bg-white p-4 rounded-xl shadow hover:scale-105 transition"
//               >
//                 <img
//                   src={cat.image}
//                   className="h-20 w-full object-cover rounded mb-2"
//                 />
//                 <p className="text-center font-medium">{cat.name}</p>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section> */}

//       {/* ⭐ FEATURED PRODUCTS */}
//       <section className="bg-gradient-to-b from-white to-green-50 py-20">
//   <div className="max-w-7xl mx-auto px-4">

//     {/* Header */}
//     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
//       <div>
//         <p className="text-green-600 font-semibold text-sm mb-1">
//           🌿 Fresh from Vallal Kitchen
//         </p>
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//           Featured Products
//         </h2>
//       </div>

//       <Link
//         to="/products"
//         className="text-green-600 font-semibold hover:underline"
//       >
//         View All →
//       </Link>
//     </div>

//     {/* Products */}
//     {loading ? <Loader /> : (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {featured.map(p => (
//           <ProductCard key={p._id} product={p} />
//         ))}
//       </div>
//     )}

//   </div>
// </section>

//       {/* 🌿 WHY VALLAL */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 text-center px-4">

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="font-bold text-lg">🌱 100% Natural</h3>
//             <p className="text-gray-600 text-sm">No chemicals, no preservatives</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="font-bold text-lg">👩‍🍳 Homemade</h3>
//             <p className="text-gray-600 text-sm">Traditional preparation methods</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="font-bold text-lg">🚚 Fast Delivery</h3>
//             <p className="text-gray-600 text-sm">Safe doorstep delivery</p>
//           </div>

//         </div>
//       </section>

//       {/* ⭐ REVIEWS */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 text-center">

//           <h2 className="text-2xl font-bold mb-10">Customer Reviews</h2>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               { name: 'Dheena', text: 'Very natural and fresh products!', rating: 5 },
//               { name: 'Priya', text: 'Loved the quality and delivery!', rating: 5 },
//               { name: 'Rahul', text: 'Best organic store online!', rating: 4 }
//             ].map((r, i) => (
//               <div key={i} className="bg-gray-50 p-6 rounded-xl shadow">

//                 <div className="flex justify-center mb-2">
//                   {[...Array(r.rating)].map((_, i) => (
//                     <FiStar key={i} className="text-yellow-400 fill-yellow-400" />
//                   ))}
//                 </div>

//                 <p className="text-gray-600 italic mb-3">"{r.text}"</p>
//                 <p className="font-semibold">{r.name}</p>

//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { Loader } from '../components/common/Loader';

// HERO IMAGE
import heroImg from '../assets/amala-heroimg.png';
import heroImg1 from '../assets/amala-heroimg1.png';
import storyImg from '../assets/home-kitchen.png';
import naturalfood from '../assets/natural-food.png';
import homemadecooking from '../assets/homemade-cooking.png';
import FastDelivery from '../assets/FastDelivery.png';
import reviewImg from '../assets/reviewImg.png';
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
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
        const [prodsRes, catsRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getCategories()
        ]);

        let featuredProducts = prodsRes.data.products || [];

        if (featuredProducts.length < 8) {
          const fillerRes = await getProducts({ limit: 8 });
          const fillerProducts = (fillerRes.data.products || []).filter(
            product => !featuredProducts.some(featuredProduct => featuredProduct._id === product._id)
          );

          featuredProducts = [...featuredProducts, ...fillerProducts].slice(0, 8);
        }

        setFeatured(featuredProducts);
        setCategories(catsRes.data.categories);

        // ✅ Extract real reviews from products
        const allReviews = featuredProducts.flatMap(product =>
          (product.reviews || []).map(r => ({
            name: r.name,
            text: r.comment,
            rating: r.rating
          }))
        );

        setReviews(allReviews.slice(0, 6)); // show max 6 reviews

      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* 🔥 HERO SECTION */}
      <section className="relative min-h-[70vh] md:min-h-[140vh] w-full overflow-hidden">

        {/* Image */}
        <img
          src={heroImg}
          alt="Vallal Food Products"
          className="lg:block absolute hidden  inset-0 w-full h-full object-fit max-w-full  mx-auto"
        />
        <img
          src={heroImg1}
          alt="Vallal Food Products"
          className="absolute lg:hidden block inset-0 w-full h-full max-w-full  mx-auto"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        {/* <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
          <div className="max-w-xl text-white">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
              Fresh & Natural Food Products
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-200">
              Healthy homemade products directly from Vallal kitchen
            </p>

            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              Shop Now
            </button>
          </div>
        </div> */}
      </section>

      {/* ⭐ FEATURED PRODUCTS */}
      <section className="bg-gradient-to-b from-white to-green-50 py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <p className="text-green-600 font-semibold text-sm mb-1">
                🌿 Fresh from Vallal Food
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-green-600 font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Products */}
          {loading ? <Loader /> : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 🌿 WHY VALLAL */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Why Choose Vallal?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 min-h-[400px] flex flex-col">

              <img
                src={naturalfood}
                alt="Natural Food"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-xl mb-2">100% Natural</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No chemicals, no preservatives — just pure goodness.
                </p>
              </div>

            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 min-h-[400px] flex flex-col">

              <img
                src={homemadecooking}
                alt="Homemade Cooking"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-xl mb-2">Homemade</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Prepared using traditional and authentic methods.
                </p>
              </div>

            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 min-h-[400px] flex flex-col">

              <img
                src={FastDelivery}
                alt="Fast Delivery"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Quick, safe, and reliable doorstep delivery.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ⭐ REVIEWS */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

          {/* 🖼️ LEFT IMAGE */}






          {/* ⭐ RIGHT CONTENT */}
          <div className="text-center md:text-left">

            <p className="text-green-600 font-semibold text-sm mb-2">
              ⭐ Testimonials
            </p>

            <h2 className="text-2xl md:text-4xl font-bold mb-8">
              What Our Customers Say
            </h2>

            {reviews.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border">

                {/* ⭐ Stars */}
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      className={`text-lg ${index < (currentReview?.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                {/* 💬 Review */}
                <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                  “{currentReview?.text || "Very tasty and fresh product"}”
                </p>

                {/* 👤 User */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    {(currentReview?.name || "H")[0]}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {currentReview?.name || "Happy Customer"}
                    </p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>

              </div>
            )}

            {/* 🔘 Dots */}
            <div className="flex justify-center md:justify-start mt-6 gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full ${current === i ? "bg-green-600 w-4" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>

          </div>
          <img
            src={reviewImg}
            alt="Happy customers enjoying Vallal food"
            className="max-h-full max-w-full object-contain rounded-3xl transition duration-500"
          />



        </div>
      </section>

      {/* 🌿 OUR STORY / REAL EXPERIENCE */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

          {/* 🖼️ Image Side */}
          <div className="relative">
            <img
              src={storyImg}// replace with your real image
              alt="Homemade Vallal Kitchen"
              className="rounded-3xl shadow-lg object-cover w-full h-[350px] md:h-[450px]"
            />

            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow text-sm font-semibold">
              👩‍🍳 Made Fresh Daily
            </div>
          </div>

          {/* ✨ Content Side */}
          <div>
            <p className="text-green-600 font-semibold text-sm mb-2">
              🌿 Our Promise
            </p>

            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-snug">
              From Our Kitchen <br /> To Your Home
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              At Vallal Food, every product is prepared with care, just like how we cook for our own family.
              We use traditional recipes, natural ingredients, and zero chemicals — ensuring pure taste and health.
            </p>

            <p className="text-gray-500 text-sm mb-6">
              No shortcuts. No preservatives. Only real food made with love.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"
            >
              Explore Products →
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
