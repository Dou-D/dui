import type { Meta, StoryObj } from "@storybook/react-vite";
import { VirtualList } from "@dui/core";

// 1. 定义组件元数据
const meta: Meta<typeof VirtualList> = {
  title: "Core/VirtualList", // 左侧侧边栏的层级
  component: VirtualList,
  parameters: {
    layout: "centered", // 让组件在画布居中
  },
  tags: ["autodocs"], // 自动生成文档页
  // 这里可以定义全局 Props 的说明
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "ghost"],
      description: "列表的外观风格",
    },
    height: {
      control: "number",
      description: "容器高度 (px)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 2. 准备测试数据
const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    content: `Row Item #${i} - This is a test item`,
  }));

// 3. 基础用法 (Story)
export const Basic: Story = {
  args: {
    height: 400,
    data: generateData(1000),
    estimateSize: () => 40,
    className: "w-[400px] border border-gray-200", // Tailwind 样式
    renderItem: (item: any) => (
      <div className="h-full flex items-center px-4 hover:bg-gray-50">
        {item.content}
      </div>
    ),
  },
};

// 4. 动态高度演示
export const DynamicHeight: Story = {
  args: {
    height: 400,
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      // 随机生成不同长度的文本
      text: `Row #${i}: ${"Very long text... ".repeat((i % 5) + 1)}`,
    })),
    estimateSize: () => 50,
    className: "w-[400px] border border-blue-200 bg-blue-50",
    variant: "bordered",
    renderItem: (item: any) => (
      <div className="p-4 border-b border-blue-100">
        <span className="font-bold mr-2">#{item.id}</span>
        {item.text}
      </div>
    ),
  },
};
