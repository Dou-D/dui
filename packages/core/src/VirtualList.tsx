import { cva, VariantProps } from "class-variance-authority";
import { CSSProperties, ReactNode } from "react";
import { useVirtualList } from "@dui/hooks";
import { cn } from "./utils";
const listVariants = cva(
  "relative overflow-auto w-full", // 基础样式：相对定位 + 滚动
  {
    variants: {
      variant: {
        default: "bg-white",
        bordered: "border border-gray-200 rounded-md",
        ghost: "bg-transparent",
      },
      scrollbar: {
        default: "scrollbar-thin scrollbar-thumb-gray-300",
        hide: "scrollbar-hide", // 需要 tailwind 插件支持，这里仅作演示
      },
    },
    defaultVariants: {
      variant: "default",
      scrollbar: "default",
    },
  }
);

interface VirtualListProps<T>
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof listVariants> {
  data: T[];
  estimateSize: () => number;
  renderItem: (item: T, index: number) => ReactNode;
  height?: number | string; // 容器高度
}

export const VirtualList = <T,>({
  data,
  estimateSize,
  renderItem,
  variant,
  scrollbar,
  className,
  style,
  height = "100%",
  ...restProps
}: VirtualListProps<T>) => {
  const { virtualItems, totalHeight, containerRef } = useVirtualList({
    count: data.length,
    estimateSize,
    overscan: 5,
  });

  return (
    <div
      ref={containerRef}
      className={cn(listVariants({ variant, scrollbar, className }))}
      style={{ height, ...style }}
      {...restProps}
    >
      {/* 5. 撑开高度的占位容器 (重要！) */}
      <div
        style={{
          height: totalHeight,
          width: "100%",
          position: "relative",
        }}
      >
        {/* 6. 渲染可视区域内的元素 */}
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`, // GPU 加速
            }}
          >
            {/* 回调渲染 */}
            {renderItem(data[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
};
