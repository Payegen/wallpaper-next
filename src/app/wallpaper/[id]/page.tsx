import { getMockWallpaper } from '@/lib/mock';
import WallpaperClient from '@/components/wallpaper/WallpaperClient';
import { notFound } from 'next/navigation';

// Next.js 15 的 params 是 Promise，或者在 Next 14 中直接使用
type Props = {
  params: { id: string }
};

export default async function WallpaperPage({ params }: Props) {
    const { id } = await params
    console.log('my log info',id);

  // 模拟获取数据
  const data = getMockWallpaper(id);

  if (!data) {
    return notFound();
  }

  return <WallpaperClient data={data} />;
}