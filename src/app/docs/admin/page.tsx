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
    tutorial: 'bg-blue-500/20 text-blue-300',
    guide: 'bg-purple-500/20 text-purple-300',
    announcement: 'bg-green-500/20 text-green-300',
    tips: 'bg-orange-500/20 text-orange-300',
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">文章管理</h1>
            <p className="text-gray-400">管理所有文章和教程</p>
          </div>
          
          <Link
            href="/docs/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus size={20} />
            创建文章
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold mb-1">{articles.length}</div>
            <div className="text-sm text-gray-400">总文章数</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => a.published).length}
            </div>
            <div className="text-sm text-gray-400">已发布</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => !a.published).length}
            </div>
            <div className="text-sm text-gray-400">草稿</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl font-bold mb-1">
              {articles.filter(a => a.featured).length}
            </div>
            <div className="text-sm text-gray-400">推荐文章</div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">标题</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">分类</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">作者</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">状态</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">创建时间</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr 
                  key={article.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {article.featured && (
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      )}
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-xs text-gray-500">{article.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${categoryColors[article.category]}`}>
                      {categoryLabels[article.category]}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{article.author}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 text-sm ${
                      article.published ? 'text-green-400' : 'text-gray-500'
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
                  <td className="p-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/docs/${article.slug}`}
                        className="p-2 rounded hover:bg-white/10 transition-colors"
                        title="查看"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/docs/${article.slug}/edit`}
                        className="p-2 rounded hover:bg-white/10 transition-colors"
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
                          className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
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
                  <td colSpan={6} className="p-12 text-center text-gray-500">
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
