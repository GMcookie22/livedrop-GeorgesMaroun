https://excalidraw.com/#json=BXaqiub-2MLdJxXq09UTc,1Kt-ufExBVdwvMKdWvVZXg

In this link you can find my:
- High-level architecture diagram
- Data model sketches
- API contract outline (public API + internal APIs)
- Invalidation strategy
- Tradeoffs and reasoning for key choices







LiveDrop System Design – Explanation

GOAL
_____

The system is built to handle flash-sale live drops.
Creators can launch limited products, and users can:
- Follow them
- Get real-time alerts
- Place orders without overselling


MAIN IDEA
__________

The system uses microservices (small services that do one job) and an event system to send updates quickly.


CHOICES
________

- Client (App/Website) : where users see products, follow creators, and buy items.
- API Gateway : the single entry point. Handles login, security, and routes requests to the right service.
- Services :
  User Service → users, follows, follower lists
  Product Service → product info and browsing
  Drop Service → drop schedule and status (upcoming → live → ended)
  Order Service → order handling, prevents duplicates
  Inventory Service → stock management, no overselling
  Notification Service → alerts (drop started, stock low, order confirmed)
- Database : stores all real data (users, products, orders, stock).
- Cache (e.g., Redis) : stores popular/frequent data. Gets refreshed when database changes.
- Kafka : event system that sends messages between services (DropStarted,OrderPlaced,StockLow,...)
- Notifications : listens to events and sends updates (under 2s).
- CDN + Storage : delivers product images and videos quickly.
- Cache Management : background process to keep cache updated.


SYSTEM PROPERTY
________________

- Scalable : handles big traffic spikes
- Reliable : orders use unique keys, no double selling
- Fast : reads under 200ms & orders under 500ms
- Secure : gateway checks login and permissions



So in the end the system is complex cause it contains many services, cache & events. It handles spikes smoothly. It uses database and cache (DB is truth, cache is for speed).
It is a fast, scalable and sfe system that can handle normal traffic and millions of users during big live drops.