# Evaluation

## Retrieval Quality Tests (10 tests)

| Test ID | Question | Expected Documents | Pass Criteria |
|---------|----------|--------------------|---------------|
| R01 | How do I create a seller account? | Document 7: Becoming a Seller | Retrieved docs contain expected titles |
| R02 | What are Shoplite’s return policies? | Document 5: Returns and Refunds | Retrieved docs contain expected titles |
| R03 | How do I track my order? | Document 4: Tracking Your Orders | Retrieved docs contain expected titles |
| R04 | How do I add items to the cart? | Document 2: Using the Shopping Cart | Retrieved docs contain expected titles |
| R05 | How can I pay safely on Shoplite? | Document 3: Paying Safely on Shoplite | Retrieved docs contain expected titles |
| R06 | How do I write a product review? | Document 6: Writing Reviews | Retrieved docs contain expected titles |
| R07 | How do I manage inventory as a seller? | Document 8: Managing Inventory | Retrieved docs contain expected titles |
| R08 | How do I apply promo codes? | Document 14: Promo Codes | Retrieved docs contain expected titles |
| R09 | What features are available in the mobile app? | Document 11: The Mobile App | Retrieved docs contain expected titles |
| R10 | How do I access developer tools? | Document 12: Developer Tools | Retrieved docs contain expected titles |



## Response Quality Tests (15 tests)

| Test ID | Question | Required Keywords | Forbidden Terms | Expected Behavior |
|---------|----------|-------------------|-----------------|-------------------|
| Q01 | How do I create a seller account? | ["seller registration", "business verification", "2-3 business days"] | ["instant approval", "no verification required", "personal accounts"] | Direct answer with citation |
| Q02 | What are Shoplite’s return policies and timeline? | ["30-day return window", "order tracking", "return authorization"] | ["lifetime returns", "no returns accepted"] | Clear multi-step answer |
| Q03 | How do I track my order status? | ["tracking number", "notifications", "Shoplite account"] | ["lost package", "no tracking"] | Direct answer with citation |
| Q04 | How can I add items to my cart and save for later? | ["add items", "save for later", "promo codes"] | ["cannot save", "single seller only"] | Step-by-step guidance |
| Q05 | How do I pay safely on Shoplite? | ["credit cards", "encryption", "PayPal", "gift cards"] | ["cash only", "unsecured payment"] | Security-focused answer |
| Q06 | How do I write a product review? | ["write a review", "star rating"] | ["fake review", "mandatory review"] | Direct and concise answer |
| Q07 | How can I manage my inventory? | ["seller dashboard", "manage inventory"] | ["no tracking", "manual only"] | Step-by-step explanation |
| Q08 | What fees do sellers pay? | ["commission", "percentage of sale", "real-time dashboard"] | ["hidden fees", "extra charges"] | Accurate answer with numbers |
| Q09 | How can I contact customer support? | ["contact customer support", "email", "live chat"] | ["no support available", "chat only"] | Clear answer with options |
| Q10 | What features does the Shoplite mobile app provide? | ["browse products", "track orders", "notifications"] | ["limited features", "desktop only"] | Comprehensive answer |
| Q11 | How can I use Shoplite promo codes? | ["promotional code", "checkout process", "restrictions"] | ["invalid codes", "automatic discounts"] | Step-by-step instructions |
| Q12 | How do I find products on Shoplite? | ["search", "filters", "categories", "sorting"] | ["random browsing only"] | Direct and clear answer |
| Q13 | How do I give feedback to Shoplite? | ["feedback form", "suggestions", "report problems"] | ["ignore feedback"] | Clear and actionable answer |
| Q14 | What are Shoplite’s security and privacy measures? | ["SSL encryption", "PCI DSS compliance"] | ["data sharing without consent", "unsafe payments"] | Detailed answer with examples |
| Q15 | How do I join the affiliate program? | ["affiliate program", "dashboard", "earn money"] | ["no tracking", "unpaid program"] | Step-by-step answer with benefits |



## Edge Case Tests (5 tests)

| Test ID | Scenario | Expected Response Type |
|---------|----------|------------------------|
| E01 | Question not in knowledge base | Refusal with explanation |
| E02 | Ambiguous question | Clarification request |
| E03 | Question about unsupported payment methods | Refusal with explanation |
| E04 | Question referencing multiple unrelated documents | Complex multi-document synthesis |
| E05 | Question with missing keywords | Clarification request |
