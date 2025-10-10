/* eslint-disable react-hooks/rules-of-hooks */
// src/components/molecules/ChatInput.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ChatInput from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Molecules/ChatInput",
  component: ChatInput,
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={() => alert(value)}
      />
    );
  },
};
