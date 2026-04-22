'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ArticleCategory } from '@/types/article';
import { requireAdmin } from '@/lib/auth';

// 创建文章
export async function createArticle(data: {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  coverImage?: string;
  featured?: boolean;
  published?: boolean;
}) {
  try {
    // 权限检查：只有管理员可以创建文章
    await requireAdmin();
    
    // 计算阅读时长（假设每分钟阅读 200 个字）
    const wordCount = data.content.length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200 / 60));

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        category: data.category,
        tags: data.tags,
        author: data.author,
        readTime,
        coverImage: data.coverImage,
        featured: data.featured || false,
        published: data.published || false,
      },
    });

    revalidatePath('/docs');
    return { success: true, data: article };
  } catch (error) {
    console.error('创建文章失败:', error);
    
    // 如果是权限错误，返回更明确的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }
    
    return { success: false, error: 'Failed to create article' };
  }
}

// 获取所有文章
export async function getAllArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: articles };
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return { success: false, error: 'Failed to fetch articles' };
  }
}

// 根据 ID 获取文章
export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    
    if (!article) {
      return { success: false, error: 'Article not found' };
    }
    
    return { success: true, data: article };
  } catch (error) {
    console.error('获取文章失败:', error);
    return { success: false, error: 'Failed to fetch article' };
  }
}

// 根据 slug 获取文章
export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
    });
    
    if (!article) {
      return { success: false, error: 'Article not found' };
    }
    
    return { success: true, data: article };
  } catch (error) {
    console.error('获取文章失败:', error);
    return { success: false, error: 'Failed to fetch article' };
  }
}

// 更新文章
export async function updateArticle(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    content: string;
    category: ArticleCategory;
    tags: string[];
    author: string;
    coverImage: string;
    featured: boolean;
    published: boolean;
  }>
) {
  try {
    // 权限检查：只有管理员可以更新文章
    await requireAdmin();
    
    // 如果更新了内容，重新计算阅读时长
    let readTime: number | undefined;
    if (data.content) {
      const wordCount = data.content.length;
      readTime = Math.max(1, Math.ceil(wordCount / 200 / 60));
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        ...(readTime && { readTime }),
      },
    });

    revalidatePath('/docs');
    revalidatePath(`/docs/${data.slug || article.slug}`);
    return { success: true, data: article };
  } catch (error) {
    console.error('更新文章失败:', error);
    
    // 如果是权限错误，返回更明确的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }
    
    return { success: false, error: 'Failed to update article' };
  }
}

// 删除文章
export async function deleteArticle(id: string) {
  try {
    // 权限检查：只有管理员可以删除文章
    await requireAdmin();
    
    await prisma.article.delete({
      where: { id },
    });

    revalidatePath('/docs');
    return { success: true };
  } catch (error) {
    console.error('删除文章失败:', error);
    
    // 如果是权限错误，返回更明确的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, error: 'Unauthorized: Please sign in' };
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return { success: false, error: 'Forbidden: Admin access required' };
    }
    
    return { success: false, error: 'Failed to delete article' };
  }
}

// 生成唯一 slug
export async function generateUniqueSlug(title: string): Promise<string> {
  // 将标题转换为 slug
  let slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格转连字符
    .replace(/-+/g, '-') // 多个连字符合并
    .trim();

  // 检查是否已存在
  const existing = await prisma.article.findUnique({
    where: { slug },
  });

  if (!existing) {
    return slug;
  }

  // 如果存在，添加数字后缀
  let counter = 1;
  while (true) {
    const newSlug = `${slug}-${counter}`;
    const exists = await prisma.article.findUnique({
      where: { slug: newSlug },
    });
    
    if (!exists) {
      return newSlug;
    }
    counter++;
  }
}
