import type { Meta, StoryFn } from "@storybook/react";
import InfoRow from "./InfoRow";

const meta: Meta<typeof InfoRow> = {
  title: "Atoms/InfoRow",
  component: InfoRow,
};

export default meta;

const Template: StoryFn<typeof InfoRow> = (args) => <InfoRow {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Name",
  value: "John Doe",
};

export const WithCustomValueClass = Template.bind({});
WithCustomValueClass.args = {
  label: "Age",
  value: "30",
  valueClassName: "text-red-500",
};
