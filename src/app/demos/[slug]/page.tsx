import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { demos } from '../config';

// --- 1. 动态导入注册表 ---
// 只有当 slug 匹配时，才会加载对应的 JS 文件
const DemoComponents: Record<string, React.ComponentType> = {
  'scroll-parallax': dynamic(() => import('../components/ScrollParallax')),
  'framer-buttons': dynamic(() => import('../components/FramerButtons')),
  // 如果没有组件，可以暂时渲染一个占位符
  'theme-showcase': () => <div className="p-10 text-center">开发中...</div>,
  'demo-test': dynamic(() => import('../components/demo1')),
};

interface Props {
  params: Promise<{ slug: string }>; // Next.js 15 params 是 Promise
}

// --- 2. 生成静态路由参数 (SSG) ---
// 这允许 Next.js 在构建时就知道有哪些 demo 页面，利于 SEO 和性能
export async function generateStaticParams() {
  return demos.map((demo) => ({
    slug: demo.slug,
  }));
}

// --- 3. 页面渲染 ---
export default async function DemoDetailPage({ params }: Props) {
  const { slug } = await params;
  console.log(slug,'slug');
  
  // 查找配置
  const demoInfo = demos.find(d => d.slug === slug);
  const Component = DemoComponents[slug];

  if (!demoInfo || !Component) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部简单的返回导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <Link 
          href="/demos" 
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border border-border rounded-full hover:bg-muted transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">返回列表</span>
          <span className="text-muted-foreground mx-1">|</span>
          <span className="text-sm text-muted-foreground">{demoInfo.title}</span>
        </Link>
      </div>

      {/* Demo 渲染容器 */}
      <main className="w-full min-h-screen pt-16">
        <Component />
      </main>
    </div>
  );
}