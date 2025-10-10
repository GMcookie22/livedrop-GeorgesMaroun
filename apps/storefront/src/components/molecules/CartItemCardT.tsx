import { render, screen, fireEvent } from "@testing-library/react";
import CartItemCard from "./CartItemCard.tsx";

import { describe, it, expect, vi } from "vitest";

const mockItem = {
  id: "1",
  title: "Test Item",
  price: 25,
  qty: 2,
};

describe("CartItemCard", () => {
  it("renders the item title and price", () => {
    render(
      <CartItemCard
        item={mockItem}
        updateQty={vi.fn()()}
        removeItem={vi.fn()}
      />
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("calls updateQty when QuantityControl buttons are clicked", () => {
    const updateQtyMock = vi.fn();
    render(
      <CartItemCard
        item={mockItem}
        updateQty={updateQtyMock}
        removeItem={vi.fn()}
      />
    );

    const increaseBtn = screen.getByRole("button", { name: "+" });
    const decreaseBtn = screen.getByRole("button", { name: "-" });

    fireEvent.click(increaseBtn);
    fireEvent.click(decreaseBtn);

    expect(updateQtyMock).toHaveBeenCalledTimes(2);
  });

  it("calls removeItem when Remove button is clicked", () => {
    const removeItemMock = vi.fn();
    render(
      <CartItemCard
        item={mockItem}
        updateQty={vi.fn()}
        removeItem={removeItemMock}
      />
    );

    const removeBtn = screen.getByText("Remove");
    fireEvent.click(removeBtn);

    expect(removeItemMock).toHaveBeenCalledWith("1");
  });
});
