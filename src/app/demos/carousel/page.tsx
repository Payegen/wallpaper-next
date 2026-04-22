import Carousel from '@/components/ui/Carousel';

export default function CarouselDemo() {
  // 示例：使用真实图片
  const customItems = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1200',
      title: '极简山脉',
      description: '宁静的自然风光'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1535868463750-c78d9543614f?w=1200',
      title: '赛博朋克',
      description: '未来都市夜景'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1200',
      title: '宁静湖面',
      description: '平静的水面倒影'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200',
      title: '抽象几何',
      description: '现代艺术之美'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">轮播图组件演示</h1>
          <p className="text-gray-400">自适应容器大小，展示第一张和第二张的一半</p>
        </div>

        {/* 演示 1：默认配置 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">1. 默认配置（渐变背景）</h2>
          <Carousel />
        </section>

        {/* 演示 2：自定义图片 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">2. 自定义图片</h2>
          <Carousel items={customItems} />
        </section>

        {/* 演示 3：自动播放 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">3. 自动播放（每 3 秒）</h2>
          <Carousel items={customItems} autoPlay autoPlayInterval={3000} />
        </section>

        {/* 演示 4：不同容器宽度 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">4. 不同容器宽度测试</h2>
          
          <div className="space-y-8">
            {/* 全宽 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">全宽容器</p>
              <div className="border border-white/10 rounded-lg p-4">
                <Carousel items={customItems} />
              </div>
            </div>

            {/* 2/3 宽度 */}
            <div>
              <p className="text-sm text-gray-500 mb-2">2/3 宽度容器</p>
              <div className="w-2/3 border border-white/10 rounded-lg p-4">
                <Carousel items={customItems} />
              </div>
            </div>
          </div>
        </section>

        {/* 功能说明 */}
        <section className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6">✨ 核心特性</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">📐 自适应布局</h3>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• 自动检测容器宽度</li>
                <li>• 移动端：卡片占 85%</li>
                <li>• 桌面端：卡片占 60%</li>
                <li>• 露出下一张的一半</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🎮 交互功能</h3>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• 左右箭头切换</li>
                <li>• 底部指示器点击</li>
                <li>• 无限循环轮播</li>
                <li>• 平滑过渡动画</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
