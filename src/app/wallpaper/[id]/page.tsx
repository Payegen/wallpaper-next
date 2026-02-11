import { getMockWallpaper, WallpaperData } from '@/lib/mock';
import WallpaperClient from '@/components/wallpaper/WallpaperClient';
import { notFound } from 'next/navigation';
import { getWallpaperById } from '@/app/actions/wallpaper';

// Next.js 15 的 params 是 Promise，或者在 Next 14 中直接使用
type Props = {
  params: { id: string }
};

export default async function WallpaperPage({ params }: Props) {
    const { id } = await params

    const { success, data, error } = await getWallpaperById(id)
    console.log('my log info',id, success, data);

  // 模拟获取数据
  const mockdata = getMockWallpaper(id);

  if (!success) {
    console.log(error,'myerr');
    
    if(!data) {
      return <WallpaperClient data={mockdata} />;
    }
    return notFound();
  }

  return <WallpaperClient data={data as WallpaperData} />;
}