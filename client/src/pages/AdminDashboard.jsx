import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DollarSign, ShoppingBag, Users, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, salesData: [] });
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Analytics
        const resAnalytics = await api.get('/orders/analytics');
        if (resAnalytics.data.success) {
          setStats(resAnalytics.data);
        }

        // Products
        const resProducts = await api.get('/products?pageSize=100');
        if (resProducts.data.success) {
          setProductsCount(resProducts.data.totalProducts);
          // filter low stock products
          const low = resProducts.data.products.filter(p => p.stock <= 5);
          setLowStockProducts(low);
        }

        // Users
        const resUsers = await api.get('/users');
        if (resUsers.data.success) {
          setUsersCount(resUsers.data.users.length);
        }

        // Recent Orders
        const resOrders = await api.get('/orders');
        if (resOrders.data.success) {
          setRecentOrders(resOrders.data.orders.slice(0, 5));
        }

      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Sidebar component wrapper
  const AdminLayout = ({ children }) => (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-4">Management Panel</h2>
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 text-sm font-semibold rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
          >
            Dashboard Overview
          </Link>
          <Link
            to="/admin/products"
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
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
        <main className="flex-1 space-y-8">{children}</main>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time metrics, stock notifications, and sales trends.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 dark:border-slate-800 dark:bg-dark-900 shadow-sm">
          <div className="rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-950/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Revenue</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">${stats.revenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 dark:border-slate-800 dark:bg-dark-900 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/20">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Total Orders</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalOrders}</span>
          </div>
        </div>

        {/* Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 dark:border-slate-800 dark:bg-dark-900 shadow-sm">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/20">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Products</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">{productsCount}</span>
          </div>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 dark:border-slate-800 dark:bg-dark-900 shadow-sm">
          <div className="rounded-lg bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Users</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">{usersCount}</span>
          </div>
        </div>
      </div>

      {/* SVG-based Sales Trend Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-dark-900 shadow-sm">
        <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-primary-500" />
          Daily Revenue Trend
        </h3>

        {stats.salesData && stats.salesData.length > 0 ? (
          <div className="space-y-4">
            <div className="relative h-48 w-full flex items-end justify-between gap-2 border-b border-l border-slate-200 pl-4 pb-4 dark:border-slate-800">
              {stats.salesData.map((d, i) => {
                const maxVal = Math.max(...stats.salesData.map(item => item.sales), 100);
                const heightPercent = `${(d.sales / maxVal) * 80 + 10}%`; // Cap at 90% for spacing

                return (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-10">
                      ${d.sales.toFixed(2)}
                    </span>

                    {/* Bar */}
                    <div
                      style={{ height: heightPercent }}
                      className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 group-hover:from-primary-700 group-hover:to-primary-500 transition-colors"
                    ></div>
                    
                    {/* Label Date */}
                    <span className="text-[9px] text-slate-400 mt-2 truncate max-w-full">
                      {d._id.substr(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-450 text-sm">
            Not enough data to populate sales metrics chart.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900">
          <h3 className="font-extrabold text-slate-850 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
            Recent Orders
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentOrders.map((ord) => (
              <Link
                key={ord._id}
                to="/admin/orders"
                className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-dark-850 px-2 rounded-lg transition-colors text-sm"
              >
                <div>
                  <span className="font-semibold text-slate-850 dark:text-white">Order #{ord._id.substr(-6)}</span>
                  <span className="block text-xs text-slate-400 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-850 dark:text-white">${ord.totalAmount.toFixed(2)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-450" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Warning List */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-dark-900">
          <h3 className="font-extrabold text-slate-850 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800 flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            Inventory Stock Alerts
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                All products are sufficiently stocked.
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex justify-between items-center py-3 text-sm">
                  <div className="max-w-[70%]">
                    <span className="font-semibold text-slate-850 dark:text-white block truncate">{prod.title}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Category: {prod.category}</span>
                  </div>
                  <span className="rounded bg-red-100 text-red-750 border border-red-200 px-2 py-0.5 text-xs font-extrabold dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
                    Stock: {prod.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
