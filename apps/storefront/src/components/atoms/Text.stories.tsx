import type { Meta, StoryFn } from "@storybook/react";
import Text from "./Text";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
};

export default meta;

const Template: StoryFn<typeof Text> = (args) => <Text {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "This is a text element",
};

export const WithClass = Template.bind({});
WithClass.args = {
  children: "Text with styling",
  className: "text-blue-600 font-bold",
};
