// import { Link } from 'react-router-dom';
// import logo from '../../assets/logo.jpeg';
// import Least from '../../assets/Leastactionlogo.png';

// const shopAddress = '22, Tharmasalai Veethi, Vadalur, Kurinjipadi Tk, Cuddalore Dt';
// const mapQuery = encodeURIComponent(shopAddress);

// export default function Footer() {
//   return (
//     <footer className="mt-auto bg-gray-900 pt-16 pb-8 text-gray-300">
//       <div className="mx-auto max-w-7xl px-4">
//         <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_1.8fr] xl:items-start">
//           <div>
//             <div className="mb-4 flex items-center gap-2">
//               <img src={logo} alt="FreshMart" className="h-12 w-auto rounded-md object-contain" />
//             </div>
//             <p className="text-sm leading-relaxed text-gray-400">
//               Farm-fresh groceries delivered to your doorstep. We source directly from farmers for maximum freshness.
//             </p>
//           </div>

//           <div>
//             <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
//             <ul className="space-y-2 text-sm">
//               {[['/', 'Home'], ['/products', 'Shop All'], ].map(([to, label]) => (
//                 <li key={to}>
//                   <Link to={to} className="transition-colors hover:text-primary-400">
//                     {label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="mb-4 font-semibold text-white">Account</h4>
//             <ul className="space-y-2 text-sm">
//               {[['/login', 'Login'], ['/register', 'Sign Up'], ['/profile', 'My Profile'], ['/orders', 'My Orders'], ['/wishlist', 'Wishlist']].map(([to, label]) => (
//                 <li key={to}>
//                   <Link to={to} className="transition-colors hover:text-primary-400">
//                     {label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="mb-4 font-semibold text-white">Contact</h4>
//             <div className="space-y-2 text-sm text-gray-400">
//               <p>hello@freshmart.com</p>
//               <p>+91 98422 09470</p>
//               <p>Mon-Sat: 8AM - 8PM</p>
//               <Link to="/contact" className="mt-3 inline-block font-medium text-primary-400 hover:text-primary-300">
//                 Contact Support
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h4 className="mb-4 font-semibold text-white">Shop Location</h4>
//             <div className="space-y-3 text-sm text-gray-400">
//               <p>{shopAddress}</p>
//               <div className="overflow-hidden rounded-2xl border border-gray-800">
//                 <iframe
//                   title="Vallal Food Shop Location"
//                   src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
//                   className="h-56 w-full"
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 />
//               </div>
//               <a
//                 href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block font-medium text-primary-400 transition-colors hover:text-primary-300"
//               >
//                 Open in Google Maps
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row">
//           <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row">
//             <div className="flex items-center gap-3">
//               <img
//                 src={Least}
//                 alt="Least Action"
//                 className="h-8 w-auto rounded object-contain"
//               />

//               <p>
//                 Powered by{" "}
//                 <a
//                   href="https://leastactioncompany.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="font-semibold text-white hover:text-green-400 transition"
//                 >
//                   Least Action Company
//                 </a>
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <span>Secure Payments</span>
//             <span>100% Organic Options</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpeg';
import Least from '../../assets/Leastactionlogo.png';

const shopAddress = '22, Tharmasalai Veethi, Vadalur, Kurinjipadi Tk, Cuddalore Dt';
const mapQuery = encodeURIComponent(shopAddress);

export default function Footer() {
  const { user, isAdmin } = useAuth();

  return (
    <footer className="mt-auto bg-gray-900 pt-16 pb-8 text-gray-300">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_1.8fr] xl:items-start">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src={logo} alt="FreshMart" className="h-12 w-auto rounded-md object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Farm-fresh groceries delivered to your doorstep. We source directly from farmers for maximum freshness.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/products', 'Shop All'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-primary-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Account</h4>

            {!user ? (
              <ul className="space-y-2 text-sm">
                {[
                  ['/login', 'Login'],
                  ['/register', 'Sign Up'],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="transition-colors hover:text-primary-400">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : isAdmin ? (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/admin/dashboard" className="transition-colors hover:text-primary-400">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm">
                {[
                  ['/profile', 'My Profile'],
                  ['/orders', 'My Orders'],
                  ['/wishlist', 'Wishlist'],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="transition-colors hover:text-primary-400">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>hello@freshmart.com</p>
              <p>+91 98422 09470</p>
              <p>Mon-Sat: 8AM - 8PM</p>
              <Link to="/contact" className="mt-3 inline-block font-medium text-primary-400 hover:text-primary-300">
                Contact Support
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Shop Location</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>{shopAddress}</p>
              <div className="overflow-hidden rounded-2xl border border-gray-800">
                <iframe
                  title="Vallal Food Shop Location"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium text-primary-400 transition-colors hover:text-primary-300"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={Least} alt="Least Action" className="h-8 w-auto rounded object-contain" />
            <p>
              Powered by{' '}
              <a
                href="https://leastactioncompany.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-green-400 transition"
              >
                Least Action Company
              </a>
            </p>
          </div>

          <div className="flex gap-4">
            <span>Secure Payments</span>
            <span>100% Organic Options</span>
          </div>
        </div>
      </div>
    </footer>
  );
}