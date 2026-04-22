'use client';

import Carousel from '@/components/ui/Carousel';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Layers, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// 动画变体配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef, // 如果需要，可以指定一个元素作为滚动目标
  }); // 如果需要，可以使用滚动位置做一些交互
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("当前滚动进度:", latest);
  });
  useEffect(
    () => {
      console.log(scrollYProgress);
      
    },[ scrollYProgress]
  )
  return (
    <main className="min-h-screen flex flex-col" ref={containerRef}>

      <motion.div style={{
        scaleX: scrollYProgress,
        position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                    backgroundColor: "#ff0088",
      }}>
          {scrollYProgress}
      </motion.div>
      {/* --- Hero Section: 全屏首屏 --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* 背景光效 (用 CSS 模拟氛围感) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-150 h-150 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

        {/* 内容区域 */}
        <motion.div 
          className="z-10 text-center px-4"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/50 mb-6"
          >
            重塑你的 <br /> Web 桌面
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            不仅仅是壁纸。我们将wallpaper风格的高清动态壁纸与实用的 Web 小工具完美融合，
            在浏览器中打造你的专属工作台。
          </motion.p>

          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            {/* 进入画廊按钮 */}
            <Link href="/gallery">
              <button className="group relative px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all flex items-center gap-2">
                开始探索
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all">
              关于项目
            </button>

            <Link href="/about">
    <button className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all">
      关于我
    </button>
  </Link>
          </motion.div>
        </motion.div>

        {/* 底部滚动提示 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll Down</span>
        </motion.div>
      </section>

      {/* --- Features Section: 特性介绍 --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">沉浸式视觉体验</h2>
          <p className="text-gray-400 text-lg mb-8">
            完美支持 4K 图片与 WebM 动态视频。无论是静谧的风景还是赛博朋克都市，
            都能通过 WebGL 技术流畅呈现。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <MonitorPlay className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="font-semibold">动态壁纸引擎</h3>
                <p className="text-sm text-gray-500">支持 Steam Wallpaper Engine 风格视频</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <Layers className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="font-semibold">组件化布局</h3>
                <p className="text-sm text-gray-500">天气、时钟、待办事项随意拖拽</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 这里是一个示意图占位，实际开发时可以用 Next/Image 放截图 */}
        <div className="relative aspect-video bg-linear-to-tr from-gray-800 to-gray-900 rounded-2xl border border-white/10 overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono">
                {/* [ 预览图 / 3D 模型演示区 ] */}
<Carousel/>
            </div>
        </div>
      </section>

    </main>
  );
}