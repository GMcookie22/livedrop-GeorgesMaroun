const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // adjust path if needed

const router = express.Router();

// === Internal state ===
const clientStreams = new Map(); // orderId => Set<res>
const activeSimulations = new Map(); // orderId => { active: bool, timers: [] }

// === Utilities ===

// Send an SSE message
function pushEvent(res, event, payload, id) {
  if (id !== undefined) res.write(`id: ${id}\n`);
  if (event) res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// Notify all clients listening to one order
async function notify(orderId, event, payload) {
  const listeners = clientStreams.get(orderId);
  if (!listeners) return;
  for (const res of listeners) {
    try {
      pushEvent(res, event, payload, payload.eventId || Date.now());
    } catch {
      // ignore failed connections
    }
  }
}

// Advance to next order status
async function moveToNextStatus(order) {
  const stages = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const index = stages.indexOf(order.status);
  if (index === -1 || index === stages.length - 1) return order;

  order.status = stages[index + 1];
  order.updatedAt = new Date();
  await order.save();
  return order;
}

// Clean up timers and mark simulation stopped
function stopSimulation(orderId) {
  const sim = activeSimulations.get(orderId);
  if (!sim) return;
  sim.timers.forEach(clearTimeout);
  activeSimulations.delete(orderId);
}

// Simulate order lifecycle
function runSimulation(orderId, deterministic = false) {
  const existing = activeSimulations.get(orderId);
  if (existing?.active) return;

  const sim = { active: true, timers: [] };
  activeSimulations.set(orderId, sim);

  const proceed = async () => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return stopSimulation(orderId);

      if (order.status === 'DELIVERED') {
        await notify(orderId, 'status', {
          orderId,
          status: 'DELIVERED',
          updatedAt: order.updatedAt,
          eventId: Date.now()
        });
        return stopSimulation(orderId);
      }

      const delayMap = {
        PENDING: [3000, 5000],
        PROCESSING: [5000, 7000],
        SHIPPED: [5000, 7000]
      };

      const [min, max] = delayMap[order.status] || [4000, 6000];
      const wait = deterministic ? 60 : Math.floor(Math.random() * (max - min + 1)) + min;

      const timer = setTimeout(async () => {
        try {
          const updated = await moveToNextStatus(order);
          await notify(orderId, 'status', {
            orderId,
            status: updated.status,
            carrier: updated.carrier || null,
            estimatedDelivery: updated.estimatedDelivery || null,
            updatedAt: updated.updatedAt,
            eventId: Date.now()
          });

          if (updated.status !== 'DELIVERED') proceed();
          else stopSimulation(orderId);
        } catch (err) {
          console.error(err);
          stopSimulation(orderId);
        }
      }, wait);

      sim.timers.push(timer);
    } catch (err) {
      console.error(err);
      stopSimulation(orderId);
    }
  };

  proceed();
}

// === SSE route ===
router.get('/:id/stream', async (req, res) => {
  const { id: orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId))
    return res.status(400).json({ error: 'Invalid order ID' });

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.flushHeaders();

  // Keep connection alive
  const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 25000);

  if (!clientStreams.has(orderId)) clientStreams.set(orderId, new Set());
  clientStreams.get(orderId).add(res);

  try {
    const order = await Order.findById(orderId).lean();
    if (!order) {
      pushEvent(res, 'error', { message: 'Order not found' }, Date.now());
      res.end();
      clearInterval(keepAlive);
      return;
    }

    pushEvent(res, 'status', {
      orderId,
      status: order.status,
      carrier: order.carrier || null,
      estimatedDelivery: order.estimatedDelivery || null,
      updatedAt: order.updatedAt || order.createdAt,
      eventId: Date.now()
    });
  } catch (err) {
    pushEvent(res, 'error', { message: 'Server error' }, Date.now());
    res.end();
    clearInterval(keepAlive);
    return;
  }

  const deterministic = req.query.deterministic === 'true';
  runSimulation(orderId, deterministic);

  req.on('close', () => {
    clearInterval(keepAlive);
    const set = clientStreams.get(orderId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) clientStreams.delete(orderId);
  });
});

// Helper to check how many live SSE clients exist
function countLiveClients() {
  let total = 0;
  for (const set of clientStreams.values()) total += set.size;
  return total;
}

module.exports = { router, countLiveClients };
