import { redirect } from 'next/navigation';
import ArticleEditor from '@/components/article/ArticleEditor';
import { createArticle } from '@/app/actions/article';
import { isAdmin } from '@/lib/auth';

export default async function NewArticlePage() {
  // 权限检查：只有管理员可以访问此页面
  const admin = await isAdmin();
  
  if (!admin) {
    // 如果不是管理员，重定向到文档列表页
    redirect('/docs');
  }
  
  const handleCreateArticle = async (formData: any) => {
    'use server';
    
    const result = await createArticle(formData);
    
    if (result.success && result.data) {
      redirect(`/docs/${result.data.slug}`);
    } else {
      throw new Error(result.error || '创建文章失败');
    }
  };

  return (
    <ArticleEditor 
      onSubmit={handleCreateArticle}
      isEditing={false}
    />
  );
}
