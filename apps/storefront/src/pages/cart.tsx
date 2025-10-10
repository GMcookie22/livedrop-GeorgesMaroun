import { useCartStore } from "../lib/store";
import { Link } from "react-router-dom";
import CartItemCard from "../components/molecules/CartItemCard";
import Button from "../components/atoms/Button";
import { formatCurrency } from "../lib/format";
import { MainLayout } from "../components/templates/MainLayout";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-blue-600">Add some products to your cart first.</p>
          <div className="mt-6">
            <Link to="/" className="text-blue-600 hover:underline">
              &larr; Back to Catalog
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              updateQty={updateQty}
              removeItem={removeItem}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded">
          <div className="text-lg font-semibold">
            Total: {formatCurrency(total)}
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button onClick={clearCart} variant="secondary">
              Clear Cart
            </Button>
            <Button
              onClick={() => (window.location.href = "/checkout")}
              variant="primary"
            >
              Checkout
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Back to Catalog
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

