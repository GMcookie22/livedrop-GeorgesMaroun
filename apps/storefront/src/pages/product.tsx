import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, listProducts } from "../lib/api";
import type { Product } from "../lib/api";
import { useCartStore } from "../lib/store";
import Button from "../components/atoms/Button";
import Tag from "../components/atoms/Tag";
import { formatCurrency } from "../lib/format";
import { MainLayout } from "../components/templates/MainLayout";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getProduct(id!);
        if (!prod) {
          setError("Product not found");
          return;
        }
        setProduct(prod);

        const products = await listProducts();
        setAllProducts(products.filter((p) => p.id !== id)); // exclude current
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.tags.some((tag) => product.tags.includes(tag)))
      .slice(0, 3);
  }, [product, allProducts]);

  if (loading)
    return (
      <MainLayout>
        <p className="p-6">Loading product...</p>
      </MainLayout>
    );
  if (error)
    return (
      <MainLayout>
        <p className="p-6 text-red-600">{error}</p>
      </MainLayout>
    );
  if (!product) return null;

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg shadow"
          />

          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-blue-600 font-bold text-2xl mb-4">
              {formatCurrency(product.price)}
            </p>
            <p className="text-gray-700 mb-4">
              Stock:{" "}
              {product.stockQty > 0 ? (
                <span className="text-green-600">
                  {product.stockQty} available
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <Button
              onClick={() =>
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  qty: 1,
                })
              }
              disabled={product.stockQty === 0}
              className={`mt-auto w-full ${
                product.stockQty === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {product.stockQty === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/p/${p.id}`}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">
                      {p.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-sm mt-auto">
                      {formatCurrency(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Back to Catalog
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
