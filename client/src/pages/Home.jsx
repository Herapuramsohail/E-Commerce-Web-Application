import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { Truck, ShieldCheck, Headphones, CreditCard, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?pageSize=4');
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      link: '/shop?category=Electronics'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
      link: '/shop?category=Fashion'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      link: '/shop?category=Accessories'
    },
    {
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500',
      link: '/shop?category=Home%20%26%20Kitchen'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-950 to-primary-900 text-white py-20 px-8 md:py-28 md:px-16 mx-auto max-w-7xl mt-6 shadow-xl">
        <div className="relative z-10 max-w-lg space-y-6 animate-fade-in-up">
          <span className="inline-block rounded-full bg-primary-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-200">
            Summer Season Sale
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Upgrade Your Lifestyle.
          </h1>
          <p className="text-lg text-primary-200">
            Discover cutting-edge gadgets, trending fashion, and premium accessories curated just for you.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/shop"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-950 hover:bg-slate-100 transition-colors shadow-lg"
            >
              Shop Collection
            </Link>
            <Link
              to="/shop?category=Electronics"
              className="rounded-lg border border-primary-600 bg-primary-950/40 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-900/40 transition-colors"
            >
              Explore Tech
            </Link>
          </div>
        </div>

        {/* Diagonal abstract backgrounds */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 md:opacity-50 hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
            alt="Hero abstract"
            className="h-full w-full object-cover transform rotate-3 scale-110 translate-x-12"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Services Callouts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck className="h-6 w-6 text-primary-500" />, title: 'Free Shipping', desc: 'On all orders over $99' },
            { icon: <ShieldCheck className="h-6 w-6 text-primary-500" />, title: 'Secure Checkout', desc: '100% encrypted checkout' },
            { icon: <Headphones className="h-6 w-6 text-primary-500" />, title: '24/7 Support', desc: 'Dedicated customer helpline' },
            { icon: <CreditCard className="h-6 w-6 text-primary-500" />, title: 'Easy Returns', desc: '30-day money-back guarantee' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-dark-900/60 shadow-sm">
              <div className="rounded-lg bg-primary-50 dark:bg-primary-950/20 p-2.5 h-fit">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Shop by Category</h2>
            <p className="text-sm text-slate-500">Pick from our premium curated lists.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative h-48 overflow-hidden rounded-xl bg-slate-100 shadow-sm border border-slate-200 dark:border-slate-800 block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                <span className="text-lg font-bold text-white tracking-wide group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Featured Products</h2>
            <p className="text-sm text-slate-500">Check out our hottest products of the week.</p>
          </div>
          <Link to="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500">
            See All Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((prod) => <ProductCard key={prod._id} product={prod} />)
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500">
              No products found. Please seed the database.
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl md:text-3xl font-extrabold">Special First Purchase Coupon</h3>
            <p className="text-sm text-red-100">
              Apply coupon <span className="font-mono bg-white/25 rounded px-2 py-0.5 font-bold">WELCOME20</span> during checkout to receive an instant 20% discount on your order.
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-red-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Claim Offer
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
