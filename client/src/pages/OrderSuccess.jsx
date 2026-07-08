import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Calendar, CreditCard, MapPin, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Thank you card */}
      <div className="text-center space-y-3">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Thank You for Your Order!</h1>
        <p className="text-sm text-slate-500">
          Your payment has been processed and your order has been received. A receipt will be sent shortly.
        </p>
        {order && (
          <span className="inline-block rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-dark-800 dark:text-slate-400">
            Order Reference: <span className="font-mono text-primary-500">#{order._id}</span>
          </span>
        )}
      </div>

      {order && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Billing info */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300">
              <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">Order Items</h3>
              
              <div className="space-y-4">
                {order.products.map((item) => (
                  <div key={item._id} className="flex justify-between items-center gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded bg-slate-100 border dark:border-slate-800">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-white line-clamp-1">{item.title}</span>
                        <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      ${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping & Payment summary */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900">
              <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">Details</h3>
              
              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                {/* Date */}
                <div className="flex gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Ordered On</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="flex gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Shipping Address</span>
                    <span>
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex gap-2.5">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Payment Method</span>
                    <span>{order.paymentMethod} ({order.paymentStatus})</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white">Paid Amount</span>
                <span className="text-lg font-extrabold text-primary-600 dark:text-primary-400">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/orders"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-dark-800 dark:text-white"
        >
          View Order History
        </Link>
        <Link
          to="/shop"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 shadow-md"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
