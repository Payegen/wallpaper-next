"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image as ImageIcon, Code2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/ModeToggle";


const navItems = [
  { name: "首页", path: "/", icon: Home },
  { name: "画廊", path: "/gallery", icon: ImageIcon },
  { name: "实验室", path: "/demos", icon: Code2 },
  { name: "关于", path: "/about", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    // 1. 触发容器：固定在顶部，高度较小，负责捕获鼠标
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2. 动画容器：根据状态改变大小 */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative flex items-center justify-center rounded-full border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-white/5 overflow-hidden",
          // 这里的样式控制默认状态和展开状态的 宽/高/内边距
          isHovered ? "px-3 py-2 gap-2" : "w-32 h-2 py-0 px-0 opacity-50 hover:opacity-100 bg-foreground/20 border-transparent cursor-pointer"
        )}
      >
        
        {/* --- A. 收起状态的视觉提示 (Handle) --- */}
        <AnimatePresence mode="wait">
          {!isHovered && (
            <motion.div
              key="handle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               {/* 一个简单的横条，类似 iOS 底部条 */}
               <div className="w-12 h-1 bg-foreground/50 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- B. 展开状态的完整导航 --- */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              className="flex items-center gap-2"
            >
              {/* 导航链接 */}
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                        isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      onMouseEnter={() => setHoveredPath(item.path)}
                      onMouseLeave={() => setHoveredPath(null)}
                    >
                      {/* 选中背景 */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-primary rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* 悬停背景 */}
                      {hoveredPath === item.path && !isActive && (
                        <motion.div
                          layoutId="navbar-hover"
                          className="absolute inset-0 bg-muted rounded-full -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* 分割线 */}
              <div className="w-px h-6 bg-border mx-1" />

              {/* 主题切换 */}
              <ModeToggle />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}