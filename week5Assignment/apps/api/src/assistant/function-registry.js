// src/assistant/function-registry.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class FuncRegistry {
  constructor() {
    this.map = {};
  }

  add(fnName, schema, handler) {
    this.map[fnName] = { schema, handler };
  }

  listSchemas() {
    return Object.fromEntries(
      Object.entries(this.map).map(([name, { schema }]) => [name, schema])
    );
  }

  async run(fnName, args) {
    const entry = this.map[fnName];
    if (!entry) throw new Error(`Function not registered: ${fnName}`);
    return await entry.handler(args);
  }
}

const funcRegistry = new FuncRegistry();

// -----------------------------
// 1️⃣  Retrieve Order Status
// -----------------------------
funcRegistry.add(
  'getOrderStatus',
  {
    description: 'Retrieve the current status of an order by ID',
    parameters: { orderId: 'string' },
  },
  async ({ orderId }) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return 'Invalid order ID';
    }
    const order = await Order.findById(orderId);
    return order ? order.status : 'Order not found';
  }
);

// -----------------------------
// 2️⃣  Product Search
// -----------------------------
funcRegistry.add(
  'searchProducts',
  {
    description: 'Find products by keyword (case-insensitive)',
    parameters: { query: 'string', limit: 'number' },
  },
  async ({ query, limit = 5 }) => {
    const terms = query.trim().split(/\s+/).filter(Boolean);
    const regexes = terms.map(t => new RegExp(t, 'i'));

    const filter = { $or: regexes.map(r => ({ name: r })) };

    return await Product.find(filter)
      .limit(limit)
      .select('_id name price');
  }
);

// -----------------------------
// 3️⃣  List Orders by Customer
// -----------------------------
funcRegistry.add(
  'getCustomerOrders',
  {
    description: 'Return all orders for a specific customer email',
    parameters: { email: 'string' },
  },
  async ({ email }) => {
    const customer = await Customer.findOne({ email });
    if (!customer) return [];
    return await Order.find({ customerId: customer._id })
      .select('_id status total createdAt');
  }
);

module.exports = funcRegistry;
