import { render, screen } from "@testing-library/react";
import Text from "./Text";
import { describe, it, expect } from "vitest";

describe("Text component", () => {
  it("renders children correctly", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<Text className="text-red-500">Colored Text</Text>);
    const element = screen.getByText("Colored Text");
    expect(element).toHaveClass("text-red-500");
  });
});
