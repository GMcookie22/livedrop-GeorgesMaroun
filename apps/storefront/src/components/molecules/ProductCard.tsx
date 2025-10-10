import { Link } from "react-router-dom";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import type { Product } from "../../lib/api";
import { formatCurrency } from "../../lib/format"; // 👈 import here

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="font-semibold text-lg text-gray-800 mb-1">
          {product.title}
        </h2>

        {/* Use formatCurrency instead of toFixed */}
        <p className="text-blue-600 font-bold mb-2">
          {formatCurrency(product.price)}
        </p>

        <p className="text-sm text-gray-500 mb-3">Stock: {product.stockQty}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <Button onClick={onAddToCart} className="mt-auto w-full">
          Add to Cart
        </Button>
        <Link
          to={`/p/${product.id}`}
          className="text-center bg-gray-200 text-gray-800 font-medium py-2 rounded hover:bg-gray-300 transition-colors w-full mt-2"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
