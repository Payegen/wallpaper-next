import Link from 'next/link';
import Image from 'next/image';
import { Clock, Tag, BookOpen, Sparkles, Settings } from 'lucide-react';
import { ArticleCategory } from '@/types/article';
import { getAllArticles } from '@/app/actions/article';
import { AdminButtons } from '@/components/article/AdminButtons';

const categoryLabels: Record<ArticleCategory, string> = {
  tutorial: '教程',
  guide: '指南',
  announcement: '公告',
  tips: '技巧',
};

const categoryColors: Record<ArticleCategory, string> = {
  tutorial: 'bg-blue-500/20 text-blue-300',
  guide: 'bg-purple-500/20 text-purple-300',
  announcement: 'bg-green-500/20 text-green-300',
  tips: 'bg-orange-500/20 text-orange-300',
};

export default async function DocsPage() {
  const result = await getAllArticles();
  const allArticles = result.success && result.data ? result.data : [];
  
  // 只显示已发布的文章
  const articles = allArticles.filter(a => a.published);
  const featuredArticles = allArticles.filter(a => a.featured && a.published);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/50">
            文档中心
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            探索 Wallpaper Next 的使用教程、开发指南和最新动态
          </p>
          
          {/* 管理入口 - 只有管理员可见 */}
          <AdminButtons />
        </div>

        {/* 推荐文章 */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="text-2xl font-semibold">推荐阅读</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/docs/${article.slug}`}
                  className="group relative rounded-xl overflow-hidden bg-linear-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* 封面图 */}
                  {article.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* 分类标签 */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[article.category]}`}>
                      {categoryLabels[article.category]}
                    </span>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    
                    {/* 元信息 */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{article.readTime} 分钟阅读</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{article.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 所有文章 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-semibold">所有文章</h2>
            </div>
            
            {/* 分类筛选按钮 (可扩展为交互式筛选) */}
            <div className="flex gap-2">
              {(['tutorial', 'guide', 'tips', 'announcement'] as ArticleCategory[]).map((cat) => (
                <button
                  key={cat}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/docs/${article.slug}`}
                className="group block p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex gap-6">
                  {/* 封面缩略图 */}
                  {article.coverImage && (
                    <div className="relative w-48 h-28 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[article.category]}`}>
                        {categoryLabels[article.category]}
                      </span>
                      {article.featured && (
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <Sparkles size={12} />
                          推荐
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{article.readTime} 分钟</span>
                        </div>
                        <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                      
                      {/* 标签 */}
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-gray-500" />
                        <div className="flex gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
