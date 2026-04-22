"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  text?: string;
}

/**
 * 页面级加载组件
 * 用于 Next.js 的 loading.tsx 文件
 */
export default function PageLoading({ text = "页面加载中..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo 或图标 */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">W</span>
          </div>
          
          {/* 光晕效果 */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 blur-xl opacity-50" />
        </motion.div>

        {/* 加载图标和文字 */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-purple-500" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm"
          >
            {text}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 页面加载骨架屏
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-black p-6 animate-pulse">
      {/* 导航骨架 */}
      <div className="h-16 bg-white/5 rounded-lg mb-6" />
      
      {/* 内容骨架 */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-white/5 rounded-lg" />
          <div className="h-32 bg-white/5 rounded-lg" />
          <div className="h-32 bg-white/5 rounded-lg" />
        </div>
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}
