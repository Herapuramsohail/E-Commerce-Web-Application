import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6">
        <Heart className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Your wishlist is empty</h2>
        <p className="text-slate-500 text-sm">
          Bookmark items you like by clicking the heart button to save them here.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-md"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">My Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">Review items you've bookmarked for later purchase.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
