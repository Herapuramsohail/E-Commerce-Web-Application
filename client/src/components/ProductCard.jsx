import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  const hasDiscount = product.discount > 0;
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error('Out of stock!');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isWishlisted) {
      toast.info(`${product.title} removed from wishlist`);
    } else {
      toast.success(`${product.title} saved to wishlist!`);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-dark-900">
      
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-100 aspect-square">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400'}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 dark:bg-dark-900/90 dark:text-slate-400"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            {product.discount}% OFF
          </span>
        )}

        {/* Stock status overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {product.category}
        </span>

        {/* Title */}
        <Link to={`/product/${product._id}`} className="mt-1 block text-sm font-semibold text-slate-800 dark:text-white line-clamp-1 hover:text-primary-500">
          {product.title}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-800 dark:text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-800 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-dark-800 dark:disabled:text-slate-600"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
