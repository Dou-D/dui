import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useVirtualList } from "./useVirtualList";

describe("useVirtualList", () => {
  it("should calculate total height correctly", () => {
    const count = 100;
    const itemHeight = 50;
    const { result } = renderHook(() =>
      useVirtualList({ count, estimateSize: () => itemHeight })
    );
    expect(result.current.totalHeight).toBe(5000);
  });

  it("should calculate visible items based on container size", async () => {
    const itemHeight = 50;
    const containerHeight = 200;

    // 依然保留这个好习惯：把函数提出来，避免不必要的死循环风险
    const estimateSize = () => itemHeight;

    const { result } = renderHook(() =>
      useVirtualList({
        count: 10,
        estimateSize,
        overscan: 0,
      })
    );

    // 1. 回归使用标准的 document.createElement
    const mockContainer = document.createElement("div");

    // 使用 defineProperty 正常 Mock 高度
    Object.defineProperty(mockContainer, "clientHeight", {
      value: containerHeight,
    });
    Object.defineProperty(mockContainer, "scrollTop", { value: 0 });

    act(() => {
      result.current.containerRef(mockContainer);
    });

    act(() => {
      mockContainer.dispatchEvent(new Event("scroll"));
    });

    // 等待状态更新
    await waitFor(() => {
      expect(result.current.virtualItems).toHaveLength(4);
    });

    const visibleItems = result.current.virtualItems;
    expect(visibleItems[0].index).toBe(0);
    expect(visibleItems[3].index).toBe(3);
    expect(visibleItems[0].start).toBe(0);
  });
});
