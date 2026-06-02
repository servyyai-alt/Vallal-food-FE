import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { getCategories, getProducts } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema } from '../seo/schema';

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse">
          <div className="mb-4 h-40 rounded-xl bg-gray-200" />
          <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-10 rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex gap-6">
      <aside className="hidden w-56 flex-shrink-0 md:block">
        <div className="card sticky top-24 p-5 animate-pulse">
          <div className="mb-5 h-6 rounded bg-gray-200" />
          <div className="mb-3 h-10 rounded bg-gray-200" />
          <div className="mb-3 h-10 rounded bg-gray-200" />
          <div className="mb-3 h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </div>
      </aside>

      <div className="flex-1">
        <ProductsSkeleton />
      </div>
    </div>
  );
}

const getFiltersFromParams = searchParams => ({
  search: searchParams.get('search') || '',
  category: searchParams.get('category') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  rating: searchParams.get('rating') || '',
  sort: searchParams.get('sort') || ''
});

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams));
  const [priceDraft, setPriceDraft] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });
  const hasIndexBlockingFilters = Boolean(
    filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.sort || page > 1
  );
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' }
  ]);

  useEffect(() => {
    getCategories()
      .then(response => setCategories(response.data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const nextFilters = getFiltersFromParams(searchParams);
    const nextPage = Number(searchParams.get('page') || 1);

    setFilters(current => {
      const unchanged = Object.keys(nextFilters).every(key => current[key] === nextFilters[key]);
      return unchanged ? current : nextFilters;
    });

    setPriceDraft(current => {
      if (current.minPrice === nextFilters.minPrice && current.maxPrice === nextFilters.maxPrice) {
        return current;
      }

      return {
        minPrice: nextFilters.minPrice,
        maxPrice: nextFilters.maxPrice
      };
    });

    setPage(current => (current === nextPage ? current : nextPage));
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (filters.search) nextParams.set('search', filters.search);
    if (filters.category) nextParams.set('category', filters.category);
    if (filters.minPrice) nextParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) nextParams.set('maxPrice', filters.maxPrice);
    if (filters.rating) nextParams.set('rating', filters.rating);
    if (filters.sort) nextParams.set('sort', filters.sort);
    if (page > 1) nextParams.set('page', String(page));

    if (searchParams.toString() !== nextParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, page, searchParams, setSearchParams]);

  useEffect(() => {
    let active = true;

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
        if (!active) return;

        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch {
        if (!active) return;
        setProducts([]);
        setTotal(0);
        setPages(1);
      } finally {
        if (!active) return;
        setLoading(false);
        setPageReady(true);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [filters, page]);

  const updateFilter = (key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: ''
    });
    setPriceDraft({
      minPrice: '',
      maxPrice: ''
    });
    setPage(1);
  };

  const applyPriceFilter = () => {
    setFilters(current => ({
      ...current,
      minPrice: priceDraft.minPrice,
      maxPrice: priceDraft.maxPrice
    }));
    setPage(1);
  };

  const renderFilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', '')}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              !filters.category
                ? 'bg-primary-100 font-semibold text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>

          {categories.map(category => (
            <button
              key={category._id}
              onClick={() => updateFilter('category', category._id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                filters.category === category._id
                  ? 'bg-primary-100 font-semibold text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Price Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">Min Price</label>
            <input
              type="number"
              min="0"
              placeholder="Rs 0"
              value={priceDraft.minPrice}
              onChange={e => setPriceDraft(current => ({ ...current, minPrice: e.target.value }))}
              className="input-field py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">Max Price</label>
            <input
              type="number"
              min="0"
              placeholder="Rs 1000"
              value={priceDraft.maxPrice}
              onChange={e => setPriceDraft(current => ({ ...current, maxPrice: e.target.value }))}
              className="input-field py-2 text-sm"
            />
          </div>
        </div>

        <button onClick={applyPriceFilter} className="btn-primary mt-3 w-full py-2 text-sm">
          Apply Price Filter
        </button>
      </div>
{/* 
      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Min Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map(rating => (
            <button
              key={rating}
              onClick={() => updateFilter('rating', filters.rating == rating ? '' : String(rating))}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                filters.rating == rating
                  ? 'bg-primary-100 font-semibold text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {'*'.repeat(rating)} & above
            </button>
          ))}
        </div>
      </div> */}

      <button onClick={clearFilters} className="btn-outline w-full py-2 text-sm">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title={filters.search ? `Search results for ${filters.search}` : 'Browse Products'}
        description={filters.search
          ? `Browse search results for ${filters.search} on Vallal Food Products.`
          : 'Browse Vallal Food Products for homemade foods, natural staples, and fresh grocery items.'}
        keywords="Vallal products, homemade foods, grocery catalog, natural food products, fresh groceries"
        path="/products"
        robots={hasIndexBlockingFilters ? 'noindex,follow' : undefined}
        schema={[breadcrumbSchema]}
      />
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {filters.search ? `Results for "${filters.search}"` : 'Vallal Food Products'}
          <span className="ml-2 text-lg font-normal text-gray-400">({total})</span>
        </h1>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <select
            value={filters.sort}
            onChange={e => updateFilter('sort', e.target.value)}
            className="input-field flex-1 py-2 text-sm md:w-auto"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm md:hidden"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {loading && !pageReady ? (
        <PageLoading />
      ) : (
        <div className="flex gap-6">
          <aside className="hidden w-56 flex-shrink-0 md:block">
            <div className="card sticky top-24 p-5">{renderFilterPanel()}</div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto bg-white p-6 animate-slide-up">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                {renderFilterPanel()}
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <ProductsSkeleton />
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mb-4 text-6xl">No items</div>
                <p className="text-lg text-gray-500">No products found</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors ${
                          pageNumber === page
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
