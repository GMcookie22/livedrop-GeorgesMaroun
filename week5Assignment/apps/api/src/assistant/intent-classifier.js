// src/assistant/intent-classifier.js

function detectIntent(input) {
  const msg = input.toLowerCase().trim();

  // ======================================
  // 1️⃣  INAPPROPRIATE / VIOLATION CHECK
  // ======================================
  const badWords = [
    'stupid', 'idiot', 'dumb', 'hate', 'shut up', 'useless',
    'fuck', 'shit', 'damn', 'ass', 'bitch', 'crap'
  ];

  if (badWords.some(w => msg.includes(w))) {
    return 'violation';
  }

  // ======================================
  // 2️⃣  POLICY OR COMPANY RULE QUESTIONS
  // ======================================
  const policyTriggers = [
    /return|refund|exchange|money back|send back|give back/i,
    /ship|shipping|delivery|deliver|carrier|transport|freight/i,
    /warranty|guarantee|defect|broken|faulty|malfunction/i,
    /privacy|data|personal information|gdpr|ccpa/i,
    /security|secure|safe|payment.*safe|fraud|encryption/i,
    /policy|policies|terms|conditions|agreement/i
  ];
  if (policyTriggers.some(rx => rx.test(msg))) {
    return 'policy_question';
  }

  // ======================================
  // 3️⃣  ORDER STATUS / TRACKING REQUESTS
  // ======================================
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(msg);

  if (hasEmail && /order|orders/i.test(msg)) {
    return 'order_status';
  }

  const orderKeywords = /order|track|status|where.*my|shipped|delivery|arrived|package/i;
  if (orderKeywords.test(msg)) {
    if (
      /where.*order|track.*order|order.*status|my order|check.*order|all.*orders|my orders/i.test(msg) ||
      /when.*arrive|when.*get|when.*deliver|estimated.*delivery/i.test(msg) ||
      /[a-f0-9]{24}/i.test(msg) // possible Mongo ObjectId
    ) {
      return 'order_status';
    }
  }

  // ======================================
  // 4️⃣  PRODUCT SEARCH / SHOPPING INTENT
  // ======================================
  if (/find|search|show|looking for|want to buy|need|available|in stock/i.test(msg)) {
    if (!/policy|return|refund|warranty/i.test(msg)) {
      return 'product_search';
    }
  }

  if (/product|item|price|cost|category|catalog|browse/i.test(msg)) {
    return 'product_search';
  }

  if (/do you (have|sell)|what.*sell|what kind of/i.test(msg)) {
    return 'product_search';
  }

  // ======================================
  // 5️⃣  COMPLAINT OR NEGATIVE FEEDBACK
  // ======================================
  const complaintList = [
    /not working/i,
    /doesn't work/i,
    /broken/i,
    /damaged/i,
    /problem/i,
    /issue/i,
    /didn't receive/i,
    /did not receive/i,
    /never (got|received|arrived)/i,
    /late/i,
    /delayed/i,
    /bad quality/i,
    /wrong (item|product|order)/i,
    /missing/i,
    /defective/i,
    /disappointed/i,
    /unhappy/i,
    /unsatisfied/i
  ];
  if (complaintList.some(rx => rx.test(msg))) {
    return 'complaint';
  }

  // ======================================
  // 6️⃣  CASUAL / FRIENDLY CHITCHAT
  // ======================================
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))($|[^a-z])/i.test(msg)) {
    return 'chitchat';
  }

  if (/^(thank|thanks|thank you|appreciate|grateful)($|[^a-z])/i.test(msg)) {
    return 'chitchat';
  }

  if (/who are you|what.*your name|your name|are you (a )?robot|are you (an )?ai|are you human|who created you/i.test(msg)) {
    return 'chitchat';
  }

  if (/how are you|how're you|how r u/i.test(msg)) {
    return 'chitchat';
  }

  if (/^(help|can you help|help me|need help)($|[^a-z])/i.test(msg)) {
    return 'chitchat';
  }

  // ======================================
  // 7️⃣  OTHERWISE → OFF-TOPIC
  // ======================================
  return 'off_topic';
}

module.exports = { detectIntent };
