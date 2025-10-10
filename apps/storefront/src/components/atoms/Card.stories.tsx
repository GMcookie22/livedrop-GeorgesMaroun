import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const SupportCard: Story = {
  args: {
    children: "Support message",
    variant: "support",
  },
};

export const UserCard: Story = {
  args: {
    children: "User message",
    variant: "user",
  },
};
