import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronDown, Eye, CheckCircle, Package, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      toast.error('Failed to load orders list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const { data } = await api.put(`/orders/${orderId}`, {
        orderStatus: newStatus
      });
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        // Update selected order detail view if open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Shared Admin Layout
  const AdminLayout = ({ children }) => (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-4">Management Panel</h2>
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
          >
            Dashboard Overview
          </Link>
          <Link
            to="/admin/products"
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 text-sm font-semibold rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
          >
            Manage Users
          </Link>
        </aside>

        {/* Content container */}
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Customer Purchases</h1>
        <p className="text-sm text-slate-500 mt-1">Total count: {orders.length} orders logged</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Orders Table */}
          <div className="xl:col-span-2 overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-dark-900 shadow-sm animate-fade-in">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-dark-950 dark:text-slate-500">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-850/40">
                    <td className="px-4 py-4 font-mono text-xs text-primary-500">
                      #{ord._id.substr(-6)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-800 dark:text-white block">{ord.userId?.name || 'Guest'}</span>
                      <span className="text-[10px] text-slate-400">{ord.userId?.email}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800 dark:text-white">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="block">{ord.paymentMethod}</span>
                      <span className={`text-[10px] ${ord.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{ord.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-4">
                      {/* Status Dropdown */}
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        disabled={statusUpdating}
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold focus:outline-none ${getStatusColor(ord.orderStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details inspector panel */}
          <div className="space-y-6">
            {selectedOrder ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900 animate-fade-in">
                <h3 className="font-extrabold text-slate-850 dark:text-white border-b pb-2 dark:border-slate-800">
                  Order Details Inspector
                </h3>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Order Reference</span>
                    <span className="font-mono text-primary-500">{selectedOrder._id}</span>
                  </div>

                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Shipment Delivery Address</span>
                    <span>
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{' '}
                      {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode},{' '}
                      {selectedOrder.shippingAddress.country}
                    </span>
                  </div>

                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">Order Items List</span>
                    <div className="mt-1.5 space-y-2 max-h-40 overflow-y-auto border border-slate-100 p-2 rounded dark:border-slate-800">
                      {selectedOrder.products.map((p) => (
                        <div key={p._id} className="flex justify-between items-center text-[10px]">
                          <span>{p.quantity}x {p.title}</span>
                          <span className="font-bold">${(p.price * (1 - p.discount/100) * p.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block font-bold text-slate-850 dark:text-white">Financial Calculations</span>
                    <div className="flex justify-between text-[11px] pt-1">
                      <span>Total Invoice</span>
                      <span className="font-bold text-slate-850 dark:text-white">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-sm dark:border-slate-800">
                Click the eye icon next to an order to view its invoice details.
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
