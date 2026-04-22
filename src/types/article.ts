export type ArticleCategory = 'tutorial' | 'guide' | 'announcement' | 'tips';

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  readTime: number; // 阅读时长(分钟)
  coverImage?: string;
  featured: boolean; // 是否为推荐文章
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  publishedAt: Date;
  readTime: number;
  coverImage?: string;
  featured: boolean;
}
