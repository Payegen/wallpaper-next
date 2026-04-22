"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GlobalLoadingProps {
  isLoading?: boolean;
  text?: string;
  fullScreen?: boolean;
}

/**
 * 全局加载组件
 * 
 * @param isLoading - 是否显示加载状态
 * @param text - 加载文字提示
 * @param fullScreen - 是否全屏显示（默认 true）
 */
export default function GlobalLoading({ 
  isLoading = true, 
  text = "加载中...",
  fullScreen = true 
}: GlobalLoadingProps) {
  if (!isLoading) return null;

  const containerClass = fullScreen 
    ? "fixed inset-0 z-[9999] flex items-center justify-center"
    : "relative flex items-center justify-center min-h-[200px]";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={containerClass}
        >
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* 加载内容 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            {/* 旋转加载图标 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-purple-500" />
            </motion.div>
            
            {/* 加载文字 */}
            {text && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-sm font-medium"
              >
                {text}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 内联加载组件（用于页面局部加载）
 */
export function InlineLoading({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-6 h-6 text-purple-500" />
      </motion.div>
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
}

/**
 * 骨架屏加载组件
 */
export function SkeletonLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-white/5 rounded-lg" />
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
    </div>
  );
}
