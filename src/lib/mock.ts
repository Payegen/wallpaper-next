// src/lib/mock.ts

export type WallpaperData = {
  author: string;
  id: string
  title: string
  description: string | null
  url: string
  type: string
  resolution: string | null
  tags: string[]
  downloads: number
  likes: number
  createdAt: Date
  updatedAt: Date
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
    url: isVideo 
      ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm' // 临时测试视频
      : 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3870&auto=format&fit=crop',
    resolution: "4K",
    description: isVideo ? "赛博朋克风格动画短片，雨夜场景。" : "极简风格的山脉壁纸。",
    tags: isVideo ? ["赛博朋克", "动画", "视频"] : ["极简", "山脉", "图片"],
    downloads: isVideo ? 1200 : 3400,
    likes: isVideo ? 300 : 800,
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date(),
  };
}