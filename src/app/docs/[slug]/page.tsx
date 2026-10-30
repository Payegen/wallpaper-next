import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag, User, Calendar, Share2, BookOpen } from 'lucide-react';
import { ArticleCategory } from '@/types/article';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { getArticleBySlug, getAllArticles } from '@/app/actions/article';

const categoryLabels: Record<ArticleCategory, string> = {
  tutorial: '教程',
  guide: '指南',
  announcement: '公告',
  tips: '技巧',
};

const categoryColors: Record<ArticleCategory, string> = {
  tutorial: 'bg-sys-info/20 text-sys-info border-sys-info/30',
  guide: 'bg-sys-primary-subtle text-sys-primary border-sys-primary/30',
  announcement: 'bg-sys-text-success/20 text-sys-text-success border-sys-text-success/30',
  tips: 'bg-sys-text-warning/20 text-sys-text-warning border-sys-text-warning/30',
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  
  if (!result.success || !result.data) {
    notFound();
  }
  
  const article = result.data;

  // 获取相关文章
  const allArticlesResult = await getAllArticles();
  const allArticles = allArticlesResult.success && allArticlesResult.data 
    ? allArticlesResult.data 
    : [];
  
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && a.category === article.category && a.published)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-sys-bg-page text-sys-text-base pt-24 pb-16">
      {/* 封面图背景 */}
      {article.coverImage && (
        <div className="absolute inset-0 h-96 overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-sys-bg-page/80 via-sys-bg-page/95 to-sys-bg-page" />
        </div>
      )}
      
      <div className="relative max-w-4xl mx-auto px-6">
        {/* 返回按钮 */}
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sys-bg-elevated/70 hover:bg-sys-bg-elevated border border-sys-border mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>返回文档</span>
        </Link>

        {/* 文章头部 */}
        <header className="mb-12">
          {/* 分类和标签 */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[article.category as ArticleCategory]}`}>
              {categoryLabels[article.category as ArticleCategory]}
            </span>
            <div className="flex items-center gap-2 text-sm text-sys-text-secondary">
              <Tag size={14} />
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-sys-text-base via-sys-text-base to-sys-text-secondary">
            {article.title}
          </h1>

          {/* 描述 */}
          <p className="text-xl text-sys-text-secondary mb-6">
            {article.description}
          </p>

          {/* 元信息 */}
          <div className="flex items-center gap-6 text-sm text-sys-text-muted">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime} 分钟阅读</span>
            </div>
          </div>
        </header>

        {/* 分割线 */}
        <hr className="mb-8 border-sys-border" />

        {/* 文章内容 */}
        <article className="mb-12">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-8 border-t border-sys-border">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-sys-text-secondary hover:text-sys-text-base transition-colors"
          >
            <BookOpen size={18} />
            <span>查看更多文章</span>
          </Link>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sys-bg-elevated/70 hover:bg-sys-bg-elevated transition-colors">
            <Share2 size={18} />
            <span>分享文章</span>
          </button>
        </div>

        {/* 相关文章推荐 */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6">相关文章</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/docs/${relatedArticle.slug}`}
                  className="p-4 rounded-lg bg-sys-bg-surface hover:bg-sys-bg-elevated border border-sys-border transition-colors"
                >
                  <h4 className="font-medium mb-1">{relatedArticle.title}</h4>
                  <p className="text-sm text-sys-text-secondary line-clamp-1">{relatedArticle.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
