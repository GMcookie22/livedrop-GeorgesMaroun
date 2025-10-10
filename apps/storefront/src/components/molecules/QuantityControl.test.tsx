// src/components/molecules/QuantityControl.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import QuantityControl from "./QuantityControl";

describe("QuantityControl component", () => {
  it("renders current quantity", () => {
    render(
      <QuantityControl qty={5} onIncrease={() => {}} onDecrease={() => {}} />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onIncrease when + button is clicked", () => {
    const onIncrease = vi.fn();
    render(
      <QuantityControl qty={0} onIncrease={onIncrease} onDecrease={() => {}} />
    );
    fireEvent.click(screen.getByText("+"));
    expect(onIncrease).toHaveBeenCalled();
  });

  it("calls onDecrease when - button is clicked", () => {
    const onDecrease = vi.fn();
    render(
      <QuantityControl qty={0} onIncrease={() => {}} onDecrease={onDecrease} />
    );
    fireEvent.click(screen.getByText("-"));
    expect(onDecrease).toHaveBeenCalled();
  });
});
