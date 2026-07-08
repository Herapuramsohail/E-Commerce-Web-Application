import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Query Filters state
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL Search Params on navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeyword(params.get('keyword') || '');
    setCategory(params.get('category') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setSort(params.get('sort') || 'newest');
    setPage(Number(params.get('page')) || 1);
  }, [location.search]);

  // Fetch products matching state
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&sort=${sort}&pageSize=6`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;

        const { data } = await api.get(url);
        if (data.success) {
          setProducts(data.products);
          setPages(data.pages);
        }
      } catch (err) {
        console.error('Failed to load shop catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  // Push updated filter state to URL search parameters
  const updateUrl = (updatedFilters) => {
    const params = new URLSearchParams(location.search);
    
    // Merge new filters
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page back to 1 on category/search changes
    if (updatedFilters.page === undefined) {
      params.set('page', '1');
    }

    navigate({ search: params.toString() });
  };

  const handleCategorySelect = (cat) => {
    const val = category === cat ? '' : cat; // toggle
    updateUrl({ category: val, page: 1 });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateUrl({ minPrice, maxPrice, page: 1 });
  };

  const clearAllFilters = () => {
    setKeyword('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    navigate('/shop');
  };

  const categories = ['Electronics', 'Fashion', 'Accessories', 'Home & Kitchen'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Search Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Shop Catalog</h1>
          {keyword && (
            <p className="text-sm text-slate-500 mt-1">
              Search results for: <span className="font-semibold text-primary-600">"{keyword}"</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting Dropdown */}
          <select
            value={sort}
            onChange={(e) => updateUrl({ sort: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex sm:hidden items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-dark-800 dark:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white">Filters</span>
            <button onClick={clearAllFilters} className="text-xs font-semibold text-primary-600 hover:text-primary-500">
              Clear All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                    category === cat
                      ? 'bg-primary-50 text-primary-600 font-semibold dark:bg-primary-950/20 dark:text-primary-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-dark-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Price Range</h3>
            <form onSubmit={handlePriceApply} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 py-1.5 text-xs font-bold text-white hover:bg-primary-700"
              >
                Apply Price
              </button>
            </form>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
              products.map((prod) => <ProductCard key={prod._id} product={prod} />)
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400">
                No products match the selected filters.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={page === 1}
                onClick={() => updateUrl({ page: page - 1 })}
                className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-dark-800"
              >
                <ChevronLeft className="h-4.5 w-4.5 dark:text-white" />
              </button>
              
              <span className="text-sm font-medium dark:text-white">
                Page {page} of {pages}
              </span>

              <button
                disabled={page === pages}
                onClick={() => updateUrl({ page: page + 1 })}
                className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-dark-800"
              >
                <ChevronRight className="h-4.5 w-4.5 dark:text-white" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Drawer Filters (Mobile) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl dark:bg-dark-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-white">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-6 overflow-y-auto">
              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategorySelect(cat);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                        category === cat
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-dark-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Price Range</h3>
                <form onSubmit={(e) => { handlePriceApply(e); setMobileFilterOpen(false); }} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:bg-dark-800 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:bg-dark-800 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary-600 py-1.5 text-xs font-bold text-white"
                  >
                    Apply Price
                  </button>
                </form>
              </div>
            </div>

            <button
              onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
              className="mt-auto w-full rounded-lg border border-slate-300 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
