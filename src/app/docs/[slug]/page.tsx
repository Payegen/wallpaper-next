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
  tutorial: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  guide: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  announcement: 'bg-green-500/20 text-green-300 border-green-500/30',
  tips: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
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
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>
      )}
      
      <div className="relative max-w-4xl mx-auto px-6">
        {/* 返回按钮 */}
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 mb-8 transition-colors"
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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Tag size={14} />
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            {article.title}
          </h1>

          {/* 描述 */}
          <p className="text-xl text-gray-400 mb-6">
            {article.description}
          </p>

          {/* 元信息 */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
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
        <hr className="mb-8 border-white/10" />

        {/* 文章内容 */}
        <article className="mb-12">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <BookOpen size={18} />
            <span>查看更多文章</span>
          </Link>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
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
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <h4 className="font-medium mb-1">{relatedArticle.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-1">{relatedArticle.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
