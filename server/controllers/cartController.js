const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate total price of cart
const calculateCartTotal = async (products) => {
  let total = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product) {
      const finalPrice = product.price * (1 - (product.discount || 0) / 100);
      total += finalPrice * item.quantity;
    }
  }
  return Number(total.toFixed(2));
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'products.product',
      select: 'title price discount stock images category'
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        products: [],
        totalPrice: 0
      });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add / Update items in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        products: [],
        totalPrice: 0
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      if (quantity <= 0) {
        cart.products.splice(itemIndex, 1);
      } else {
        cart.products[itemIndex].quantity = quantity;
      }
    } else {
      // Add new item
      if (quantity > 0) {
        cart.products.push({ product: productId, quantity });
      }
    }

    cart.totalPrice = await calculateCartTotal(cart.products);
    cart.updatedAt = Date.now();
    await cart.save();

    // Populate and return
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      select: 'title price discount stock images category'
    });

    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    cart.totalPrice = await calculateCartTotal(cart.products);
    cart.updatedAt = Date.now();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      select: 'title price discount stock images category'
    });

    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      cart = await Cart.create({
        userId: req.user._id,
        products: [],
        totalPrice: 0
      });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
