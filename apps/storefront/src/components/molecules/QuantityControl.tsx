// src/components/molecules/QuantityControl.tsx
import Button from "../atoms/Button";

interface QuantityControlProps {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityControl({
  qty,
  onIncrease,
  onDecrease,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onDecrease} variant="secondary">
        -
      </Button>
      <span className="px-2">{qty}</span>
      <Button onClick={onIncrease} variant="secondary">
        +
      </Button>
    </div>
  );
}
