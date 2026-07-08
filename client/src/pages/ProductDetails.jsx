import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, Shield, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      if (data.success) {
        setProduct(data.product);
        setMainImage(data.product.images[0] || '');
      }
    } catch (err) {
      console.error('Failed to load product details', err);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) return null;

  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  const hasDiscount = product.discount > 0;
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;

  const handleQuantityChange = (dir) => {
    if (dir === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (dir === 'inc' && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async (shouldRedirect = false) => {
    if (isOutOfStock) return;
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.title} added to cart!`);
      if (shouldRedirect) {
        navigate('/cart');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    setReviewSubmitting(true);
    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, {
        rating,
        comment
      });
      if (data.success) {
        toast.success('Review added successfully!');
        setComment('');
        setRating(5);
        fetchProduct(); // reload reviews
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
        
        {/* Images Column */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-slate-100 aspect-square border border-slate-200 dark:border-slate-800">
            <img
              src={mainImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition-all ${
                    mainImage === img ? 'border-primary-500 scale-95' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            {/* Category */}
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {product.category}
            </span>
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              {product.title}
            </h1>
            {/* Rating summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {product.rating.toFixed(1)} / 5.0 ({product.reviews?.length || 0} customer reviews)
              </span>
            </div>
          </div>

          <div className="border-t border-b border-slate-100 py-4 dark:border-slate-800">
            {/* Prices */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/20">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Inventory Status */}
            <div className="mt-3 flex items-center gap-1.5 text-sm">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  Only {product.stock} items left in stock - order soon!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                  In Stock ({product.stock} items available)
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity selector & Action Buttons */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-dark-800">
                  <button
                    onClick={() => handleQuantityChange('dec')}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800 dark:text-slate-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold dark:text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('inc')}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800 dark:text-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                
                <button
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-900 transition-colors"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product);
                    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
                  }}
                  className={`rounded-xl border p-3 transition-colors ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Small guarantees footer */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-400 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-4 w-4 text-primary-500 mb-1" />
              1 Year Warranty
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="h-4 w-4 text-primary-500 mb-1" />
              30 Days Returns
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="h-4 w-4 text-primary-500 mb-1" />
              100% Certified
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review Form or rating summary */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Customer Reviews</h2>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900">
              <h3 className="font-bold text-slate-800 dark:text-white">Write a Review</h3>
              
              {/* Star selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-amber-400 transition-transform hover:scale-110"
                    >
                      <Star className={`h-6 w-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Your Review</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:bg-primary-400"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-dark-900/40">
              <p className="text-sm text-slate-500">Please sign in to write a review.</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-3 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white">Recent Customer Feedback</h3>
          
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-dark-900 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{rev.name}</span>
                    <span className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Stars */}
                  <div className="mt-1 flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-800'}`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
