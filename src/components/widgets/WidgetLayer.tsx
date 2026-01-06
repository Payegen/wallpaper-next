'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWidgetStore, WidgetType } from '@/store/widgetStore';
import { X, Search, CloudSun, CheckCircle2 } from 'lucide-react';

// --- 1. 定义所有小组件 UI (直接写在这里，确保能加载) ---

const ClockWidget = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute:'2-digit' }));
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute:'2-digit' })), 1000);
    return () => clearInterval(t);
  }, []);
  // 避免未加载时显示空
  if (!time) return <div className="text-white/50">Loading...</div>;
  return (
    <div className="text-center">
        <div className="text-7xl font-bold text-white drop-shadow-xl font-mono tracking-tighter">{time}</div>
        <div className="text-white/80 font-medium">{new Date().toLocaleDateString()}</div>
    </div>
  );
};

const SearchWidget = () => (
  <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-full px-5 py-3 flex items-center gap-3 w-[320px] shadow-2xl group cursor-text">
    <Search size={20} className="text-white/60" />
    <input 
      type="text" 
      placeholder="Search..." 
      className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 font-medium"
      // 核心：防止输入框获取焦点时触发拖拽
      onPointerDown={(e) => e.stopPropagation()} 
    />
  </div>
);

const WeatherWidget = () => (
  <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-[160px] text-white flex flex-col items-center gap-2 shadow-2xl">
    <CloudSun size={48} className="text-yellow-300 drop-shadow-md" />
    <div className="text-3xl font-bold mt-1">24°</div>
    <div className="text-sm text-white/80 font-medium">Shanghai</div>
  </div>
);

const TodoWidget = () => (
  <div className="bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-[220px] text-white shadow-2xl">
    <h3 className="font-semibold mb-3 text-sm border-b border-white/10 pb-2 flex justify-between">
      Tasks <span className="text-xs bg-white/20 px-1.5 rounded text-white/80">3</span>
    </h3>
    <ul className="space-y-2.5 text-sm">
      <li className="flex gap-2.5 items-center text-white/90"><CheckCircle2 size={16} className="text-green-400 shrink-0"/> Design System</li>
      <li className="flex gap-2.5 items-center text-white/50 line-through decoration-white/30"><div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center shrink-0"><div className="w-2 h-2 bg-white/40 rounded-full"/></div> Update API</li>
      <li className="flex gap-2.5 items-center text-white/90"><div className="w-4 h-4 border border-white/40 rounded-full shrink-0"/> Drink Water</li>
    </ul>
  </div>
);

// 映射表
const componentMap: Record<WidgetType, React.FC> = {
  clock: ClockWidget,
  weather: WeatherWidget,
  search: SearchWidget,
  todo: TodoWidget,
};

// --- 2. 核心渲染层 WidgetLayer ---

export default function WidgetLayer() {
  const { widgets, updatePosition, removeWidget } = useWidgetStore();
  const [mounted, setMounted] = useState(false);

  // 重要修复：强制等待客户端加载完成后再渲染
  // 这解决了 "Hydration failed" 和组件不显示的问题
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative overflow-hidden">
      {widgets.map((widget) => {
        const Component = componentMap[widget.type];
        
        // 安全检查：如果类型不对，防止报错
        if (!Component) return null;

        return (
          <motion.div
            key={widget.id}
            drag
            dragMomentum={false} // 关闭惯性，更像系统窗口
            initial={{ x: widget.x, y: widget.y, scale: 0.8, opacity: 0 }}
            animate={{ x: widget.x, y: widget.y, scale: 1, opacity: 1 }}
            // 拖拽结束更新位置
            onDragEnd={(_, info) => {
              // 注意：这里需要累加位置，简化处理先只更新 offset
              // 实际生产环境建议结合 ref 计算最终坐标
              updatePosition(widget.id, widget.x + info.offset.x, widget.y + info.offset.y);
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-move pointer-events-auto group z-10"
            whileHover={{ scale: 1.02, zIndex: 50 }}
            whileTap={{ scale: 0.98, cursor: 'grabbing' }}
          >
            {/* 删除按钮 (Hover 显示) */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // 防止触发拖拽
                removeWidget(widget.id);
              }}
              className="absolute z-11 -top-3 -right-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm scale-75 group-hover:scale-100"
            >
              <X size={14} />
            </button>
            
            {/* 渲染具体组件 */}
            <Component />
          </motion.div>
        );
      })}
    </div>
  );
}