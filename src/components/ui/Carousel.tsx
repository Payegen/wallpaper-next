'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 轮播项数据接口
interface CarouselItem {
  id: string | number;
  image?: string;
  title?: string;
  description?: string;
  color?: string; // 用于没有图片时的背景渐变
}

interface CarouselProps {
  items?: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

// 默认示例数据
const DEFAULT_ITEMS: CarouselItem[] = [
  { id: 1, color: 'from-pink-500 to-rose-500', title: 'Neon City' },
  { id: 2, color: 'from-blue-500 to-cyan-500', title: 'Cyber Punk' },
  { id: 3, color: 'from-purple-500 to-indigo-500', title: 'Deep Space' },
  { id: 4, color: 'from-emerald-500 to-teal-500', title: 'Nature Zen' },
  { id: 5, color: 'from-orange-500 to-amber-500', title: 'Sunset Glow' },
  { id: 6, color: 'from-gray-800 to-slate-900', title: 'Dark Mode' },
];

export default function Carousel({ 
  items = DEFAULT_ITEMS, 
  autoPlay = false,
  autoPlayInterval = 5000 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 测量容器宽度
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 计算每个卡片的宽度和位移
  const getSlideMetrics = useCallback(() => {
    if (containerWidth === 0) return { slideWidth: 0, peekAmount: 0 };

    // 移动端：卡片占 85%，桌面端：卡片占 60%
    const isMobile = containerWidth < 768;
    const cardWidthPercent = isMobile ? 0.85 : 0.60;
    
    const slideWidth = containerWidth * cardWidthPercent;
    const peekAmount = (containerWidth - slideWidth) / 2; // 露出两侧的部分

    return { slideWidth, peekAmount };
  }, [containerWidth]);

  const { slideWidth, peekAmount } = getSlideMetrics();
  const GAP = 16; // 卡片间距

  // 创建扩展数组用于无限循环
  const extendedItems = [
    items[items.length - 1], // 最后一个克隆到前面
    ...items,
    items[0], // 第一个克隆到后面
  ];

  // 核心动画逻辑
  useEffect(() => {
    if (slideWidth === 0) return;

    // 计算位移：peekAmount 是左侧露出的空间，currentIndex 是当前索引
    const calculateX = (index: number) => {
      const offset = peekAmount + (index * (slideWidth + GAP));
      return -offset;
    };

    // 重置状态：瞬移不播放动画
    if (isResettingRef.current) {
      controls.set({ x: calculateX(currentIndex) });
      isResettingRef.current = false;
      return;
    }

    // 播放滑动动画
    controls.start({
      x: calculateX(currentIndex),
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
    }).then(() => {
      setIsAnimating(false);

      // 无限循环逻辑
      if (currentIndex === extendedItems.length - 1) {
        // 到达最后一个（克隆的第一张），瞬移到真实的第二张
        isResettingRef.current = true;
        setCurrentIndex(1);
      } else if (currentIndex === 0) {
        // 到达第一个（克隆的最后一张），瞬移到真实的倒数第二张
        isResettingRef.current = true;
        setCurrentIndex(extendedItems.length - 2);
      }
    });
  }, [currentIndex, controls, slideWidth, peekAmount, GAP]);

  // 自动播放
  useEffect(() => {
    if (!autoPlay) return;

    autoPlayTimerRef.current = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isAnimating]);

  // 切换到下一张
  const handleNext = useCallback(() => {
    if (isAnimating || slideWidth === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating, slideWidth]);

  // 切换到上一张
  const handlePrev = useCallback(() => {
    if (isAnimating || slideWidth === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating, slideWidth]);

  // 计算实际的当前索引（排除克隆项）
  const getRealIndex = (index: number) => {
    if (index === 0) return items.length - 1;
    if (index === extendedItems.length - 1) return 0;
    return index - 1;
  };

  // 指示器点击
  const handleIndicatorClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index + 1); // +1 因为前面有克隆项
  };

  return (
    <div 
      ref={containerRef}
      className="w-full relative group overflow-hidden"
      style={{ minHeight: '300px' }}
    >
      {/* 轮播轨道 */}
      {slideWidth > 0 && (
        <motion.div
          className="flex"
          style={{ 
            gap: `${GAP}px`,
            paddingLeft: `${peekAmount}px`,
            paddingRight: `${peekAmount}px`,
          }}
          initial={false}
          animate={controls}
        >
          {extendedItems.map((item, index) => {
            const realIndex = getRealIndex(index);
            const isActive = getRealIndex(currentIndex) === realIndex;

            return (
              <motion.div
                key={`${item.id}-${index}`}
                className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{ 
                  width: `${slideWidth}px`,
                  aspectRatio: '16/9', // 保持宽高比
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* 图片或渐变背景 */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className={`w-full h-full bg-gradient-to-br ${item.color || 'from-gray-700 to-gray-900'} flex items-center justify-center`}
                  >
                    {item.title && (
                      <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                        {item.title}
                      </h3>
                    )}
                  </div>
                )}

                {/* 文字信息 */}
                {(item.title || item.description) && isActive && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    {item.title && (
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {/* 非活动项遮罩 */}
                <div 
                  className={`
                    absolute inset-0 bg-black/30 transition-opacity duration-300
                    ${isActive ? 'opacity-0' : 'opacity-100'}
                  `} 
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* 左右控制按钮 */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnimating}
        aria-label="上一张"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnimating}
        aria-label="下一张"
      >
        <ChevronRight size={24} />
      </button>

      {/* 底部指示器 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${getRealIndex(currentIndex) === index 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
              }
            `}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>

      {/* 进度条（自动播放时显示） */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: autoPlayInterval / 1000, 
              ease: 'linear',
              repeat: Infinity 
            }}
          />
        </div>
      )}
    </div>
  );
}
