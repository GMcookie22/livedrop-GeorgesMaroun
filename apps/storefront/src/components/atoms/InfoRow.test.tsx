import { render, screen } from "@testing-library/react";
import InfoRow from "./InfoRow";
import { describe, it, expect } from "vitest";

describe("InfoRow component", () => {
  it("renders the label and value correctly", () => {
    render(<InfoRow label="Name" value="John Doe" />);
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("applies custom class to the value", () => {
    render(<InfoRow label="Age" value="30" valueClassName="text-red-500" />);
    expect(screen.getByText("30")).toHaveClass("text-red-500");
  });
});
