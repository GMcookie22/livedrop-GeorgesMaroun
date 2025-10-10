// src/components/molecules/QuantityControl.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import QuantityControl from "./QuantityControl";

const meta: Meta<typeof QuantityControl> = {
  title: "Molecules/QuantityControl",
  component: QuantityControl,
};

export default meta;

type Story = StoryObj<typeof QuantityControl>;

export const Default: Story = {
  args: {
    qty: 3,
    onIncrease: () => alert("Increase clicked"),
    onDecrease: () => alert("Decrease clicked"),
  },
};
