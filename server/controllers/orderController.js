const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, paymentResult } = req.body;

  try {
    // 1. Fetch user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const orderItems = [];
    let totalAmount = 0;

    // 2. Validate stock and calculate total
    for (const item of cart.products) {
      const dbProduct = await Product.findById(item.product._id);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product ${item.product.title} not found` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${dbProduct.title}. Available: ${dbProduct.stock}`
        });
      }

      // Calculate final price with discount
      const priceAfterDiscount = dbProduct.price * (1 - (dbProduct.discount || 0) / 100);
      const subtotal = priceAfterDiscount * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        price: dbProduct.price,
        discount: dbProduct.discount,
        quantity: item.quantity,
        image: dbProduct.images[0] || ''
      });

      // 3. Deduct stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    totalAmount = Number(totalAmount.toFixed(2));

    // 4. Determine initial payment status
    // If Stripe is used, we assume it's paid (simulated integration)
    const paymentStatus = paymentMethod === 'Stripe' ? 'Paid' : 'Pending';

    // 5. Create Order
    const order = new Order({
      userId: req.user._id,
      products: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentResult,
      totalAmount
    });

    const createdOrder = await order.save();

    // 6. Clear Cart
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
      // Authorization check: Admin or Order owner
      if (
        req.user.role !== 'admin' &&
        order.userId._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.json({ success: true, order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'id name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.orderStatus || order.orderStatus;
      
      // Auto-pay on delivery if COD and status is Delivered
      if (
        order.paymentMethod === 'COD' &&
        order.orderStatus === 'Delivered'
      ) {
        order.paymentStatus = 'Paid';
      }

      if (req.body.paymentStatus) {
        order.paymentStatus = req.body.paymentStatus;
      }

      const updatedOrder = await order.save();
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    
    // Sum revenue
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Sales by month/day (mock chart data formatting or actual aggregation)
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      totalOrders,
      revenue,
      salesData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAnalytics
};
