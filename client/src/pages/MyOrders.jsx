import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, ChevronDown, ChevronUp, Calendar, CreditCard, MapPin } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">Track status and view details of your past purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-dark-900">
          <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">No orders found</h3>
          <p className="text-sm text-slate-500">You haven't placed any orders yet on ShopSphere.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300"
              >
                
                {/* Summary Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-800/40 select-none gap-4"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">
                      Order <span className="font-mono text-primary-500">#{order._id.substr(-6)}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <span className="font-extrabold text-slate-800 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>

                {/* Details Body */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-6 dark:border-slate-800 animate-fade-in">
                    
                    {/* Items Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items in Order</h4>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.products.map((item) => (
                          <div key={item._id} className="flex justify-between items-center py-2.5 text-sm">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.title} className="h-8 w-8 object-cover rounded bg-slate-50 border dark:border-slate-800" />
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white block">{item.title}</span>
                                <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-white">
                              ${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      {/* Shipping */}
                      <div className="flex gap-2">
                        <MapPin className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white mb-0.5">Shipping Address</span>
                          <span>
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                          </span>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="flex gap-2">
                        <CreditCard className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white mb-0.5">Payment Method</span>
                          <span>{order.paymentMethod}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Payment Status: {order.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex gap-2">
                        <Calendar className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white mb-0.5">Order Metadata</span>
                          <span>Placed: {new Date(order.createdAt).toLocaleString()}</span>
                          {order.paymentResult?.id && (
                            <span className="block text-[10px] text-slate-400 mt-0.5">Transaction ID: {order.paymentResult.id}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
