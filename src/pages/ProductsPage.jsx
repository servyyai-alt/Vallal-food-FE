import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { Loader } from '../components/common/Loader';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    rating: '', sort: ''
  });

  useEffect(() => { getCategories().then(r => setCategories(r.data.categories)).catch(() => {}); }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;
      if (filters.sort) params.sort = filters.sort;
      try {
        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch {}
      setLoading(false);
    };
    fetchProducts();
  }, [filters, page]);

  const updateFilter = (key, value) => { setFilters(f => ({ ...f, [key]: value })); setPage(1); };
  const clearFilters = () => { setFilters({ search: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: '' }); setPage(1); };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        {/* <h3 className="font-semibold text-gray-800 mb-3">Category</h3> */}
        {/* <div className="space-y-2">
          <button onClick={() => updateFilter('category', '')} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}>All Categories</button>
          {categories.map(cat => (
            <button key={cat._id} onClick={() => updateFilter('category', cat._id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.category === cat._id ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div> */}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="input-field" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="input-field" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Min Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <button key={r} onClick={() => updateFilter('rating', filters.rating == r ? '' : r)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.rating == r ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}>
              {'⭐'.repeat(r)} & above
            </button>
          ))}
        </div>
      </div>
      <button onClick={clearFilters} className="w-full btn-outline text-sm py-2">Clear All Filters</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
  
  {/* First Line - Heading */}
  <h1 className="text-2xl font-bold text-gray-900">
    {filters.search ? `Results for "${filters.search}"` : 'Fresh Groceries'}
    <span className="text-gray-400 text-lg font-normal ml-2">
      ({total})
    </span>
  </h1>

  {/* Second Line - Sort & Filter */}
  <div className="flex items-center gap-3 w-full md:w-auto">
    <select
      value={filters.sort}
      onChange={e => updateFilter('sort', e.target.value)}
      className="input-field flex-1 md:w-auto text-sm py-2"
    >
      <option value="">Sort By</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
      <option value="name">Name A-Z</option>
    </select>

    <button
      onClick={() => setShowFilters(!showFilters)}
      className="md:hidden flex items-center gap-2 btn-outline text-sm py-2 px-4 whitespace-nowrap"
    >
      <FiFilter /> Filters
    </button>
  </div>

</div>

      {/* Search on mobile */}
      <div className="md:hidden mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search products..." value={filters.search}
            onChange={e => updateFilter('search', e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters - Desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24"><FilterPanel /></div>
        </aside>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)}><FiX className="w-5 h-5" /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? <Loader /> : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-500 text-lg">No products found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors ${p === page ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
