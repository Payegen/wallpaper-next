'use server';

import { prisma } from '@/lib/prisma'; // 你需要单独封装一个 prisma client 实例
import { getUploadUrl } from '@/lib/r2';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

// 1. 获取上传凭证 Action
export async function getPresignedUrl(filename: string, contentType: string) {
  try {
    // 权限检查：只有管理员可以获取上传凭证
    await requireAdmin();
    return await getUploadUrl(filename, contentType);
  } catch (error) {
    console.error('获取上传凭证失败:', error);
    
    // 如果是权限错误，返回更明确的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }
    
    return { success: false, error: 'Failed to get upload URL' };
  }
}

// 2. 保存壁纸信息到数据库 Action
export async function createWallpaper(data: {
  title: string;
  url: string;
  type: 'image' | 'video';
  source: 'upload' | 'steam';
  resolution?: string;
  description?: string;
  tags?: string[];
}) {
  try {
    // 权限检查：只有管理员可以创建壁纸
    await requireAdmin();

    const wallpaper = await prisma.wallpaper.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type,
        source: data.source,
        resolution: data.resolution,
        description: data.description,
        tags: data.tags || [],
      },
    });

    // 刷新画廊页面，让新数据立即显示
    revalidatePath('/gallery');
    return { success: true, data: wallpaper };
  } catch (error) {
    console.error('创建壁纸失败:', error);

    // 如果是权限错误，返回更明确的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to create wallpaper' };
  }
}

export async function getAllWallpaper(params?: {
  search?: string;
  tags?: string[];
  source?: 'upload' | 'steam';
  collectionId?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { search, tags, source, collectionId, page = 1, pageSize = 20 } = params || {};
    const skip = (page - 1) * pageSize;

    const where = {
      // 搜索标题或描述
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      // 标签筛选
      ...(tags && tags.length > 0 && {
        tags: { hasSome: tags },
      }),
      // 来源筛选
      ...(source && {
        source,
      }),
      // 合集筛选
      ...(collectionId && {
        collections: {
          some: { id: collectionId },
        },
      }),
    };

    // 获取总数
    const total = await prisma.wallpaper.count({ where });

    // 获取分页数据
    const data = await prisma.wallpaper.findMany({
      where,
      include: {
        collections: true, // 包含所属合集信息
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    });

    return { 
      success: true, 
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      }
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch wallpapers' };
  }
}

export async function getWallpaperById(id: string) {
  try {
    const data = await prisma.wallpaper.findUnique({
      where: { id },
      include: {
        collections: true, // 包含所属合集信息
      },
    });
    if (!data) {
      return { success: false, error: 'Wallpaper not found' };
    }
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch wallpaper' };
  }
}

// ==================== 合集相关操作 ====================

// 创建合集
export async function createCollection(data: {
  name: string;
  description?: string;
  coverImage?: string;
  isPublic?: boolean;
}) {
  try {
    await requireAdmin();

    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        description: data.description,
        coverImage: data.coverImage,
        isPublic: data.isPublic ?? true,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/collections');
    return { success: true, data: collection };
  } catch (error) {
    console.error('创建合集失败:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to create collection' };
  }
}

// 更新合集
export async function updateCollection(
  id: string,
  data: {
    name?: string;
    description?: string;
    coverImage?: string;
    isPublic?: boolean;
  }
) {
  try {
    await requireAdmin();

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        coverImage: data.coverImage,
        isPublic: data.isPublic,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/collections');
    return { success: true, data: collection };
  } catch (error) {
    console.error('更新合集失败:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to update collection' };
  }
}

// 获取所有合集
export async function getAllCollections() {
  try {
    const data = await prisma.collection.findMany({
      include: {
        _count: {
          select: { wallpapers: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch collections' };
  }
}

// 获取合集详情（包含壁纸列表）
export async function getCollectionById(id: string) {
  try {
    const data = await prisma.collection.findUnique({
      where: { id },
      include: {
        wallpapers: true,
      },
    });
    if (!data) {
      return { success: false, error: 'Collection not found' };
    }
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch collection' };
  }
}

// 添加壁纸到合集
export async function addWallpapersToCollection(
  collectionId: string,
  wallpaperIds: string[]
) {
  try {
    await requireAdmin();

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        wallpapers: {
          connect: wallpaperIds.map((id) => ({ id })),
        },
      },
      include: {
        wallpapers: true,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/collections');
    return { success: true, data: collection };
  } catch (error) {
    console.error('添加壁纸到合集失败:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to add wallpapers to collection' };
  }
}

// 从合集中移除壁纸
export async function removeWallpapersFromCollection(
  collectionId: string,
  wallpaperIds: string[]
) {
  try {
    await requireAdmin();

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        wallpapers: {
          disconnect: wallpaperIds.map((id) => ({ id })),
        },
      },
      include: {
        wallpapers: true,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/collections');
    return { success: true, data: collection };
  } catch (error) {
    console.error('从合集中移除壁纸失败:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to remove wallpapers from collection' };
  }
}

// 删除合集
export async function deleteCollection(id: string) {
  try {
    await requireAdmin();

    await prisma.collection.delete({
      where: { id },
    });

    revalidatePath('/gallery');
    revalidatePath('/collections');
    return { success: true };
  } catch (error) {
    console.error('删除合集失败:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    return { success: false, error: 'Failed to delete collection' };
  }
}

// 获取所有标签（用于筛选）
export async function getAllTags() {
  try {
    const wallpapers = await prisma.wallpaper.findMany({
      select: { tags: true },
    });

    // 提取所有唯一标签
    const tagsSet = new Set<string>();
    wallpapers.forEach((w) => {
      w.tags.forEach((tag) => tagsSet.add(tag));
    });

    const tags = Array.from(tagsSet).sort();
    return { success: true, data: tags };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch tags' };
  }
}