// const express = require('express');
// const router = express.Router();
// const Order = require('../models/order');

// // GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
// router.get('/daily-revenue', async (req, res, next) => {
//   try {
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ error: "Missing 'from' or 'to' query params" });
//     }

//     const startDate = new Date(from);
//     const endDate = new Date(to);
//     endDate.setHours(23, 59, 59, 999);

//     const revenueData = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate, $lte: endDate },
//           status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] }
//         }
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           totalRevenue: { $sum: "$total" },
//           orderCount: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     res.json(revenueData);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/analytics/dashboard-metrics
// router.get('/dashboard-metrics', async (req, res, next) => {
//   try {
//     const totalOrders = await Order.countDocuments();
//     const totalRevenueData = await Order.aggregate([
//       {
//         $match: { status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] } }
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$total" },
//           avgOrderValue: { $avg: "$total" }
//         }
//       }
//     ]);

//     const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;
//     const avgOrderValue = totalRevenueData[0]?.avgOrderValue || 0;

//     const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

//     res.json({
//       totalOrders,
//       totalRevenue,
//       avgOrderValue,
//       recentOrders
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * 📊 GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns: [{ date: '2025-10-01', revenue: 1234.56, orderCount: 3 }, ...]
 */
router.get('/daily-revenue', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to)
      return res.status(400).json({ error: "Missing 'from' or 'to' query parameters (YYYY-MM-DD)" });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // include entire end date

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          orderCount: 1
        }
      },
      { $sort: { date: 1 } }
    ];

    const results = await Order.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * 🧭 GET /api/analytics/dashboard-metrics
 * Returns: summary data for dashboard
 */
router.get('/dashboard-metrics', async (req, res, next) => {
  try {
    // Total order count
    const totalOrders = await Order.countDocuments();

    // Total & average revenue for completed orders
    const revenueStats = await Order.aggregate([
      {
        $match: { status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" }
        }
      }
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const avgOrderValue = revenueStats[0]?.avgOrderValue || 0;

    // Most recent orders (limit 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      metrics: {
        totalOrders,
        totalRevenue,
        avgOrderValue
      },
      recentOrders
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
