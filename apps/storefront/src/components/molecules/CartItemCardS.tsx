import type { Meta, StoryObj } from "@storybook/react";
import CartItemCard from "./CartItemCard";

const mockItem = {
  id: "1",
  title: "Test Item",
  price: 25,
  qty: 2,
};

const meta: Meta<typeof CartItemCard> = {
  title: "Molecules/CartItemCard",
  component: CartItemCard,
};

export default meta;

type Story = StoryObj<typeof CartItemCard>;

export const Default: Story = {
  args: {
    item: mockItem,
    updateQty: (id: string, qty: number) => console.log(id, qty),
    removeItem: (id: string) => console.log("Removed", id),
  },
};
