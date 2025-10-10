# Component Prompts Log — Storefront v1

This document captures the exact types of prompts given to the AI to scaffold each part of the **Storefront v1** project.  
It follows the **Atomic Design** approach: Atoms → Molecules → Organisms → Templates → Pages → Lib.  
Each layer was designed to stay lightweight, composable, and testable within the Vite + React + Tailwind stack.

---

## 🧱 Atoms

**Prompt Used:**  
> “Create minimal, reusable atomic components (Button, Input, Card) using React and Tailwind.  
> Keep styles simple, flexible, and ready for Storybook documentation.”

**Output Summary:**  
- **Button** — accepts `variant` (`primary`, `secondary`, `outline`) and `size` props, supports `disabled` and `loading`.  
- **Input** — labeled input with accessibility attributes and consistent spacing.  
- **Card** — rounded container with shadow, used for product display and summaries.  

**Notes:**  
These are the smallest building blocks of the interface and are reused across molecules and organisms.

---

## ⚛️ Molecules

**Prompt Used:**  
> “Combine atoms into small UI clusters like `ProductCard` and `CartItem`.  
> Include props for product data, buttons, and simple interactions.”

**Output Summary:**  
- **ProductCard** — displays product image, title, formatted price, and an ‘Add to Cart’ button.  
- **CartItem** — shows product name, price, and quantity controls (+/-, remove).  

**Notes:**  
Both components are stateless; they rely on props and trigger events that the store handles.

---

## 🧬 Organisms

**Prompt Used:**  
> “Build reusable composite sections such as a CatalogGrid and CartDrawer using molecules.”

**Output Summary:**  
- **CatalogGrid** — responsive grid layout that maps `ProductCard`s.  
- **CartDrawer** — slide-over component listing all `CartItem`s with totals and checkout button.  

**Notes:**  
These represent self-contained UI areas that appear across multiple pages.

---

## 🏗️ Templates

**Prompt Used:**  
> “Create reusable page templates like `PageLayout` and `SupportPanel`.  
> Include headers, layout grids, and consistent spacing. Support responsive behavior.”

**Output Summary:**  
- **PageLayout** — global wrapper containing header, footer, navigation links, and space for dynamic content.  
- **SupportPanel** — floating ‘Ask Support’ widget connected to `engine.ts`, able to slide in/out on all routes.  

**Notes:**  
Templates define the overall page structure and maintain layout consistency.

---

## 📄 Pages

**Prompt Used:**  
> “Scaffold all Storefront pages — Catalog, Product, Cart, Checkout, and Order Status — wired with React Router and Zustand store.”

**Output Summary:**  
- **catalog.tsx** — displays all products with search, tag filter, and price sort.  
- **product.tsx** — renders product details, stock info, related products.  
- **cart.tsx** — shows current cart, editable quantities, totals.  
- **checkout.tsx** — displays order summary; generates fake order ID on submission.  
- **order-status.tsx** — retrieves order data from mock API and displays delivery status.  

**Notes:**  
Each page corresponds to a single user journey step, forming a complete flow:  
**Catalog → Product → Cart → Checkout → Order Status.**

---

## ⚙️ Lib / Assistant

**Prompt Used:**  
> “Add helper modules: mock API, formatter, Zustand store, and a lightweight support assistant engine.  
> Ensure they integrate without external dependencies.”

**Output Summary:**  
- **api.ts** — provides mock implementations for `listProducts()`, `getProduct()`, `placeOrder()`, and `getOrderStatus()`.  
- **format.ts** — handles currency and small text formatting utilities.  
- **store.ts** — Zustand-based cart state with localStorage persistence and helper actions.  
- **engine.ts** — basic keyword-matching support engine that references `ground-truth.json` and detects order IDs.  

**Notes:**  
These modules handle data flow and logic without a backend, keeping everything self-contained.

---

## 💬 Summary

All components and modules were scaffolded via prompt-based generation and refined manually for accuracy, performance, and accessibility.  
Each layer was designed to comply with the **assignment requirements**:
- Atomic design  
- Fast, minimal JS footprint  
- Accessible UI and focus management  
- Self-contained assistant logic (no external retrievals)  

This file serves as a transparent record of how AI assistance was used responsibly and efficiently to build Storefront v1.
