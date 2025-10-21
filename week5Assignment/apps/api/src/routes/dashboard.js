// const express = require('express');
// const router = express.Router();
// const Order = require('../models/order');

// // GET /api/dashboard/business-metrics
// router.get('/business-metrics', async (req, res, next) => {
//   try {
//     const totalOrders = await Order.countDocuments();

//     const revenueData = await Order.aggregate([
//       { $match: { status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] } } },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$total" },
//           avgOrderValue: { $avg: "$total" },
//         },
//       },
//     ]);

//     const totalRevenue = revenueData[0]?.totalRevenue || 0;
//     const avgOrderValue = revenueData[0]?.avgOrderValue || 0;

//     const deliveredOrders = await Order.countDocuments({ status: "DELIVERED" });
//     const processingOrders = await Order.countDocuments({ status: "PROCESSING" });
//     const pendingOrders = await Order.countDocuments({ status: "PENDING" });

//     res.json({
//       totalOrders,
//       totalRevenue,
//       avgOrderValue,
//       deliveredOrders,
//       processingOrders,
//       pendingOrders,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/dashboard/performance
// router.get('/performance', async (req, res) => {
//   // Mock performance metrics for now
//   const performanceStats = {
//     apiLatencyMs: Math.floor(Math.random() * 200) + 50, // Random latency 50–250ms
//     activeSSEConnections: Math.floor(Math.random() * 10), // Simulated open SSE channels
//     uptimeMinutes: Math.floor(process.uptime() / 60),
//     timestamp: new Date(),
//   };

//   res.json(performanceStats);
// });

// // GET /api/dashboard/assistant-stats
// router.get('/assistant-stats', async (req, res) => {
//   // Example mock data — adjust if your assistant logs exist later
//   const assistantStats = {
//     totalInteractions: 321,
//     intentDistribution: {
//       "View Products": 45,
//       "Check Order Status": 80,
//       "Get Help": 62,
//       "Contact Support": 30,
//       "Analytics Request": 104,
//     },
//     functionCalls: {
//       "GetProductById": 50,
//       "CreateOrder": 25,
//       "GetDailyRevenue": 15,
//       "DashboardMetrics": 10,
//     },
//     updatedAt: new Date(),
//   };

//   res.json(assistantStats);
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const AssistantLog = require('../models/AssistantLog');
const axios = require('axios');

/* -------------------------------------------------------------------------- */
/* 🧠 Simple in-memory performance tracker                                    */
/* -------------------------------------------------------------------------- */
const metrics = {
  latencies: [],
  failedRequests: 0,
};

function trackLatency(startTime) {
  const latency = Date.now() - startTime;
  metrics.latencies.push(latency);
  if (metrics.latencies.length > 1000) metrics.latencies.shift();
}

function avgLatency() {
  if (!metrics.latencies.length) return 0;
  const total = metrics.latencies.reduce((a, b) => a + b, 0);
  return Math.round(total / metrics.latencies.length);
}

/* -------------------------------------------------------------------------- */
/* 1️⃣ GET /api/dashboard/business-metrics                                     */
/* -------------------------------------------------------------------------- */
router.get('/business-metrics', async (req, res, next) => {
  const start = Date.now();
  try {
    const totalOrders = await Order.countDocuments();

    // 💰 Aggregate revenue and average order value
    const revenueData = await Order.aggregate([
      {
        $match: { status: { $in: ["PROCESSING", "SHIPPED", "DELIVERED"] } },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    const totals = revenueData[0] || { totalRevenue: 0, avgOrderValue: 0 };

    // 📊 Orders grouped by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
      { $sort: { status: 1 } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: Math.round(totals.totalRevenue * 100) / 100,
      avgOrderValue: Math.round(totals.avgOrderValue * 100) / 100,
      ordersByStatus,
    });
  } catch (err) {
    metrics.failedRequests++;
    console.error("Business metrics error:", err);
    next(err);
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 2️⃣ GET /api/dashboard/performance                                          */
/* -------------------------------------------------------------------------- */
router.get('/performance', async (req, res) => {
  const start = Date.now();
  try {
    // Example: average LLM response time (if logs exist)
    const llmStats = await AssistantLog.aggregate([
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTime" },
          totalRequests: { $sum: 1 },
        },
      },
    ]);

    const llmAvgTime = llmStats[0]?.avgResponseTime
      ? Math.round(llmStats[0].avgResponseTime)
      : 0;

    res.json({
      avgLatency: avgLatency(),
      failedRequests: metrics.failedRequests,
      totalRequests: metrics.latencies.length,
      llmAvgResponseTime: llmAvgTime,
      uptimeMinutes: Math.floor(process.uptime() / 60),
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Performance metrics error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 3️⃣ GET /api/dashboard/assistant-stats                                      */
/* -------------------------------------------------------------------------- */
router.get('/assistant-stats', async (req, res) => {
  const start = Date.now();
  try {
    const totalInteractions = await AssistantLog.countDocuments();

    const intentDistribution = await AssistantLog.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
      { $project: { intent: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    const functionCalls = await AssistantLog.aggregate([
      { $unwind: "$functionsCalled" },
      { $group: { _id: "$functionsCalled", count: { $sum: 1 } } },
      { $project: { function: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalInteractions,
      intentDistribution,
      functionCalls,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error("Assistant stats error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 4️⃣ GET /api/dashboard/health                                               */
/* -------------------------------------------------------------------------- */
async function pingLLMService() {
  try {
    const url = process.env.LLM_URL;
    if (!url) return false;

    const response = await axios.post(
      url.endsWith("/generate") ? url : `${url}/generate`,
      { prompt: "test", max_tokens: 5 },
      { timeout: 4000, validateStatus: (s) => s < 500 }
    );
    return response.status >= 200 && response.status < 500;
  } catch (err) {
    console.error("LLM ping failed:", err.message);
    return false;
  }
}

router.get('/health', async (req, res) => {
  const start = Date.now();
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    const llmOnline = await pingLLMService();

    res.json({
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState,
      },
      llm: {
        status: llmOnline ? "Online" : "Offline",
        url: process.env.LLM_URL || "Not configured",
      },
      uptimeMinutes: Math.floor(process.uptime() / 60),
      timestamp: new Date(),
    });
  } catch (err) {
    metrics.failedRequests++;
    console.error("Health check error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

module.exports = router;
