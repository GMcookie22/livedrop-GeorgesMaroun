import { render, screen } from "@testing-library/react";
import Card from "./Card";
import { describe, test, expect } from "vitest";

describe("Card component", () => {
  test("renders the card with children text", () => {
    render(<Card>Hello</Card>);
    const card = screen.getByText("Hello");
    expect(card).toBeInTheDocument();
  });

  test("applies the default 'support' variant styles", () => {
    render(<Card>Support</Card>);
    const card = screen.getByText("Support");
    expect(card).toHaveClass(
      "bg-white",
      "border",
      "border-gray-200",
      "text-gray-900"
    );
  });

  test("applies the 'user' variant styles", () => {
    render(<Card variant="user">User</Card>);
    const card = screen.getByText("User");
    expect(card).toHaveClass(
      "bg-gradient-to-br",
      "from-blue-500",
      "to-blue-600",
      "text-white"
    );
  });
});
