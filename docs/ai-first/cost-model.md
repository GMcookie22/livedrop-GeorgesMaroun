# Cost Model – ShopLite AI Touchpoints


*Typeahead Search*

## Assumptions
- Model: GPT-4o-mini at $0.15 /1K prompt tokens, $0.60 /1K completion tokens
- Avg tokens in: 80   Avg tokens out: 20
- Requests/day: 50,000
- Cache hit rate: 70% 

## Calculation
Cost/action = (tokens_in/1000 * prompt_price) + (tokens_out/1000 * completion_price)
Daily cost = Cost/action * Requests/day * (1 - cache_hit_rate)

## Results
- Typeahead Search: Cost/action = $0.024, Daily = $360

## Cost lever if over budget
- Shorten context to fewer tokens
- Use a cheaper model (e.g., Llama 3.1 8B)
- Increase cache hit rate
- Only call LLM on low-confidence search queries


*Support Assistant*

## Assumptions
- Model: GPT-4o-mini at $0.15 /1K prompt tokens, $0.60 /1K completion tokens
- Avg tokens in: 400   Avg tokens out: 150
- Requests/day: 1,000
- Cache hit rate: 30% (apply miss cost only if caching is used)

## Calculation
Cost/action = (tokens_in/1000 * prompt_price) + (tokens_out/1000 * completion_price)
Daily cost = Cost/action * Requests/day * (1 - cache_hit_rate)

## Results
- Support assistant: Cost/action = $0.150, Daily = $105

## Cost lever if over budget
- Shorten context to fewer tokens
- Use a cheaper model for low-risk queries
- Increase cache hit rate
- Only call LLM on low-confidence questions
