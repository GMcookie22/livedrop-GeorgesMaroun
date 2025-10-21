// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Routers
import customersRouter from "./routes/customers.js";
import productsRouter from "./routes/products.js";
import analyticsRouter from "./routes/analytics.js";
import dashboardRouter from "./routes/dashboard.js";
import assistantRouter from "./routes/assistant.js";
import ordersRouter from "./routes/orders.js";
import orderStatusRouter from "./routes/orderStatus.js";

// Utils or middleware
import { getActiveConnectionCount } from "./utils/metrics.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/assistant", assistantRouter);

// Mount SSE route
app.use("/api/orders", orderStatusRouter);

// Mount orders CRUD routes after SSE
app.use("/api/orders", ordersRouter);

// Metrics endpoint for SSE connection count
app.get("/api/metrics/sse-count", (req, res) => {
  res.json({ activeConnections: getActiveConnectionCount() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
