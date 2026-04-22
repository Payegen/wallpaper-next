"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import {
  getCollectionById,
  updateCollection,
} from "@/app/actions/wallpaper";
import { useAdmin } from "@/hooks/useAuth";

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;
  const { isAdmin, isLoaded } = useAdmin();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: "",
    isPublic: true,
  });

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push("/");
    }
  }, [isLoaded, isAdmin, router]);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  async function loadCollection() {
    setIsLoading(true);
    const result = await getCollectionById(collectionId);
    if (result.success && result.data) {
      setFormData({
        name: result.data.name,
        description: result.data.description || "",
        coverImage: result.data.coverImage || "",
        isPublic: result.data.isPublic,
      });
    } else {
      alert("加载合集失败");
      router.push("/collections");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("请输入合集名称");
      return;
    }

    setIsSaving(true);
    const result = await updateCollection(collectionId, formData);
    setIsSaving(false);

    if (result.success) {
      router.push("/collections");
    } else {
      alert("保存失败：" + result.error);
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/collections"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">编辑合集</h1>
            <p className="text-muted-foreground">修改合集信息</p>
          </div>
        </div>

        {/* 表单 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* 合集名称 */}
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
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入合集名称"
              required
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="输入合集描述"
              rows={4}
            />
          </div>

          {/* 封面图片 */}
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
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/cover.jpg"
            />
            {formData.coverImage && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">预览：</p>
                <img
                  src={formData.coverImage}
                  alt="封面预览"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          {/* 公开状态 */}
          <div className="flex items-center gap-3">
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

          {/* 按钮组 */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? "保存中..." : "保存更改"}
            </motion.button>
            <Link
              href="/collections"
              className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              <X size={18} />
              取消
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
