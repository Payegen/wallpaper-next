import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { getAllWallpaper } from '../actions/wallpaper';

// 扩展一下 Mock 数据，实际开发中这是 API 请求
const mockdata = [
  { id: 'img-1', title: '极简山脉', type: 'image', url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=600&auto=format&fit=crop' },
  { id: 'video-demo', title: '雨夜城市', type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm', thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&auto=format&fit=crop' },
  { id: 'img-2', title: '赛博朋克', type: 'image', url: 'https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=600&auto=format&fit=crop' },
  { id: 'img-3', title: '宁静湖面', type: 'image', url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=600&auto=format&fit=crop' },
  { id: 'img-4', title: '抽象几何', type: 'image', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop' },
  { id: 'img-5', title: '霓虹街头', type: 'image', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop' },
];

// getAllWallpaper().then(res => {
//   if (res.success) {
//     console.log('从数据库获取的壁纸数据:', res.data);
//     // 这里你可以把 res.data 存到状态管理库或者 React state 中，供组件渲染使用
//   } else {
//     console.error('获取壁纸失败:', res.error);
//   }
// });
export default async function GalleryPage() {
  const {success, data} = await getAllWallpaper()
 console.log('获取壁纸数据:', {success, data});
 
  const wallpapers = [...mockdata];
// todo 暂时插点假数据
  if( success && data) {
    wallpapers.push(...data)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* 头部导航 */}
      <header className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">探索壁纸</h1>
        </div>
        <div className="flex gap-4">
           {/* 分类标签示例 */}
           <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium">热门推荐</button>
           <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20">动态壁纸</button>
           <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20">4K 风景</button>
        </div>
      </header>

      {/* 壁纸网格 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers.map((wp) => (
          <Link href={`/wallpaper/${wp.id}`} key={wp.id} className="group block">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/5 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
              
              {/* 图片/封面 
                Todo: 这里后续绑定自定义域名，直接使用图片地址可能会被墙。暂时使用 
              */}
              <Image 
                src={wp.type === 'video' && wp.thumbnail ? wp.thumbnail : wp.url} 
                alt={wp.title}
                fill
                unoptimized 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* 动态壁纸标识 */}
              {wp.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                  <PlayCircle size={16} className="text-white" />
                </div>
              )}

              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg">{wp.title}</h3>
                <p className="text-white/60 text-xs mt-1">点击预览桌面效果</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}