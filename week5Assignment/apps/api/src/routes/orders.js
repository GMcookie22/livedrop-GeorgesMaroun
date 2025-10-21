// const express = require('express');
// const router = express.Router();
// const Order = require('../models/order');

// // POST /api/orders
// router.post('/', async (req, res, next) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json(order);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/orders/:id
// router.get('/:id', async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customerId')
//       .populate('items.productId');
//     if (!order) return res.status(404).json({ error: 'Order not found' });
//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/orders?customerId=:customerId
// router.get('/', async (req, res, next) => {
//   try {
//     const { customerId } = req.query;
//     let query = {};
//     if (customerId) query.customerId = customerId;

//     const orders = await Order.find(query)
//       .populate('customerId')
//       .populate('items.productId')
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// src/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// -----------------------------
// POST /api/orders
// Create a new order
// -----------------------------
router.post('/', async (req, res, next) => {
  try {
    const { customerEmail, items, carrier, estimatedDelivery } = req.body;

    // Validate basic input
    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'customerEmail and items[] are required' });
    }

    // Find customer
    const customer = await Customer.findOne({ email: customerEmail.toLowerCase() });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Validate items and compute total
    let total = 0;
    const populatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Invalid productId ${item.productId}` });
      }

      const quantity = item.quantity || 1;

      if (product.stock < quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product ${product.name}` });
      }

      populatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      });

      total += product.price * quantity;
    }

    // Create and save the order
    const order = new Order({
      customerId: customer._id,
      items: populatedItems,
      total,
      carrier,
      estimatedDelivery
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/orders/:id
// Fetch a specific order by ID
// -----------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// -----------------------------
// GET /api/orders?customerId=:customerId
// Fetch orders (optionally filtered by customer)
// -----------------------------
router.get('/', async (req, res, next) => {
  try {
    const { customerId } = req.query;
    const query = customerId ? { customerId } : {};

    const orders = await Order.find(query)
      .populate('customerId')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
