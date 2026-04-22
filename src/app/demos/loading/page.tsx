"use client";

import { useState } from "react";
import GlobalLoading, { InlineLoading, SkeletonLoading } from "@/components/ui/GlobalLoading";
import PageLoading from "@/components/ui/PageLoading";
import { useLoading } from "@/hooks/useLoading";

export default function LoadingDemo() {
  const [showGlobal, setShowGlobal] = useState(false);
  const { isLoading, loadingText, showLoading, hideLoading, withLoading } = useLoading();

  const simulateAsyncOperation = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleManualLoading = () => {
    showLoading("正在处理...");
    setTimeout(() => {
      hideLoading();
    }, 2000);
  };

  const handleWithLoading = async () => {
    await withLoading(simulateAsyncOperation(), "自动管理加载状态...");
    alert("操作完成！");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            加载效果演示
          </h1>
          <p className="text-gray-400">
            全局 Loading 组件的各种使用场景
          </p>
        </div>

        {/* 全局加载控制 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">1. 全局加载遮罩</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowGlobal(true)}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              显示全屏加载
            </button>
            <button
              onClick={handleManualLoading}
              className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors"
            >
              手动控制加载
            </button>
          </div>
        </section>

        {/* Hook 使用示例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">2. useLoading Hook</h2>
          <button
            onClick={handleWithLoading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            自动管理加载状态
          </button>
          <p className="text-sm text-gray-500 mt-2">
            使用 withLoading 自动包裹异步操作
          </p>
        </section>

        {/* 内联加载 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">3. 内联加载</h2>
          <div className="bg-white/5 rounded-lg p-6">
            <InlineLoading text="数据加载中..." />
          </div>
        </section>

        {/* 骨架屏 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">4. 骨架屏加载</h2>
          <div className="bg-white/5 rounded-lg p-6">
            <SkeletonLoading />
          </div>
        </section>

        {/* 使用说明 */}
        <section className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">使用说明</h2>
          <div className="space-y-3 text-gray-300">
            <div>
              <code className="text-pink-400">{"<GlobalLoading />"}</code>
              <span className="ml-2">- 全屏加载遮罩</span>
            </div>
            <div>
              <code className="text-pink-400">{"<InlineLoading />"}</code>
              <span className="ml-2">- 内联加载提示</span>
            </div>
            <div>
              <code className="text-pink-400">{"<SkeletonLoading />"}</code>
              <span className="ml-2">- 骨架屏占位</span>
            </div>
            <div>
              <code className="text-pink-400">{"<RouteLoading />"}</code>
              <span className="ml-2">- 路由切换进度条（已全局集成）</span>
            </div>
            <div>
              <code className="text-pink-400">{"useLoading()"}</code>
              <span className="ml-2">- 加载状态管理 Hook</span>
            </div>
          </div>
        </section>
      </div>

      {/* 全局加载遮罩 */}
      <GlobalLoading isLoading={showGlobal} text="加载中..." />
      <GlobalLoading isLoading={isLoading} text={loadingText} />
    </div>
  );
}
