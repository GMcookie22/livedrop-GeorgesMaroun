import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";
import { describe, it, expect } from "vitest";

describe("Input component", () => {
  it("renders with placeholder text", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("updates value when typed into", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("can be disabled", () => {
    render(<Input placeholder="Enter text" disabled />);
    const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
