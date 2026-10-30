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
  { id: 1, color: 'from-sys-accent/20 to-sys-primary/20', title: 'Neon City' },
  { id: 2, color: 'from-sys-info/20 to-sys-primary/10', title: 'Cyber Punk' },
  { id: 3, color: 'from-sys-primary/20 to-sys-accent/10', title: 'Deep Space' },
  { id: 4, color: 'from-sys-text-success/20 to-sys-info/10', title: 'Nature Zen' },
  { id: 5, color: 'from-sys-text-warning/20 to-sys-accent/10', title: 'Sunset Glow' },
  { id: 6, color: 'from-sys-bg-elevated to-sys-bg-page', title: 'Dark Mode' },
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
                    className={`w-full h-full bg-linear-to-br ${item.color || 'from-sys-bg-elevated to-sys-bg-page'} flex items-center justify-center`}
                  >
                    {item.title && (
                      <h3 className="text-3xl md:text-4xl font-bold text-sys-text-base drop-shadow-sys-lg">
                        {item.title}
                      </h3>
                    )}
                  </div>
                )}

                {/* 文字信息 */}
                {(item.title || item.description) && isActive && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-sys-media-bg/90 to-transparent">
                    {item.title && (
                      <h3 className="text-2xl font-bold text-sys-media-text mb-2">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-sys-media-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {/* 非活动项遮罩 */}
                <div 
                  className={`
                    absolute inset-0 bg-sys-media-bg/30 transition-opacity duration-300
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
        className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 rounded-full bg-sys-bg-surface/95 backdrop-blur-md border border-sys-border text-sys-text-base hover:bg-sys-bg-inverse hover:text-sys-text-inverse transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnimating}
        aria-label="上一张"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 rounded-full bg-sys-bg-surface/95 backdrop-blur-md border border-sys-border text-sys-text-base hover:bg-sys-bg-inverse hover:text-sys-text-inverse transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                ? 'bg-sys-media-text w-8'
                : 'bg-sys-media-text/50 hover:bg-sys-media-text/75'
              }
            `}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>

      {/* 进度条（自动播放时显示） */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sys-media-text/20">
          <motion.div
            className="h-full bg-sys-media-text"
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
