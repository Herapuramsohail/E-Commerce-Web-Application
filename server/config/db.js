const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // fail fast if local db not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    console.log('Attempting to launch mongodb-memory-server fallback for zero-setup execution...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      console.log(`Temp Database URI: ${uri}`);

      // Run automated seeding for in-memory database
      console.log('Pre-populating temporary database with default seed data...');
      await runSeedData();
    } catch (fallbackError) {
      console.error(`Fallback Database Connection Error: ${fallbackError.message}`);
      console.error('Application will run, but database functions may fail. Start a local MongoDB instance.');
    }
  }
};

// Seeding function inside db.js to pre-populate memory DB
const runSeedData = async () => {
  try {
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Cart = require('../models/Cart');
    const Order = require('../models/Order');
    const Review = require('../models/Review');
    const bcrypt = require('bcryptjs');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    // Users
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: adminPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });

    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@shopsphere.com',
      password: customerPassword,
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });

    // Products
    const sampleProducts = [
      {
        title: 'Wireless Noise-Canceling Headphones',
        description: 'Experience premium audio quality with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for travel, work, or relaxing.',
        price: 199.99,
        discount: 15,
        category: 'Electronics',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        rating: 4.5,
        reviews: [
          {
            name: 'Jane Smith',
            rating: 4,
            comment: 'Good noise cancellation, but can feel a bit tight after hours of wear.',
            userId: customerUser._id
          }
        ]
      },
      {
        title: 'Smart Watch Series 5',
        description: 'Track your fitness goals, monitor your heart rate, receive notifications, and make calls right from your wrist.',
        price: 299.99,
        discount: 10,
        category: 'Electronics',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        rating: 4.8,
        reviews: []
      },
      {
        title: 'Classic Leather Jacket',
        description: 'Crafted from premium full-grain lambskin leather, this jacket offers a timeless style.',
        price: 149.99,
        discount: 20,
        category: 'Fashion',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
        rating: 4.2,
        reviews: []
      },
      {
        title: 'Ceramic Coffee Mug Set',
        description: 'Set of four artisanal stoneware coffee mugs. Dishwasher and microwave safe.',
        price: 29.99,
        discount: 10,
        category: 'Home & Kitchen',
        stock: 4, // Low stock warning
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'],
        rating: 4.4,
        reviews: []
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    
    // Seed flat reviews for Review collection
    for (const prod of createdProducts) {
      if (prod.reviews && prod.reviews.length > 0) {
        for (const rev of prod.reviews) {
          await Review.create({
            userId: customerUser._id,
            productId: prod._id,
            rating: rev.rating,
            comment: rev.comment
          });
        }
      }
    }

    // Cart
    const cartItem = createdProducts[0];
    await Cart.create({
      userId: customerUser._id,
      products: [{ product: cartItem._id, quantity: 1 }],
      totalPrice: Number((cartItem.price * (1 - cartItem.discount / 100)).toFixed(2))
    });

    // Order
    const orderItem = createdProducts[1];
    const orderItemPrice = Number((orderItem.price * (1 - orderItem.discount / 100)).toFixed(2));
    await Order.create({
      userId: customerUser._id,
      products: [
        {
          product: orderItem._id,
          title: orderItem.title,
          price: orderItem.price,
          discount: orderItem.discount,
          quantity: 1,
          image: orderItem.images[0]
        }
      ],
      shippingAddress: {
        address: '123 E-Commerce Way',
        city: 'Tech City',
        state: 'Silicon Valley',
        postalCode: '94025',
        country: 'USA'
      },
      paymentMethod: 'Stripe',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      totalAmount: orderItemPrice
    });

    console.log('Seeding completed for in-memory DB!');
  } catch (seedError) {
    console.error(`In-memory database seeding error: ${seedError.message}`);
  }
};

module.exports = connectDB;
