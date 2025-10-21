// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const { handleAssistantQuery } = require('../assistant/engine');

// 🧠 POST /api/assistant/query
router.post('/query', async (req, res) => {
  try {
    const { message, context } = req.body;

    // ✅ Basic validation
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'A non-empty string "message" field is required.'
      });
    }

    const start = Date.now();
    const output = await handleAssistantQuery(message, context ?? {});
    const duration = Date.now() - start;

    output.meta = {
      duration: `${duration}ms`,
      at: new Date().toISOString()
    };

    res.json(output);
  } catch (err) {
    console.error('Assistant route error:', err);
    res.status(500).json({
      error: 'Assistant service unavailable',
      text: "Sorry — I'm having trouble responding right now."
    });
  }
});

// 💚 GET /api/assistant/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    llm: {
      active: Boolean(process.env.LLM_URL),
      enhancement: process.env.USE_LLM_ENHANCEMENT === 'true'
    }
  });
});

module.exports = router;
