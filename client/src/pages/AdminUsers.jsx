import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, UserCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, role) => {
    if (role === 'admin') {
      toast.error('Cannot delete administrator accounts');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? All their carts will be removed.')) return;

    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success('User removed successfully');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to delete user');
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
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 text-sm font-semibold rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Registered Users</h1>
        <p className="text-sm text-slate-500 mt-1">Total account database records: {users.length} users</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-dark-900 shadow-sm animate-fade-in">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-dark-950 dark:text-slate-500">
              <tr>
                <th className="px-6 py-4">Avatar</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-850/40">
                  <td className="px-6 py-4">
                    <img
                      src={usr.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt="avatar"
                      className="h-8 w-8 object-cover rounded-full border border-slate-200 dark:border-slate-700"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-850 dark:text-white">{usr.name}</td>
                  <td className="px-6 py-4">{usr.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      usr.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-dark-800 dark:text-slate-350 dark:border-slate-700'
                    }`}>
                      {usr.role === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      {usr.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(usr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(usr._id, usr.role)}
                      disabled={usr.role === 'admin'}
                      className="text-slate-400 hover:text-red-550 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
