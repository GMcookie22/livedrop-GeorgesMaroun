# AI Capability Map – ShopLite  
(click on Alt+Z if the word wrap in on and the table is not clear)

| Capability              | Intent (user)                      | Inputs (this sprint)   |Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback              | Selected |
|_________________________|____________________________________|________________________|_______________|________|__________________|_______________________|__________|
| Search typeahead        | Find products faster while typing  | Product names, SKUs    | 2             | 300    | $0.024           | Normal keyword search |    X     |
| Support assistant       | Quick answers to FAQ / order info  | FAQ file, order API    | 3             | 1200   | $0.150           | FAQ page + human help |    X     |
| Product Q&A bot         | Ask about product details          | Product descriptions   | 4             | 1500   | $0.015           | Show product page     |          |
| Auto categorization     | Put new products in right category | Title + description    | 4             | 2000   | $0.010           | Manual tagging        |          |
| Recommendations         | Suggest similar/popular items      | Browsing history       | 5             | 1800   | $0.020           | Show bestsellers      |          |
 

(click on Alt+Z if the word wrap in off for a clearer screen)

## Why these two
I selected 'Typeahead Search' and 'Support Assistant' because they have a direct impact on key performance indicators (KPIs). 
These two features improve important business metrics. 
Typeahead Search helps customers find products faster, increasing conversion rates. 
Support Assistant answers questions instantly, reducing support contact rates and making customers happier. 
Both features have low integration risk and can be implemented easily in this sprint.