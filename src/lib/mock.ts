// src/lib/mock.ts

export type WallpaperData = {
  id: string;
  title: string;
  author: string;
  type: 'image' | 'video';
  url: string; // 图片或视频地址
  thumbnail?: string; // 视频封面
  resolution: string;
};

export function getMockWallpaper(id: string): WallpaperData {
  // 这里模拟根据 ID 返回不同的数据
  // 实际项目中这里是 fetch 请求
  const isVideo = id === 'video-demo';
  
  return {
    id,
    title: isVideo ? "赛博朋克：边缘行者 - 雨夜" : "极简主义山脉",
    author: isVideo ? "Studio Trigger" : "Unsplash Artist",
    type: isVideo ? 'video' : 'image',
    // 这里使用公共的免费资源链接测试
    url: isVideo 
      ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm' // 临时测试视频
      : 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3870&auto=format&fit=crop',
    resolution: "4K",
  };
}