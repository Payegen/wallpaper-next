"use client";

import { useState, useCallback } from "react";

interface UseLoadingReturn {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(promise: Promise<T>, text?: string) => Promise<T>;
}

/**
 * 全局加载状态管理 Hook
 * 
 * @example
 * ```tsx
 * const { showLoading, hideLoading, withLoading } = useLoading();
 * 
 * // 手动控制
 * showLoading("保存中...");
 * await saveData();
 * hideLoading();
 * 
 * // 自动管理
 * await withLoading(fetchData(), "加载数据中...");
 * ```
 */
export function useLoading(): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("加载中...");

  const showLoading = useCallback((text: string = "加载中...") => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(promise: Promise<T>, text: string = "加载中..."): Promise<T> => {
    showLoading(text);
    try {
      const result = await promise;
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    withLoading,
  };
}
