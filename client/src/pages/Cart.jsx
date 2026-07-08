import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 10;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal + shipping - discountAmount;

  const handleQuantityChange = async (productId, currentQty, dir, maxStock) => {
    let newQty = currentQty;
    if (dir === 'dec') {
      newQty = currentQty - 1;
    } else if (dir === 'inc') {
      newQty = currentQty + 1;
    }

    if (newQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }

    try {
      await addToCart(productId, newQty);
    } catch (e) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.info('Item removed from cart');
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      toast.success('Coupon WELCOME20 applied! 20% discount added.');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      toast.info('Please sign in to proceed with checkout.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      // Pass discountPercent to checkout state so it persists
      navigate('/checkout', { state: { discountPercent } });
    }
  };

  if (cart.products.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Your cart is empty</h2>
        <p className="text-slate-500 text-sm">
          Browse our shop to find premium electronics, clothes, accessories, and home items.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
            {cart.products.map((item) => {
              const prod = item.product;
              if (!prod) return null;
              
              const itemFinalPrice = prod.price * (1 - (prod.discount || 0) / 100);

              return (
                <div
                  key={prod._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 dark:border-slate-800">
                      <img src={prod.images?.[0]} alt={prod.title} className="h-full w-full object-cover" />
                    </div>

                    {/* Title & Info */}
                    <div>
                      <Link to={`/product/${prod._id}`} className="text-sm font-bold text-slate-800 dark:text-white hover:text-primary-500 line-clamp-1">
                        {prod.title}
                      </Link>
                      <span className="text-xs text-slate-400 block mt-0.5">{prod.category}</span>
                      
                      {/* Price */}
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block sm:hidden mt-1">
                        ${itemFinalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Price Desktop */}
                    <span className="hidden sm:block text-sm font-semibold text-slate-800 dark:text-white">
                      ${itemFinalPrice.toFixed(2)}
                    </span>

                    {/* Selector */}
                    <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-dark-800">
                      <button
                        onClick={() => handleQuantityChange(prod._id, item.quantity, 'dec', prod.stock)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-700"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(prod._id, item.quantity, 'inc', prod.stock)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-700"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(prod._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={clearCart}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Clear Shopping Bag
          </button>
        </div>

        {/* Order Summary Summary Panel */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
            <h3 className="font-extrabold text-slate-800 dark:text-white">Order Summary</h3>

            {/* Calculations */}
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount (20% off)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-800 dark:border-slate-800 dark:text-white">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutRedirect}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 shadow-md"
            >
              Proceed to Checkout
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Coupon Entry */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-dark-900">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Apply Promo Code</h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2 mt-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="WELCOME20"
                disabled={couponApplied}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm uppercase dark:border-slate-700 dark:bg-dark-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={couponApplied}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-900 disabled:bg-slate-200"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
