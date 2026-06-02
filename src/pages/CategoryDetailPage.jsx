import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import Seo from '../components/seo/Seo';
import { Loader } from '../components/common/Loader';
import { getCategories, getProducts } from '../services/api';
import { buildBreadcrumbSchema } from '../seo/schema';

export default function CategoryDetailPage() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((response) => {
        if (!active) return;
        const nextCategories = response.data.categories || [];
        setCategories(nextCategories);
        setCategory(nextCategories.find((item) => item.slug === slug) || null);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setCategory(null);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    setPage(1);
  }, [slug]);

  useEffect(() => {
    let active = true;

    if (!category?._id) {
      setProducts([]);
      setPages(1);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    getProducts({ category: category._id, page, limit: 12 })
      .then((response) => {
        if (!active) return;
        setProducts(response.data.products || []);
        setPages(response.data.pages || 1);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setPages(1);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category?._id, page]);

  const breadcrumbSchema = useMemo(
    () =>
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: category?.name || slug, path: `/categories/${slug}` }
      ]),
    [category?.name, slug]
  );

  if (loading) {
    return <Loader />;
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Seo
          title="Category Not Found"
          description="The category you requested could not be found on Vallal Food Products."
          path={`/categories/${slug}`}
          robots="noindex,follow"
        />
        <h1 className="text-3xl font-bold text-gray-900">Category not found</h1>
        <p className="mt-3 text-gray-600">This category does not exist or is no longer active.</p>
        <Link to="/categories" className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white">
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo
        title={category.name}
        description={category.description || `Browse ${category.name} products from Vallal Food Products.`}
        keywords={`${category.name}, Vallal Food Products, category page`}
        path={`/categories/${category.slug}`}
        image={category.image}
        schema={[breadcrumbSchema]}
      />

      <Link
        to="/categories"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm">
        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Category</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">{category.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              {category.description || `Explore the latest products available in ${category.name}.`}
            </p>
          </div>

          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="eager"
              decoding="async"
              className="h-full min-h-[260px] w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[260px] items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-7xl">
              {category.icon || 'Shop'}
            </div>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">No active products found in this category.</p>
          <p className="mt-2 text-sm text-gray-500">Products added to this category will automatically appear here and in the sitemap.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => (
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
  );
}
