# 🧩 Week 5 - APIs, Integrations, and LLM Features (Final MVP)

**Goal:** Connect your Week 4 storefront to a real backend with a live database, real-time order tracking, and an intelligent support assistant.  
This marks the final step in delivering a fully functional MVP.

---

## 🚀 Overview

This API powers the full e-commerce MVP by providing:

- RESTful endpoints for **customers**, **products**, and **orders**
- **Analytics & dashboard metrics** using database aggregation
- **Real-time order tracking** with Server-Sent Events (SSE)
- An **intelligent assistant** with intent detection, function calling, and grounded policy responses
- Connection to an external **LLM endpoint** hosted on your Week 3 Colab notebook

---

## 🏗️ Project Structure

/apps/api/
README.md
package.json
.env.example
src/
server.js
db.js
routes/
customers.js
products.js
orders.js
analytics.js
dashboard.js
sse/
order-status.js
assistant/
intent-classifier.js
function-registry.js
engine.js


---

## 🌐 API Endpoints

### 🧍 Customers
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/customers?email=user@example.com` | Look up customer by email |
| `GET` | `/api/customers/:id` | Get customer profile by ID |

### 🛒 Products
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/products?search=&tag=&sort=&page=&limit=` | List and filter products |
| `GET` | `/api/products/:id` | Get a product by ID |
| `POST` | `/api/products` | Create new product |

### 📦 Orders
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/:id` | Get specific order |
| `GET` | `/api/orders?customerId=:customerId` | List orders for a customer |
| `GET` | `/api/orders/:id/stream` | **SSE**: Live order status updates |

### 📊 Analytics & Dashboard
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD` | Daily revenue aggregation |
| `GET` | `/api/analytics/dashboard-metrics` | Summary metrics (total revenue, avg order, etc.) |
| `GET` | `/api/dashboard/business-metrics` | Revenue, orders, AOV |
| `GET` | `/api/dashboard/performance` | API latency, SSE stats |
| `GET` | `/api/dashboard/assistant-stats` | Intent distribution, function call data |

### 🤖 Assistant
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/assistant/query` | Main assistant endpoint (intent detection + function calling) |
| `GET` | `/api/assistant/health` | Health check (LLM + enhancement flags) |

---

## 🧠 Intelligent Assistant

The assistant detects **7 intents**:
1. `policy_question`  
2. `order_status`  
3. `product_search`  
4. `complaint`  
5. `chitchat`  
6. `off_topic`  
7. `violation`

### Key Features
- Loads its **personality and behavior** from `docs/prompts.yaml`
- Uses **keyword grounding** via `docs/ground-truth.json`
- Executes **registered functions**:
  - `getOrderStatus(orderId)`
  - `searchProducts(query, limit)`
  - `getCustomerOrders(email)`
- Validates citations like `[Policy3.1]` against `ground-truth.json`

---

## 💾 Database Setup (MongoDB Atlas)

### 1. Create a free cluster
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create an **M0 free tier** cluster  
- Whitelist all IPs (`0.0.0.0/0`)
- Create a **database user** with password

### 2. Get connection string
In your cluster, copy the connection string and replace credentials:


### 3. Add to `.env`
See `.env.example` for structure:


---

## 🧑‍💻 Seeding Data

Before testing, seed your database with realistic data:
- **Products:** 20–30 items across multiple categories  
- **Customers:** 10–15 profiles (include a demo user for testing)  
- **Orders:** 15–20 recent orders with mixed statuses  

You can use a script (`seed.js`), MongoDB Compass, or API POST requests.

---

## 🔄 Real-Time Order Tracking (SSE)

### Endpoint


### Behavior
- Sends the current status immediately  
- Auto-simulates status updates every few seconds:

- Updates both **database** and **live stream**
- Closes connection automatically when delivered

---

## 🧪 Testing

| Test Type | Description |
|------------|--------------|
| **API Tests** | Validates all endpoints, response formats, and errors |
| **Assistant Tests** | Covers all 7 intents and function calls |
| **Identity Tests** | Ensures assistant never reveals it’s an AI |
| **Integration Tests** | Full purchase + tracking + assistant conversation |
| **Analytics Tests** | Checks aggregation logic correctness |

All tests should return consistent JSON and use real database data.

---

## 🧭 Deployment

### Backend
Deploy on **Render** or **Railway** (free tier):
1. Connect your GitHub repo  
2. Add environment variables  
3. Deploy your Express API  

### Frontend
Deploy on **Vercel** with your `/apps/storefront/` project.

### LLM
In your Week 3 Colab, add:
```python
@app.route('/generate', methods=['POST'])
def generate():
  prompt = request.json.get('prompt')
  max_tokens = request.json.get('max_tokens', 500)
  response = model.generate(prompt, max_tokens=max_tokens)
  return jsonify({"text": response})

📊 Admin Dashboard (Frontend)

Your /admin or /dashboard page should visualize:

Business metrics: total revenue, total orders, AOV

Performance stats: latency, SSE connections, LLM timing

Assistant analytics: intent distribution, function call counts

System health: DB + LLM status

Use Recharts or Chart.js for visualization.

🧾 Submission Checklist

✅ MongoDB Atlas configured & seeded
✅ All REST endpoints working
✅ Analytics use database aggregation
✅ SSE stream auto-progresses order status
✅ Assistant supports all 7 intents + 3 functions
✅ Citation validation implemented
✅ Dashboard functional and auto-refreshing
✅ docs/prompts.yaml and docs/ground-truth.json complete
✅ .env.example provided (no secrets committed)
✅ Backend + Frontend + LLM all deployed