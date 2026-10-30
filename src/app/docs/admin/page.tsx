import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Clock } from 'lucide-react';
import { getAllArticles } from '@/app/actions/article';
import { isAdmin } from '@/lib/auth';

export default async function DocsAdminPage() {
  // 权限检查：只有管理员可以访问此页面
  const admin = await isAdmin();
  
  if (!admin) {
    // 如果不是管理员，重定向到文档列表页
    redirect('/docs');
  }
  
  const result = await getAllArticles();
  const articles = result.success ? result.data : [];

  const categoryLabels: Record<string, string> = {
    tutorial: '教程',
    guide: '指南',
    announcement: '公告',
    tips: '技巧',
  };

  const categoryColors: Record<string, string> = {
    tutorial: 'bg-sys-info/20 text-sys-info',
    guide: 'bg-sys-primary-subtle text-sys-primary',
    announcement: 'bg-sys-text-success/20 text-sys-text-success',
    tips: 'bg-sys-text-warning/20 text-sys-text-warning',
  };

  return (
    <div className="min-h-screen bg-sys-bg-page text-sys-text-base pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">文章管理</h1>
            <p className="text-sys-text-secondary">管理所有文章和教程</p>
          </div>
          
          <Link
            href="/docs/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sys-primary text-sys-primary-text hover:bg-sys-primary-hover transition-colors font-medium"
          >
            <Plus size={20} />
            创建文章
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-sys-bg-surface border border-sys-border">
            <div className="text-3xl font-bold mb-1">{articles.length}</div>
            <div className="text-sm text-sys-text-secondary">总文章数</div>
          </div>
          <div className="p-6 rounded-xl bg-sys-bg-surface border border-sys-border">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => a.published).length}
            </div>
            <div className="text-sm text-sys-text-secondary">已发布</div>
          </div>
          <div className="p-6 rounded-xl bg-sys-bg-surface border border-sys-border">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => !a.published).length}
            </div>
            <div className="text-sm text-sys-text-secondary">草稿</div>
          </div>
          <div className="p-6 rounded-xl bg-sys-bg-surface border border-sys-border">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => a.featured).length}
            </div>
            <div className="text-sm text-sys-text-secondary">推荐文章</div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-sys-bg-surface rounded-2xl border border-sys-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-sys-bg-surface border-b border-sys-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-sys-text-secondary">标题</th>
                <th className="text-left p-4 text-sm font-medium text-sys-text-secondary">分类</th>
                <th className="text-left p-4 text-sm font-medium text-sys-text-secondary">作者</th>
                <th className="text-left p-4 text-sm font-medium text-sys-text-secondary">状态</th>
                <th className="text-left p-4 text-sm font-medium text-sys-text-secondary">创建时间</th>
                <th className="text-right p-4 text-sm font-medium text-sys-text-secondary">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr 
                  key={article.id} 
                  className="border-b border-sys-border hover:bg-sys-bg-elevated transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {article.featured && (
                        <Star size={16} className="text-sys-text-warning fill-sys-text-warning" />
                      )}
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-xs text-sys-text-muted">{article.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${categoryColors[article.category]}`}>
                      {categoryLabels[article.category]}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-sys-text-secondary">{article.author}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 text-sm ${
                      article.published ? 'text-sys-text-success' : 'text-sys-text-muted'
                    }`}>
                      {article.published ? (
                        <>
                          <Eye size={14} />
                          已发布
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          草稿
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-sys-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/docs/${article.slug}`}
                        className="p-2 rounded hover:bg-sys-bg-elevated transition-colors"
                        title="查看"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/docs/${article.slug}/edit`}
                        className="p-2 rounded hover:bg-sys-bg-elevated transition-colors"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </Link>
                      <form action={async () => {
                        'use server';
                        const { deleteArticle } = await import('@/app/actions/article');
                        await deleteArticle(article.id);
                      }}>
                        <button
                          type="submit"
                          className="p-2 rounded hover:bg-sys-text-danger/20 text-sys-text-danger transition-colors"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sys-text-muted">
                    暂无文章，点击右上角"创建文章"开始写作
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";