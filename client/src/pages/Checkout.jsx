import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      address: '123 E-Commerce Way',
      city: 'Tech City',
      state: 'Silicon Valley',
      postalCode: '94025',
      country: 'USA'
    }
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve discount code details from router state
  const discountPercent = location.state?.discountPercent || 0;
  
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 99 ? 0 : 10;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal + shipping - discountAmount;

  const onSubmit = async (shippingAddress) => {
    setIsSubmitting(true);
    try {
      let paymentResult = undefined;
      
      // Simulated Stripe transaction
      if (paymentMethod === 'Stripe') {
        paymentResult = {
          id: `ch_${Math.random().toString(36).substr(2, 9)}`,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: 'stripe_mock@shopsphere.com'
        };
        // Artificial delay for Stripe card authorization
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const { data } = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        paymentResult
      });

      if (data.success && data.order) {
        toast.success('Order placed successfully!');
        clearCart(); // clear client cart state
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping details and Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary-500" />
              Shipping Address
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase">Street Address</label>
                <input
                  type="text"
                  {...register('address', { required: 'Street address is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">State / Province</label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.state && <span className="text-xs text-red-500">{errors.state.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Postal Code</label>
                <input
                  type="text"
                  {...register('postalCode', { required: 'Postal code is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.postalCode && <span className="text-xs text-red-500">{errors.postalCode.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Country</label>
                <input
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.country && <span className="text-xs text-red-500">{errors.country.message}</span>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-500" />
              Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD option */}
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Cash on Delivery</span>
                  <span className="text-xs text-slate-500 mt-0.5">Pay with cash upon package delivery.</span>
                </div>
              </label>

              {/* Stripe option */}
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'Stripe'
                  ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Stripe'}
                  onChange={() => setPaymentMethod('Stripe')}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Credit Card (Stripe)</span>
                  <span className="text-xs text-slate-500 mt-0.5">Pay securely with Visa, Mastercard, etc.</span>
                </div>
              </label>
            </div>

            {/* Simulated Stripe Inputs */}
            {paymentMethod === 'Stripe' && (
              <div className="mt-4 border-t border-slate-100 pt-4 space-y-3 dark:border-slate-800 animate-fade-in">
                <span className="block text-xs font-semibold text-primary-500 uppercase tracking-wide">Simulated Card Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Card Number (4242 4242 4242 4242)"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Breakdown Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
          <h3 className="font-extrabold text-slate-800 dark:text-white">Checkout Invoice</h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cart.products.map((item) => (
              <div key={item.product._id} className="flex justify-between gap-4 text-xs">
                <div className="flex gap-2">
                  <span className="font-bold text-slate-800 dark:text-white">{item.quantity}x</span>
                  <span className="text-slate-500 line-clamp-1">{item.product.title}</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">
                  ${(item.product.price * (1 - (item.product.discount || 0) / 100) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-800 dark:text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-800 dark:border-slate-800 dark:text-white">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:bg-primary-400"
          >
            {isSubmitting ? 'Processing Payment...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
