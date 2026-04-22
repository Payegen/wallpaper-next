"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, FolderOpen, Edit2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAuth";
import {
  createCollection,
  getAllCollections,
  deleteCollection,
} from "@/app/actions/wallpaper";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    wallpapers: number;
  };
}

export default function CollectionsPage() {
  const router = useRouter();
  const { isAdmin, isLoaded } = useAdmin();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: "",
    isPublic: true,
  });

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    setIsLoading(true);
    const result = await getAllCollections();
    if (result.success && result.data) {
      setCollections(result.data);
    }
    setIsLoading(false);
  }

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const result = await createCollection(formData);
    if (result.success) {
      setFormData({ name: "", description: "", coverImage: "", isPublic: true });
      setShowCreateForm(false);
      loadCollections();
    } else {
      alert("创建失败：" + result.error);
    }
  }

  async function handleDeleteCollection(id: string, name: string) {
    if (!confirm(`确定要删除合集"${name}"吗？`)) return;

    const result = await deleteCollection(id);
    if (result.success) {
      loadCollections();
    } else {
      alert("删除失败：" + result.error);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">壁纸合集</h1>
            <p className="text-muted-foreground">管理和浏览壁纸合集</p>
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              创建合集
            </motion.button>
          )}
        </div>

        {/* 创建表单 */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-card border border-border rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">创建新合集</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  合集名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入合集名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="输入合集描述"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  封面图片 URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm">
                  公开合集
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  创建
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 合集列表 */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            加载中...
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">还没有合集，创建一个吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => router.push(`/collections/${collection.id}`)}
              >
                {/* 封面 */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {collection.coverImage ? (
                    <img
                      src={collection.coverImage}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen size={48} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm">
                      {collection._count.wallpapers} 张壁纸
                    </p>
                  </div>
                </div>

                {/* 信息 */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/collections/${collection.id}/edit`);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollection(
                              collection.id,
                              collection.name
                            );
                          }}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </span>
                    {!collection.isPublic && (
                      <span className="px-2 py-1 bg-muted rounded">
                        私有
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
