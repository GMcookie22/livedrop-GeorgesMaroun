// src/assistant/engine.js

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');
const mongoose = require('mongoose');
const AssistantLog = require('../models/AssistantLog');
const registry = require('./function-registry');
const { classifyIntent } = require('./intent-classifier');

// 🧾 Load assistant configuration + data
const configPath = path.join(__dirname, '../../../../docs/prompts.yaml');
const kbPath = path.join(__dirname, '../../../../docs/ground-truth.json');

const config = yaml.load(fs.readFileSync(configPath, 'utf-8'));
const knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));

// 🔗 LLM endpoint (Week 3 Colab)
const LLM_URL = process.env.LLM_URL + '/generate';

// === Helper: LLM request ===
async function queryLLM(prompt) {
  try {
    const res = await axios.post(
      LLM_URL,
      { prompt, max_tokens: 300 },
      { timeout: 10000 }
    );
    return res.data.text || res.data.response || 'No LLM response';
  } catch (err) {
    console.error('LLM Request Failed:', err.message);
    return null;
  }
}

// === Helper: Keyword-based policy retrieval ===
function matchPolicies(input) {
  const text = input.toLowerCase();
  const categories = {
    returns: ['return', 'refund', 'exchange', 'money back'],
    shipping: ['shipping', 'delivery', 'carrier', 'track'],
    warranty: ['warranty', 'guarantee', 'defect', 'broken'],
    privacy: ['privacy', 'data', 'information', 'personal'],
    security: ['security', 'safe', 'secure', 'payment']
  };

  let category = null;
  for (const [key, words] of Object.entries(categories)) {
    if (words.some(w => text.includes(w))) {
      category = key;
      break;
    }
  }

  return category
    ? knowledgeBase.filter(p => p.category === category)
    : [];
}

// === Helper: Citation validator ===
function checkCitations(text) {
  const regex = /\[(Policy\d+\.\d+|Shipping\d+\.\d+|Warranty\d+\.\d+|Privacy\d+\.\d+|Security\d+\.\d+|Returns\d+\.\d+)\]/g;
  const found = [...text.matchAll(regex)].map(m => m[1]);
  const valid = found.filter(id => knowledgeBase.some(p => p.id === id));
  const invalid = found.filter(id => !valid.includes(id));
  return { valid, invalid, isValid: invalid.length === 0 };
}

// === Helper: Extract ObjectId or Email ===
function getOrderId(input) {
  const match = input.match(/[a-f0-9]{24}/i);
  return match ? match[0] : null;
}

function getEmail(input) {
  const match = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

// === Helper: Status messages ===
function orderStatusMessage(status) {
  const map = {
    PENDING: 'Your order is being prepared.',
    PROCESSING: 'Your order is currently in process.',
    SHIPPED: 'Your order has been shipped!',
    DELIVERED: 'Your order has been delivered successfully.'
  };
  return map[status] || '';
}

// === Main assistant logic ===
async function handleAssistantQuery(userInput, context = {}) {
  const started = Date.now();
  const intent = classifyIntent(userInput);
  const calledFns = [];
  let reply = '';

  const assistant = config.identity.name || 'Luna';
  const company = config.identity.company || 'Shoplite';

  console.log(`🧭 Intent detected → ${intent}`);

  try {
    switch (intent) {
      case 'policy_question': {
        const found = matchPolicies(userInput);
        if (found.length) {
          const policy = found[0];
          reply = `${policy.answer} [${policy.id}]`;
        } else {
          reply = `I'm not finding that specific policy right now, but I can connect you to someone who can help. Would you like me to do that?`;
        }
        break;
      }

      case 'order_status': {
        const orderId = getOrderId(userInput) || context.orderId;
        const email = getEmail(userInput);

        if (email) {
          const orders = await registry.execute('getCustomerOrders', { email });
          calledFns.push('getCustomerOrders');

          if (!orders || orders.length === 0) {
            reply = `I couldn’t locate any orders linked to ${email}. Please ensure you used this email when ordering.`;
          } else {
            const list = orders.map(o => `#${o._id} (${o.status}, $${o.total})`).join(', ');
            reply = `Here are the recent orders for ${email}: ${list}. Would you like to check one of them in detail?`;
          }
        } else if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
          const status = await registry.execute('getOrderStatus', { orderId });
          calledFns.push('getOrderStatus');

          reply =
            status === 'Order not found'
              ? `No order found with ID ${orderId}. Please double-check the number.`
              : `Order ${orderId} is **${status}**. ${orderStatusMessage(status)}`;
        } else {
          reply = `Please provide your **order ID** or **email address** so I can locate your order.`;
        }
        break;
      }

      case 'product_search': {
        const results = await registry.execute('searchProducts', {
          query: userInput,
          limit: 5
        });
        calledFns.push('searchProducts');

        if (results.length) {
          const items = results.map(p => `${p.name} ($${p.price})`).join(', ');
          reply = `I found these products: ${items}. Want details on any of them?`;
        } else {
          reply = `I didn’t find any results for "${userInput}". Could you try a different keyword?`;
        }
        break;
      }

      case 'complaint': {
        reply = `I’m sorry you’re having trouble — your concern has been escalated to our support team. Someone will follow up within 24 hours. Is there anything else I can assist with?`;
        break;
      }

      case 'chitchat': {
        if (/who are you|your name/i.test(userInput)) {
          reply = `I’m ${assistant}, ${config.identity.role} at ${company}. How can I help today?`;
        } else if (/are you (a )?robot|ai|human/i.test(userInput)) {
          reply = `I’m ${assistant}, your digital support assistant here at ${company}.`;
        } else if (/who made you|who created/i.test(userInput)) {
          reply = `I’m part of ${company}’s customer care system.`;
        } else if (/how are you|how r u/i.test(userInput)) {
          reply = `I’m doing great! How can I assist you today?`;
        } else if (/thank|thanks/i.test(userInput)) {
          reply = `You’re very welcome! 😊`;
        } else if (/^(hi|hello|hey)/i.test(userInput)) {
          reply = `Hi there! I’m ${assistant} from ${company}. How can I help you today?`;
        } else if (/help|need help/i.test(userInput)) {
          reply = `Of course! I can help with tracking orders, product info, or store policies. What do you need help with?`;
        } else {
          reply = `Hey! I’m ${assistant}, your ${config.identity.role} at ${company}. What can I help you with?`;
        }
        break;
      }

      case 'violation': {
        reply = `Let's keep our chat respectful 🙂 I'm here to help with anything related to ${company}.`;
        break;
      }

      default: {
        reply = `That’s a little outside my expertise, but I can help with orders, products, or policies from ${company}.`;
        break;
      }
    }
  } catch (err) {
    console.error('Assistant processing error:', err);
    reply = `Sorry, something went wrong while processing your request. Please try again in a bit.`;
  }

  // Validate citations
  const citationCheck = checkCitations(reply);
  if (!citationCheck.isValid)
    console.warn('⚠️ Invalid citations found:', citationCheck.invalid);

  // Log query
  const duration = Date.now() - started;
  try {
    await AssistantLog.create({
      intent,
      userInput,
      functionsCalled: calledFns.length ? calledFns : [],
      responseTime: duration,
      timestamp: new Date()
    });
    console.log(`🗒️ Logged ${intent} query (${duration}ms)`);
  } catch (err) {
    console.error('Failed to save assistant log:', err);
  }

  return {
    text: reply,
    intent,
    functionsCalled: calledFns,
    citations: citationCheck.valid,
    citationValidation: citationCheck,
    responseTime: duration
  };
}

module.exports = { handleAssistantQuery, checkCitations };
