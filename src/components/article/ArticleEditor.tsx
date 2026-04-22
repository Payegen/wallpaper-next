'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, Eye, Upload, X, Sparkles, BookOpen, Megaphone, Lightbulb, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ArticleCategory } from '@/types/article';

interface ArticleFormData {
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
}

interface ArticleEditorProps {
  initialData?: Partial<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isEditing?: boolean;
}

const categoryOptions = [
  { value: 'tutorial', label: '教程', icon: BookOpen, color: 'text-blue-400' },
  { value: 'guide', label: '指南', icon: Sparkles, color: 'text-purple-400' },
  { value: 'announcement', label: '公告', icon: Megaphone, color: 'text-green-400' },
  { value: 'tips', label: '技巧', icon: Lightbulb, color: 'text-orange-400' },
] as const;

export default function ArticleEditor({ initialData, onSubmit, isEditing = false }: ArticleEditorProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'tutorial',
    tags: initialData?.tags || [],
    author: initialData?.author || 'Wallpaper Next Team',
    coverImage: initialData?.coverImage || '',
    featured: initialData?.featured || false,
    published: initialData?.published || false,
  });

  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动生成 slug
  useEffect(() => {
    if (autoSlug && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, autoSlug]);

  // 处理标题变化
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
  };

  // 添加标签
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 插入 Markdown 模板
  const insertTemplate = (template: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + template,
    }));
  };

  // 插入文本到光标位置
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = formData.content.substring(0, start) + text + formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // 恢复光标位置
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  // 上传图片
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setUploadingImage(true);
    try {
      // 1. 获取预签名 URL
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error('获取上传地址失败');
      
      const { uploadUrl, publicUrl } = await response.json();

      // 2. 上传文件到 R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error('上传文件失败');

      // 3. 插入 Markdown 图片语法
      const imageMarkdown = `![${file.name}](${publicUrl})`;
      insertAtCursor(imageMarkdown);

    } catch (error) {
      console.error('上传图片失败:', error);
      alert('上传图片失败，请重试');
    } finally {
      setUploadingImage(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // 清空 input 以便重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 拖拽上传
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const templates = {
    heading: '# 标题\n## 二级标题\n### 三级标题',
    list: '- 列表项 1\n- 列表项 2\n- 列表项 3',
    code: '```javascript\nconsole.log("Hello, World!");\n```',
    quote: '> 这是一条引用',
    table: '| 列 1 | 列 2 |\n|------|------|\n| 内容 | 内容 |',
    image: '![图片描述](图片URL)',
  };

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {isEditing ? '编辑文章' : '创建新文章'}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Eye size={18} />
              {showPreview ? '编辑' : '预览'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：主要内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2">文章标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="输入文章标题..."
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug *
                  <span className="text-xs text-gray-500 ml-2">（文章的唯一标识）</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, slug: e.target.value }));
                    setAutoSlug(false);
                  }}
                  placeholder="article-url-slug"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors font-mono"
                  required
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium mb-2">文章描述 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="简短描述文章内容..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* 内容编辑器 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">文章内容 (Markdown) *</label>
                  
                  {/* 快速插入工具栏 */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.heading)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      标题
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.list)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      列表
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.code)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      代码
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.quote)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      引用
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.table)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      表格
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(templates.image)}
                      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      图片
                    </button>
                  </div>
                </div>

                {/* 图片上传按钮 */}
                <div className="mb-2 flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors text-sm ${
                      uploadingImage 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        上传中...
                      </>
                    ) : (
                      <>
                        <ImageIcon size={16} />
                        上传图片
                      </>
                    )}
                  </label>
                  <span className="text-xs text-gray-500">支持拖拽图片到编辑区域</span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  placeholder="在这里编写文章内容...&#10;&#10;支持拖拽图片上传"
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors resize-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  字数：{formData.content.length} | 预计阅读时长：{Math.max(1, Math.ceil(formData.content.length / 200 / 60))} 分钟
                </p>
              </div>
            </div>

            {/* 右侧：设置面板 */}
            <div className="space-y-6">
              {/* 分类 */}
              <div>
                <label className="block text-sm font-medium mb-2">文章分类 *</label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: option.value }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          formData.category === option.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Icon size={16} className={option.color} />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 作者 */}
              <div>
                <label className="block text-sm font-medium mb-2">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              {/* 标签 */}
              <div>
                <label className="block text-sm font-medium mb-2">标签</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="输入标签..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-sm"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 封面图片 */}
              <div>
                <label className="block text-sm font-medium mb-2">封面图片 URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.coverImage} 
                      alt="封面预览" 
                      className="w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* 开关选项 */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <div className="font-medium text-sm">推荐文章</div>
                    <div className="text-xs text-gray-500">在文档页推荐显示</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.featured ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        formData.featured ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <div className="font-medium text-sm">发布文章</div>
                    <div className="text-xs text-gray-500">取消勾选则保存为草稿</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.published ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        formData.published ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSaving || uploadingImage}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEditing ? '更新文章' : '创建文章'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
