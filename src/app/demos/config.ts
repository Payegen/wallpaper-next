import { ScrollText, LucideIcon, Box, Palette } from "lucide-react";

export interface DemoConfig {
  slug: string;        // URL 路径，例如 'scroll-parallax'
  title: string;       // 标题
  description: string; // 描述
  icon: LucideIcon;           // 图标组件
  color: string;       // 列表页卡片的渐变色
}

export const demos: DemoConfig[] = [
  {
    slug: "scroll-parallax",
    title: "滚动视差首页",
    description: "复刻首页的视差滚动效果，分离背景层与内容层。",
    icon: ScrollText,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    slug: "framer-buttons",
    title: "微交互按钮",
    description: "展示各种 Framer Motion 的悬停、点击与加载状态动画。",
    icon: Box,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    slug: "theme-showcase",
    title: "主题色板展示",
    description: "测试当前 Tailwind V4 主题变量在不同组件下的表现。",
    icon: Palette,
    color: "from-green-500/20 to-emerald-500/20",
  },
];