// src/components/molecules/CartItemCard.tsx
import Button from "../atoms/Button";
import QuantityControl from "./QuantityControl";
import type { CartItem } from "../../lib/api";

interface CartItemCardProps {
  item: CartItem;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

export default function CartItemCard({
  item,
  updateQty,
  removeItem,
}: CartItemCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex-1">
        <div className="font-semibold text-lg">{item.title}</div>
        <div className="text-gray-600">${item.price.toFixed(2)}</div>
      </div>

      <QuantityControl
        qty={item.qty}
        onIncrease={() => updateQty(item.id, item.qty + 1)}
        onDecrease={() => updateQty(item.id, item.qty - 1)}
      />

      <Button
        onClick={() => removeItem(item.id)}
        variant="danger"
        className="mt-2 sm:mt-0"
      >
        Remove
      </Button>
    </div>
  );
}
