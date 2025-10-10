import { render, screen } from "@testing-library/react";
import Badge from "./Badge";
import { describe, expect, test } from "vitest";

describe("Badge component", () => {
  test("renders the badge with text", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toBeInTheDocument();
  });

  test("applies the correct styles", () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText("Test");
    expect(badge).toHaveClass(
      "inline-block",
      "text-xs",
      "bg-gradient-to-r",
      "from-blue-50",
      "to-indigo-50",
      "text-blue-700",
      "px-3",
      "py-1",
      "rounded-full",
      "font-medium",
      "border",
      "border-blue-200",
      "shadow-sm"
    );
  });
});
