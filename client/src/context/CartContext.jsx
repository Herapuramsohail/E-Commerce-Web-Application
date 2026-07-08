import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ products: [], totalPrice: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ products: [], totalPrice: 0 });
    }
  }, [user]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      if (data.success && data.cart) {
        setCart(data.cart);
        return data.cart;
      }
    } catch (err) {
      console.error('Error adding to cart', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      if (data.success && data.cart) {
        setCart(data.cart);
        return data.cart;
      }
    } catch (err) {
      console.error('Error removing from cart', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.delete('/cart');
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Error clearing cart', err);
    } finally {
      setLoading(false);
    }
  };

  // Wishlist actions
  const toggleWishlist = (product) => {
    let updated;
    const exists = wishlist.some((item) => item._id === product._id);
    if (exists) {
      updated = wishlist.filter((item) => item._id !== product._id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartItemsCount: cart.products.reduce((acc, item) => acc + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
