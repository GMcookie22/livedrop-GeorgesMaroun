// src/components/molecules/ChatInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatInput";

describe("ChatInput component", () => {
  it("renders input and button", () => {
    render(<ChatInput value="" onChange={() => {}} onSubmit={() => {}} />);
    expect(
      screen.getByPlaceholderText("Type your question...")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(<ChatInput value="" onChange={handleChange} onSubmit={() => {}} />);
    const input = screen.getByPlaceholderText("Type your question...");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(handleChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onSubmit when form is submitted", () => {
    const handleSubmit = vi.fn();
    render(<ChatInput value="" onChange={() => {}} onSubmit={handleSubmit} />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
