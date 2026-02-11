'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
// import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactLenis} from 'lenis/react'
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ScrollParallax() {
  // 创建一个 ref 指向整个滚动容器（如果需要特定区域）
  // 这里我们直接监听 window 滚动，所以不需要给 target
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- 调试：看看滚动有没有值 ---
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Page Scroll:", latest); 
  });

  // --- 动画映射 ---
  // Hero 区域的文字：滚动时向下移动，速度快 (y: 0 -> 500)
  const heroTextY = useTransform(scrollYProgress, [0, 0.3], [0, 500]);
  // Hero 区域的文字：滚动时透明度变低
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Hero 背景图：滚动时向下移动，但速度慢一点 (制造视差)
  const bgY = useTransform(scrollYProgress, [0, 0.5], [0, 300]);
  // Hero 背景图：慢慢变大
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <ReactLenis root> {/* 开启平滑滚动 */}
      <div ref={containerRef} className="relative bg-black text-white selection:bg-purple-500/30">
        
        {/* --- Section 1: Parallax Hero --- */}
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* 背景层 (绝对定位) */}
          <motion.div 
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              alt="Space background"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* 渐变遮罩，为了底部平滑过渡 */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black" />
          </motion.div>

          {/* 内容层 (前景) */}
          <motion.div 
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="relative z-10 text-center px-4 max-w-4xl"
          >
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
              UNIVERSE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              探索 Web 开发的无限边界。基于 Next.js 与 Framer Motion 打造的沉浸式体验。
            </p>
            <Link href="/gallery">
              <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-2 mx-auto">
                进入画廊
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* --- Section 2: Content (覆盖上来) --- */}
        {/* z-index 要比 Hero 高，relative 定位，这样滚动时会自然盖住 Hero */}
        <div className="relative z-20 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-32">
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  不仅是壁纸，<br/>
                  更是生产力工具。
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  我们将小组件（Widgets）与高清壁纸完美融合。你可以在欣赏美景的同时，处理待办事项、查看天气或进行快速搜索。
                </p>
              </div>
              <div className="relative aspect-square bg-linear-to-br from-purple-900/20 to-blue-900/20 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center group">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                 <span className="relative z-10 text-2xl font-mono border border-white/20 bg-black/50 backdrop-blur-md px-6 py-3 rounded-xl">
                    Widget System
                 </span>
              </div>
            </motion.div>

          </div>

          {/* --- Section 3: Feature Horizontal Scroll (如果想做) --- */}
          <div className="h-[50vh] flex items-center justify-center border-t border-white/10">
             <p className="text-gray-500">更多精彩内容开发中...</p>
          </div>
        </div>

      </div>
    </ReactLenis>
  );
}