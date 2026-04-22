"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 路由切换加载进度条
 * 
 * 显示在页面顶部，当路由切换时自动显示进度条
 */
export default function RouteLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 路由开始变化
    setIsChanging(true);
    setProgress(0);

    // 模拟进度加载
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(90), 500);

    // 路由变化完成
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsChanging(false);
        setProgress(0);
      }, 200);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 z-[10000] origin-left"
          style={{ 
            scaleX: progress / 100,
            transformOrigin: "0% 50%"
          }}
        >
          {/* 发光效果 */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
