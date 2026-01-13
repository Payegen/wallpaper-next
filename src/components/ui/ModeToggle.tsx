"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  // 使用 mounted 状态避免水合不匹配错误
  const [mounted, setMounted] = React.useState(false);
  console.log(theme, resolvedTheme, "info");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 如果还没挂载（在服务端），渲染一个占位符防止布局跳动
  if (!mounted) {
    return (
      <button className="w-9 h-9 p-2 rounded-full border border-border bg-background/50 opacity-50 cursor-default">
        <span className="sr-only">Loading theme</span>
      </button>
    );
  }

  const toggleTheme = () => {
    // 如果当前是暗色，切亮色；否则切暗色
    // 使用 resolvedTheme 而不是 theme，因为 theme 可能是 'system'
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background/50 hover:bg-black/5 dark:hover:bg-white/10 backdrop-blur-md transition-all active:scale-95 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle theme"
      >
        {/* 太阳图标：暗色模式下缩小并隐藏，亮色模式下显示 */}
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-orange-500" />

        {/* 月亮图标：暗色模式下显示，亮色模式下旋转隐藏 */}
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
      </button>
    </>
  );
}
