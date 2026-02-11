'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Share2, LayoutGrid, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WallpaperData } from '@/lib/mock';
import WidgetLayer from '@/components/widgets/WidgetLayer'; // 稍后创建这个组件
import { useWidgetStore } from '@/store/widgetStore';

interface Props {
  data: WallpaperData;
}

export default function WallpaperClient({ data }: Props) {
  const [showUI, setShowUI] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const addWidget = useWidgetStore(state => state.addWidget); // 获取添加方法
  const [showMenu, setShowMenu] = useState(false); // 控制菜单显示

  // 核心逻辑：鼠标移动显示 UI，停止移动 3秒后隐藏 UI
  const handleMouseMove = () => {
    setShowUI(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setShowUI(false);
      setShowMenu(false); // 隐藏菜单
    }, 3000);
  };

  // 初始化定时器
  useEffect(() => {
    // handleMouseMove();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 一个简单的菜单组件
  const WidgetMenu = useMemo(() => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-20 right-8 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-xl flex flex-col gap-2 min-w-37.5"
    >
      <div className="text-xs text-gray-400 px-2 py-1 uppercase tracking-wider">添加组件</div>
      <button onClick={() => addWidget('clock')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-left"><LayoutGrid size={16}/> 时钟</button>
      <button onClick={() => addWidget('weather')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-left"><LayoutGrid size={16}/> 天气</button>
      <button onClick={() => addWidget('search')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-left"><LayoutGrid size={16}/> 搜索栏</button>
      <button onClick={() => addWidget('todo')} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-left"><LayoutGrid size={16}/> 待办清单</button>
    </motion.div>
  ), [addWidget]);
  

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black text-white cursor-default"
      onMouseMove={handleMouseMove}
      onClick={() => setShowUI(true)} // 点击也能唤醒 UI
    >
      {/* --- 层级 1: 背景层 (壁纸引擎) --- */}
      <div className="absolute inset-0 z-0">
        {data.type === 'video' ? (
          <video
            src={data.url}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={data.url}
            alt={data.title}
            fill
            unoptimized
            className="object-cover"
            priority // 详情页图片必须优先加载
            quality={90}
          />
        )}
        {/* 遮罩：让上面的白色文字更清晰，仅在顶部和底部加渐变 */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* --- 层级 2: 小工具层 (Widgets) --- */}
      {/* 这个层必须在背景之上，但在 UI 之下 */}
      <div className="absolute inset-0 z-10 pointer-events-none">
         {/* WidgetLayer 内部需要开启 pointer-events-auto */}
         <WidgetLayer />
      </div>
      

      {/* --- 层级 3: 顶部导航 UI (可隐藏) --- */}
      <AnimatePresence>
        {showUI && (
          <motion.header
            key={'client-header'}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start"
          >
            <Link 
              href="/gallery" 
              className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/50 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">返回画廊</span>
            </Link>

            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-3 bg-black/30 backdrop-blur-md rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
              >
                <Settings size={20} />
              </button>
            </div>

          </motion.header>
        )}
        
        {showMenu && WidgetMenu}

      </AnimatePresence>

      {/* --- 层级 3: 底部信息 UI (可隐藏) --- */}
      <AnimatePresence>
        {showUI && (
          <motion.footer
          key={'client-footer'}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 z-20 p-8 flex justify-between items-end"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 text-shadow">{data.title}</h1>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="bg-white/10 px-2 py-1 rounded">
                   {data.resolution}
                </span>
                <span>By {data.author}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20">
                <Download size={20} />
                应用到桌面
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

    </div>
  );
}