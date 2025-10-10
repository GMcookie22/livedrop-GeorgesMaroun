import { useEffect, useState, useMemo } from "react";
import { listProducts } from "../lib/api";
import type { Product } from "../lib/api";
import { useCartStore } from "../lib/store";
import { Link } from "react-router-dom";
import Input from "../components/atoms/Input";
import ProductCard from "../components/molecules/ProductCard";
import { MainLayout } from "../components/templates/MainLayout";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [tagFilter, setTagFilter] = useState<string>("");

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    if (tagFilter) {
      filtered = filtered.filter((p) => p.tags.includes(tagFilter));
    }
    return filtered.sort((a, b) =>
      sort === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [products, search, sort, tagFilter]);

  if (loading)
    return (
      <MainLayout>
        <p className="p-6">Loading products...</p>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <p className="p-6 text-red-600">{error}</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/cart" className="text-blue-600 hover:underline">
            View Cart
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Catalog</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() =>
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  qty: 1,
                })
              }
            />
          ))}

          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
