import { render, screen } from "@testing-library/react";

import Tag from "./Tag";
import { describe, it, expect } from "vitest";

describe("Tag component", () => {
  it("renders the tag with children text", () => {
    render(<Tag>New</Tag>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies additional className if provided", () => {
    render(<Tag className="custom-class">Sale</Tag>);
    const tag = screen.getByText("Sale");
    expect(tag).toHaveClass("custom-class");
  });

  it("renders correctly with empty className", () => {
    render(<Tag className="">Hello</Tag>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
