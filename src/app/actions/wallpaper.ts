'use server';

import { prisma } from '@/lib/prisma'; // 你需要单独封装一个 prisma client 实例
import { getUploadUrl } from '@/lib/r2';
import { revalidatePath } from 'next/cache';

// 1. 获取上传凭证 Action
export async function getPresignedUrl(filename: string, contentType: string) {
  // 这里可以加鉴权逻辑，比如只有管理员能上传
  return await getUploadUrl(filename, contentType);
}

// 2. 保存壁纸信息到数据库 Action
export async function createWallpaper(data: {
  title: string;
  url: string;
  type: 'image' | 'video';
  resolution: string;
  description?: string;
}) {
  try {
    const wallpaper = await prisma.wallpaper.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type,
        resolution: data.resolution,
        description: data.description,
      },
    });
    
    // 刷新画廊页面，让新数据立即显示
    revalidatePath('/gallery');
    return { success: true, data: wallpaper };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create wallpaper' };
  }
}

export async function getAllWallpaper() {
    try {
      const data = await prisma.wallpaper.findMany();
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to fetch wallpapers' };
    }
}

export async function getWallpaperById(id: string) {
    try {
      const data = await prisma.wallpaper.findUnique({ where: { id } });
      if (!data) {
        return { success: false, error: 'Wallpaper not found' };
      }
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to fetch wallpaper' };
    }
}