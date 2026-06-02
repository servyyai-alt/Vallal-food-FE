import { FiCheckCircle, FiMapPin, FiPhoneCall, FiShield } from 'react-icons/fi';
import Seo from '../components/seo/Seo';
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from '../seo/schema';
import storyImg from '../assets/home-kitchen.png';

const highlights = [
  {
    title: 'Traditional Preparation',
    description: 'Recipes are prepared with a homemade approach that keeps taste, freshness, and consistency at the center.',
    icon: FiCheckCircle
  },
  {
    title: 'Trusted Ingredients',
    description: 'We focus on natural ingredients and daily essentials that families can order with confidence.',
    icon: FiShield
  },
  {
    title: 'Local Service',
    description: 'Vallal Food Products serves customers from Vadalur with a strong focus on responsive support and careful delivery.',
    icon: FiMapPin
  }
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-green-50">
      <Seo
        title="About Us"
        description="Learn about Vallal Food Products, our homemade food philosophy, natural ingredients, and customer-first service in Vadalur."
        keywords="about Vallal Food Products, homemade foods Vadalur, natural food store, Vallal foods story"
        path="/about"
        schema={[
          buildLocalBusinessSchema(),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About Us', path: '/about' }
          ])
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">About Vallal Food</p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Homemade quality, natural ingredients, and dependable service.
          </h1>
          <p className="mt-5 text-base leading-7 text-gray-600">
            Vallal Food Products is built around the idea that everyday food should feel fresh, trustworthy, and thoughtfully prepared.
            We bring together homemade favorites, natural staples, and grocery essentials for customers who value quality and care.
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600">
            From product selection to doorstep delivery, our focus is simple: make it easier for families to shop confidently from a local brand that values taste, consistency, and support.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-xl">
          <img
            src={storyImg}
            alt="Vallal Food Products kitchen story"
            loading="eager"
            decoding="async"
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-green-100 p-3 text-green-700">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] bg-gray-900 px-6 py-8 text-white md:px-10">
          <h2 className="text-2xl font-semibold">Visit or Contact Us</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
            Vallal Food Products, 22 Tharmasalai Veethi, Vadalur, Kurinjipadi Tk, Cuddalore Dt. For assistance, call +91 98422 09470.
          </p>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
          >
            <FiPhoneCall className="h-4 w-4" />
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}
