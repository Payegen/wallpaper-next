import PageLoading from "@/components/ui/PageLoading";

/**
 * 根路由加载状态
 * Next.js 会自动在页面加载时显示此组件
 */
export default function Loading() {
  return <PageLoading text="加载页面..." />;
}
