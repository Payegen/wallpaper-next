import { Article, ArticleListItem } from '@/types/article';

// Mock 文章数据 (后续可迁移到数据库)
export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'getting-started',
    title: '快速开始：5分钟上手 Wallpaper Next',
    description: '了解如何使用 Wallpaper Next 打造你的专属 Web 桌面，从安装到配置的完整指南。',
    content: `
# 快速开始：5分钟上手 Wallpaper Next

欢迎来到 Wallpaper Next！本教程将带你快速上手这个强大的 Web 壁纸平台。

## 什么是 Wallpaper Next？

Wallpaper Next 是一个基于浏览器的云端桌面壁纸平台，融合了 Steam Wallpaper Engine 风格的动态壁纸和实用小工具组件。

## 核心功能

### 1. 壁纸浏览与预览
- 支持图片和视频两种类型壁纸
- 高清预览和全屏体验
- 分类筛选和标签搜索

### 2. 小工具组件
- **时钟**: 实时显示当前时间
- **天气**: 显示城市天气信息
- **搜索栏**: 快速搜索功能
- **待办清单**: 任务管理工具

### 3. 个性化定制
- 拖拽式组件布局
- 自动隐藏 UI
- 深色主题

## 开始使用

1. 访问首页，点击"开始探索"
2. 在画廊中选择喜欢的壁纸
3. 点击壁纸预览桌面效果
4. 使用右上角设置添加小工具
5. 拖拽组件到合适位置

## 下一步

- 查看更多壁纸类型
- 学习如何上传自己的壁纸
- 探索高级自定义功能
    `,
    category: 'tutorial',
    tags: ['新手指南', '快速开始', '基础功能'],
    author: 'Wallpaper Next Team',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    readTime: 5,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    featured: true,
  },
  {
    id: '2',
    slug: 'widget-customization',
    title: '小工具组件完全指南',
    description: '深入了解如何使用和自定义小工具组件，打造个性化桌面体验。',
    content: `
# 小工具组件完全指南

Wallpaper Next 的小工具组件系统是整个平台的核心特性之一。本指南将详细介绍如何使用和自定义这些组件。

## 可用组件

### 时钟组件
显示实时时间，采用大字体设计，清晰易读。

### 天气组件
显示当前城市天气信息，包括温度和天气图标。

### 搜索栏
快速搜索功能，支持各种搜索引擎。

### 待办清单
简单实用的任务管理工具，帮助你保持高效。

## 如何添加组件

1. 进入壁纸详情页
2. 点击右上角的设置图标
3. 从菜单中选择要添加的组件
4. 组件将自动出现在屏幕中央

## 拖拽定位

所有组件都支持拖拽移动：
- 鼠标按住组件即可拖动
- 释放鼠标后位置自动保存
- 支持多层组件重叠

## 删除组件

悬停在组件上时，右上角会出现删除按钮（X），点击即可移除。
    `,
    category: 'guide',
    tags: ['小工具', '自定义', '组件'],
    author: 'Wallpaper Next Team',
    publishedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    readTime: 8,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    featured: true,
  },
  {
    id: '3',
    slug: 'upload-your-wallpaper',
    title: '如何上传自己的壁纸',
    description: '学习如何将你喜欢的图片或视频上传到平台，分享给其他用户。',
    content: `
# 如何上传自己的壁纸

Wallpaper Next 支持用户上传自己的壁纸内容。本教程将指导你完成整个上传流程。

## 准备工作

### 支持的格式
- **图片**: JPG, PNG, WebP
- **视频**: MP4, WebM

### 分辨率建议
- 最低: 1920x1080 (1080P)
- 推荐: 3840x2160 (4K)

## 上传步骤

### 1. 访问上传页面
点击导航栏的"上传"按钮，进入上传页面。

### 2. 填写信息
- **标题**: 为你的壁纸起个名字
- **描述**: 简要描述壁纸内容
- **类型**: 选择图片或视频
- **标签**: 添加相关标签

### 3. 选择文件
拖拽或点击选择要上传的文件。

### 4. 提交审核
上传后，内容将进入审核队列，通过后即可在画廊中展示。

## 注意事项

- 确保你拥有上传内容的版权
- 避免上传敏感或违规内容
- 优质内容将获得推荐机会
    `,
    category: 'tutorial',
    tags: ['上传', '壁纸', '分享'],
    author: 'Wallpaper Next Team',
    publishedAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    readTime: 6,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    featured: false,
  }, 
  {
    id: '5',
    slug: 'version-1.0-announcement',
    title: 'Wallpaper Next 1.0 正式发布！',
    description: '我们很高兴地宣布 Wallpaper Next 1.0 版本正式发布，带来了许多激动人心的新功能。',
    content: `
# Wallpaper Next 1.0 正式发布！

经过几个月的开发和测试，我们很高兴地宣布 Wallpaper Next 1.0 版本正式发布！

## 新功能亮点

### 🎨 全新壁纸系统
- 支持 4K 高清图片
- 支持 WebM 动态视频
- 流畅的预览体验

### 🧩 小工具组件
- 时钟、天气、搜索、待办四大组件
- 拖拽式自由布局
- 自动保存位置

### 🎯 性能优化
- 图片懒加载
- 视频自动播放优化
- 更流畅的动画效果

### 🌙 深色主题
- 精心设计的深色界面
- 护眼舒适

## 下一步计划

我们正在开发更多激动人心的功能：

- 用户系统与收藏功能
- 更多小工具组件
- 移动端适配优化
- PWA 支持
- 社区互动功能

## 感谢

感谢所有参与测试和反馈的用户，你们的支持是我们前进的动力！

---
发布日期: 2024年1月1日
    `,
    category: 'announcement',
    tags: ['发布', '更新', 'v1.0'],
    author: 'Wallpaper Next Team',
    publishedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    readTime: 4,
    coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
    featured: true,
  },
];

// 获取文章列表（不含完整内容）
export function getArticleList(): ArticleListItem[] {
  return mockArticles.map(({ content, ...article }) => article);
}

// 根据 slug 获取文章详情
export function getArticleBySlug(slug: string): Article | null {
  return mockArticles.find(article => article.slug === slug) || null;
}

// 根据分类获取文章
export function getArticlesByCategory(category: string): ArticleListItem[] {
  return mockArticles
    .filter(article => article.category === category)
    .map(({ content, ...article }) => article);
}

// 获取推荐文章
export function getFeaturedArticles(): ArticleListItem[] {
  return mockArticles
    .filter(article => article.featured)
    .map(({ content, ...article }) => article);
}
