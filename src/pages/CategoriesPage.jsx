import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/seo/Seo';
import { Loader } from '../components/common/Loader';
import { getCategories } from '../services/api';
import { buildBreadcrumbSchema } from '../seo/schema';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((response) => {
        if (!active) return;
        setCategories(response.data.categories || []);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <Seo
        title="Categories"
        description="Browse product categories from Vallal Food Products and explore homemade foods, grocery essentials, and natural staples."
        keywords="Vallal Food categories, homemade food categories, grocery categories, natural products"
        path="/categories"
        schema={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Categories', path: '/categories' }
          ])
        ]}
      />

      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">Shop by category</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Browse all product categories</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Explore every active category available on Vallal Food Products and jump straight into dedicated category pages with clean SEO-friendly URLs.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">No categories available right now.</p>
          <p className="mt-2 text-sm text-gray-500">Add active categories in the admin panel and they will automatically appear here and in the sitemap.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-6xl">
                  {category.icon || 'Shop'}
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {category.description || `Explore products listed under ${category.name}.`}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                  View category
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
