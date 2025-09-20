# Touchpoint Specifications



## Touchpoint 1: Support Assistant

### Problem Statement
The Support Assistant helps customers get quick answers to common questions. This reduces work for human support agents and makes customers happier by giving help faster.

### Happy Path
1- User starts a chat with the Support Assistant.
2- Assistant greets the user and asks what they need.
3- User types their question.
4- Assistant looks up the answer in the knowledge base.
5- Assistant shows the answer to the user.
6- User can ask more questions.
7- Assistant keeps answering until the user is done.
8- User ends the chat.
9- Assistant saves the conversation for later.
10- User is asked to give feedback.

### Grounding & Guardrails
- Source of truth: Company knowledge base and FAQ documents.
- Retrieval scope: Limited to predefined topics and questions.
- Max context: 500 tokens.
- Refusal outside scope: Assistant tells the user if it can’t answer.

### Human-in-the-loop
- Escalation triggers: If the assistant cannot answer after three attempts.
- UI surface: A button to contact a human agent.
- Reviewer and SLA: Human agents will handle these cases within 1 hour.

### Latency Budget
- Total p95 target: 1200 ms
  - User greeting: 100 ms
  - Query processing: 300 ms
  - Information retrieval: 500 ms
  - Response delivery: 300 ms
- Cache strategy: 30% of requests will hit the cache, reducing retrieval time.

### Error & Fallback Behavior
- If the assistant fails to retrieve an answer, it will apologize and suggest contacting support.
- The chat will be saved for later analysis.

### PII Handling
- No personal information will be stored or sent.
- Sensitive information will be hidden or anonymized.
- Only chat logs will be saved, without any personal details.

### Success Metrics
- Product metric 1: Time for first answer (goal ≤ 300 ms).
- Product metric 2: User satisfaction (goal ≥ 80% positive feedback).
- Business metric: Fewer support tickets (goal: 20% reduction).

### Feasibility Note
The data is already in the company knowledge base. The assistant will use the existing order-status API for questions about orders. The next step is to connect the assistant to the chat interface for testing.



## Touchpoint 2: Typeahead Search

### Problem Statement
The Typeahead Suggestions feature helps users find products faster by giving real-time suggestions as they type. This makes searching easier and reduces the chance that users leave without finding what they want.

### Happy Path
1- User starts typing in the search bar.
2- The system reads the input in real time.
3- Typeahead looks for matching products in the database.
4- Suggested products appear below the search bar.
5- User clicks a suggestion.
6- The system opens the product page.
7- User sees the product details.
8- User can add the product to the cart.
9- User keeps shopping or goes to checkout.
10- The system saves the interaction for analytics.

### Grounding & Guardrails
- Source of truth: Product database.
- Retrieval scope: Limited to product names and categories.
- Max context: 300 tokens.
- Refusal outside scope: The system will not provide suggestions for non-product queries.

### Human-in-the-loop
- Escalation triggers: If the system fails to provide suggestions after three attempts.
- UI surface: A prompt to contact support for assistance.
- Reviewer and SLA: Human review of failed queries will occur weekly.

### Latency Budget
- Total p95 target: 300 ms
  - Input capture: 50 ms
  - Query processing: 150 ms
  - Suggestion delivery: 100 ms
- Cache strategy: 70% of requests will hit the cache, improving response time.

### Error & Fallback Behavior
- If no suggestions appear, the system will tell the user to try another search.
- The system keeps the interaction to make suggestions better next time.

### PII Handling
- No personal information will be collected or saved.
- Sensitive information will be hidden or anonymized.
- Only search queries are logged, without any personal details.

### Success Metrics
- Product metric 1: Time to show suggestions (goal ≤ 150 ms).
- Product metric 2: Click rate on suggestions (goal ≥ 30%).
- Business metric: More purchases from search (goal ≥ 15% increase).

### Feasibility Note
The product database can be accessed using the existing API. The next step is to test the suggestion system with real user searches.