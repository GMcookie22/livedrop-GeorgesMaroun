import type { Meta, StoryFn } from "@storybook/react";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
};

export default meta;

const Template: StoryFn<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: "Enter text",
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: "Cannot type",
  disabled: true,
};
