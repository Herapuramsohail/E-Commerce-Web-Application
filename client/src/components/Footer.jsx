import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-dark-900 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
              ShopSphere
            </span>
            <p className="text-sm">
              Your one-stop destination for premium electronics, fashion accessories, home essentials, and more. Crafted for perfection.
            </p>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white">
              Shop Categories
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/shop?category=Electronics" className="hover:text-primary-500">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion" className="hover:text-primary-500">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-primary-500">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home%20%26%20Kitchen" className="hover:text-primary-500">
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-primary-500">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-500">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-500">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-500">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white">
              Subscribe to Newsletter
            </h3>
            <p className="text-sm">
              Get updates on new collections, exclusive sales, and seasonal discount offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs dark:border-slate-800">
          <p>&copy; {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Created by Antigravity AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
