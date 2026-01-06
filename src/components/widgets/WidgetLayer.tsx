'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// 简单的时钟小组件
const ClockWidget = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    // 解决 Hydration Mismatch: 仅在客户端渲染时间
    setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute:'2-digit' }));
    
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute:'2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null; // 还没加载完不显示

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none">
      <span className="text-7xl font-bold tracking-tighter text-white drop-shadow-2xl font-mono">
        {time}
      </span>
      <span className="text-lg text-white/80 font-medium">
        {new Date().toLocaleDateString()}
      </span>
    </div>
  );
};

export default function WidgetLayer() {
  return (
    <div className="w-full h-full relative">
      {/* 
        限制拖拽范围在父容器内 (dragConstraints)
        pointer-events-auto: 恢复鼠标交互，因为父层设为了 none 
      */}
      <motion.div 
        drag 
        dragMomentum={false} // 关闭惯性，更像操作系统的窗口
        className="absolute top-1/4 left-1/2 -translate-x-1/2 cursor-move pointer-events-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ClockWidget />
      </motion.div>
      
      {/* 这里以后可以遍历增加更多组件 */}
    </div>
  );
}