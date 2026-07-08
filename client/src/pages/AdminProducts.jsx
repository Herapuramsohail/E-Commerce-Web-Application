import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?pageSize=100');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      toast.error('Failed to load products list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      title: '',
      description: '',
      price: '',
      discount: 0,
      category: 'Electronics',
      stock: '',
      images: ''
    });
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    reset({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      discount: prod.discount,
      category: prod.category,
      stock: prod.stock,
      images: prod.images.join(', ')
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    // Convert images text back to array
    const imageList = formData.images
      ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
      : [];

    const productPayload = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      stock: Number(formData.stock),
      images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400']
    };

    try {
      if (editingProduct) {
        // Edit request
        const { data } = await api.put(`/products/${editingProduct._id}`, productPayload);
        if (data.success) {
          toast.success('Product updated successfully!');
          fetchProducts();
        }
      } else {
        // Add request
        const { data } = await api.post('/products', productPayload);
        if (data.success) {
          toast.success('Product added successfully!');
          fetchProducts();
        }
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product details');
    }
  };

  const handleDelete = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product? This is permanent.')) return;
    try {
      const { data } = await api.delete(`/products/${prodId}`);
      if (data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to delete product');
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
            className="block px-3 py-2 text-sm font-semibold rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
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
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Total count: {products.length} products listed</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-dark-900 shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-dark-950 dark:text-slate-500">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-850/40">
                  <td className="px-6 py-4">
                    <img src={prod.images[0]} alt="prod" className="h-10 w-10 object-cover rounded bg-slate-100 border dark:border-slate-800" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-850 dark:text-white max-w-[200px] truncate">
                    {prod.title}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                    ${prod.price.toFixed(2)}
                    {prod.discount > 0 && (
                      <span className="block text-[10px] text-red-500 font-normal">-{prod.discount}% off</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${prod.stock <= 5 ? 'text-red-500' : 'text-slate-800 dark:text-slate-300'}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">{prod.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="text-slate-450 hover:text-primary-500 transition-colors"
                      >
                        <Edit2 className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="text-slate-450 hover:text-red-550 transition-colors"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl dark:bg-dark-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-450 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Product Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Description</label>
                <textarea
                  rows="3"
                  {...register('description', { required: 'Description is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                ></textarea>
                {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: 0 })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                  />
                  {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Discount (%)</label>
                  <input
                    type="number"
                    {...register('discount', { min: 0, max: 100 })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Stock Level</label>
                  <input
                    type="number"
                    {...register('stock', { required: 'Stock is required', min: 0 })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                  />
                  {errors.stock && <span className="text-xs text-red-500">{errors.stock.message}</span>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Category</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                </select>
              </div>

              {/* Images list (CSV) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Image URLs (comma separated)</label>
                <input
                  type="text"
                  {...register('images')}
                  placeholder="https://image1.com, https://image2.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
