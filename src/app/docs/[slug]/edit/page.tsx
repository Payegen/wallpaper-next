import { notFound, redirect } from 'next/navigation';
import ArticleEditor from '@/components/article/ArticleEditor';
import { getArticleBySlug, updateArticle } from '@/app/actions/article';
import { isAdmin } from '@/lib/auth';

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  // 权限检查：只有管理员可以访问此页面
  const admin = await isAdmin();
  
  if (!admin) {
    // 如果不是管理员，重定向到文档列表页
    redirect('/docs');
  }
  
  const { slug } = await params;
  const result = await getArticleBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const article = result.data;

  const handleUpdateArticle = async (formData: any) => {
    'use server';
    
    const result = await updateArticle(article.id, formData);
    
    if (result.success && result.data) {
      // 这里不能 redirect，因为是在 Server Action 中
      // 可以返回成功状态，让客户端处理跳转
      return result.data;
    } else {
      throw new Error(result.error || '更新文章失败');
    }
  };

  return (
    <ArticleEditor 
      initialData={{
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        category: article.category as any,
        tags: article.tags,
        author: article.author,
        coverImage: article.coverImage || '',
        featured: article.featured,
        published: article.published,
      }}
      onSubmit={handleUpdateArticle}
      isEditing={true}
    />
  );
}
