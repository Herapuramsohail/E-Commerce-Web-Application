const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');

dotenv.config();

const seedProducts = [
  {
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Experience premium audio quality with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for travel, work, or relaxing.',
    price: 199.99,
    discount: 15,
    category: 'Electronics',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviews: [
      {
        name: 'John Doe',
        rating: 5,
        comment: 'Amazing sound quality and battery life. Best headphones I have ever owned!',
        createdAt: new Date('2026-06-01')
      },
      {
        name: 'Jane Smith',
        rating: 4,
        comment: 'Good noise cancellation, but can feel a bit tight after hours of wear.',
        createdAt: new Date('2026-06-15')
      }
    ]
  },
  {
    title: 'Smart Watch Series 5',
    description: 'Track your fitness goals, monitor your heart rate, receive notifications, and make calls right from your wrist. Water-resistant up to 50 meters with an elegant custom watch face.',
    price: 299.99,
    discount: 10,
    category: 'Electronics',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviews: [
      {
        name: 'Alice Cooper',
        rating: 5,
        comment: 'Outstanding fitness tracker! The display is bright and responsive.',
        createdAt: new Date('2026-06-10')
      }
    ]
  },
  {
    title: 'Classic Leather Jacket',
    description: 'Crafted from premium full-grain lambskin leather, this jacket offers a timeless style, featuring heavy-duty YKK zippers, zipped cuffs, and an adjustable waist belt.',
    price: 149.99,
    discount: 20,
    category: 'Fashion',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.2,
    reviews: [
      {
        name: 'Bob Johnson',
        rating: 4,
        comment: 'Fits perfectly and feels high quality. Smells like genuine leather.',
        createdAt: new Date('2026-06-18')
      }
    ]
  },
  {
    title: 'Unisex Cotton Hoodie',
    description: 'Relax in comfort with our ultra-soft heavyweight organic cotton hoodie. Relaxed fit, double-lined hood, and a spacious front kangaroo pocket. Perfect for daily layering.',
    price: 49.99,
    discount: 5,
    category: 'Fashion',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.0,
    reviews: []
  },
  {
    title: 'Minimalist Slim Wallet',
    description: 'Keep it simple with this slim cardholder wallet. Made from top-grain leather with built-in RFID blocking technology to keep your cards safe. Fits up to 8 cards and cash.',
    price: 39.99,
    discount: 0,
    category: 'Accessories',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1627124765135-5667c5270c64?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviews: [
      {
        name: 'Chris Evans',
        rating: 5,
        comment: 'Very slim, no bulk in my pockets. High quality stitching.',
        createdAt: new Date('2026-06-25')
      }
    ]
  },
  {
    title: 'Polarized Sport Sunglasses',
    description: 'Protect your eyes during workouts or outdoor activities. Polarized lenses eliminate glare while providing 100% UV protection. Lightweight and durable frame.',
    price: 79.99,
    discount: 25,
    category: 'Accessories',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.3,
    reviews: []
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated water bottle keeps beverages cold for 24 hours or hot for 12. Leak-proof cap, durable powder-coated finish, and BPA-free construction.',
    price: 24.99,
    discount: 0,
    category: 'Home & Kitchen',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviews: []
  },
  {
    title: 'Ceramic Coffee Mug Set',
    description: 'Set of four artisanal stoneware coffee mugs. Dishwasher and microwave safe with comfortable loop handles. Earthy tones to brighten up your morning coffee routine.',
    price: 29.99,
    discount: 10,
    category: 'Home & Kitchen',
    stock: 4, // Low stock to trigger alert in admin dashboard!
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.4,
    reviews: [
      {
        name: 'David Beckham',
        rating: 4,
        comment: 'Beautiful earthy finish. Very cozy to hold.',
        createdAt: new Date('2026-06-29')
      }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere');
    console.log('MongoDB connection active for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Database cleared of existing records.');

    // Create password hashes
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    // Create Admin User
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: adminPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });

    // Create Customer User
    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@shopsphere.com',
      password: customerPassword,
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });

    console.log('Default users (Admin & Customer) created.');

    // Seed Products
    // Link reviews to the customer user
    const formattedProducts = seedProducts.map((p) => {
      const updatedReviews = p.reviews.map((r) => ({
        ...r,
        userId: customerUser._id
      }));
      return {
        ...p,
        reviews: updatedReviews
      };
    });

    const createdProducts = await Product.insertMany(formattedProducts);
    console.log(`${createdProducts.length} sample products seeded successfully.`);

    // Seed flat reviews for Review collection
    for (const prod of createdProducts) {
      if (prod.reviews && prod.reviews.length > 0) {
        for (const rev of prod.reviews) {
          await Review.create({
            userId: customerUser._id,
            productId: prod._id,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: rev.createdAt
          });
        }
      }
    }
    console.log('Flat reviews collection seeded.');

    // Create a sample cart for customer
    const cartItem = createdProducts[0];
    await Cart.create({
      userId: customerUser._id,
      products: [{ product: cartItem._id, quantity: 1 }],
      totalPrice: Number((cartItem.price * (1 - cartItem.discount / 100)).toFixed(2))
    });
    console.log('Default user shopping cart initialized.');

    // Create a sample order for customer
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
      totalAmount: orderItemPrice,
      createdAt: new Date('2026-07-01')
    });
    console.log('Sample purchase order initialized.');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
