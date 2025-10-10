// src/components/molecules/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "./ProductCard";

const mockProduct = {
  id: "1",
  title: "Sample Product",
  price: 19.99,
  stockQty: 5,
  image: "https://via.placeholder.com/150",
  tags: ["New", "Sale"],
};

describe("ProductCard component", () => {
  it("renders product details", () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    expect(screen.getByText("Sample Product")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("Stock: 5")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Sale")).toBeInTheDocument();
  });

  it("calls onAddToCart when button is clicked", () => {
    const handleAdd = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAdd} />);
    const button = screen.getByText("Add to Cart");
    fireEvent.click(button);
    expect(handleAdd).toHaveBeenCalled();
  });

  it("renders link to product page", () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    const link = screen.getByText("View Product");
    expect(link).toHaveAttribute("href", "/p/1");
  });
});
