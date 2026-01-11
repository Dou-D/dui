import { useState, useMemo, useEffect, useCallback } from "react";

export interface UseVirtualListOptions {
  count: number;
  estimateSize: () => number;
  overscan?: number;
}

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
}

export const useVirtualList = (options: UseVirtualListOptions) => {
  const { count, estimateSize, overscan = 1 } = options;

  const [range, setRange] = useState({ start: 0, end: 0 });
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);

  const totalHeight = useMemo(() => {
    return count * estimateSize();
  }, [count, estimateSize]);

  // 回归最自然的写法
  const calculateRange = useCallback(() => {
    if (!containerElement) return;

    const { scrollTop, clientHeight } = containerElement;

    // 直接调用 estimateSize，不绕弯子
    let start = Math.floor(scrollTop / estimateSize());
    let end = Math.ceil((scrollTop + clientHeight) / estimateSize());

    start = Math.max(0, start - overscan);
    end = Math.min(count, end + overscan);

    setRange({ start, end });
  }, [containerElement, count, estimateSize, overscan]);

  useEffect(() => {
    if (!containerElement) return;

    calculateRange();

    containerElement.addEventListener("scroll", calculateRange);
    return () => {
      containerElement.removeEventListener("scroll", calculateRange);
    };
    // ✅ 这里的依赖项补全是修复 BUG 的关键，必须保留
  }, [containerElement, calculateRange]);

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = range.start; i < range.end; i++) {
      items.push({
        index: i,
        start: i * estimateSize(),
        size: estimateSize(),
      });
    }
    return items;
  }, [range, estimateSize]);

  return {
    totalHeight,
    virtualItems,
    containerRef: setContainerElement,
  };
};