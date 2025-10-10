import type { Meta, StoryFn } from "@storybook/react";
import Tag from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Atoms/Tag",
  component: Tag,
};

export default meta;

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "New",
};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  children: "Sale",
  className: "bg-red-200 text-red-800",
};
