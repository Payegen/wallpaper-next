"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Plus, X } from "lucide-react";
import { useAdmin } from "@/hooks/useAuth";
import {
  getCollectionById,
  getAllWallpaper,
  addWallpapersToCollection,
  removeWallpapersFromCollection,
} from "@/app/actions/wallpaper";

interface Wallpaper {
  id: string;
  title: string;
  url: string;
  type: string;
  source: string;
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  wallpapers: Wallpaper[];
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  const { isAdmin } = useAdmin();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [selectedWallpapers, setSelectedWallpapers] = useState<string[]>([]);

 

  async function loadCollection() {
    setIsLoading(true);
    const result = await getCollectionById(collectionId);
    if (result.success && result.data) {
      setCollection(result.data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  async function loadAllWallpapers() {
    const result = await getAllWallpaper();
    if (result.success && result.data) {
      // 过滤掉已经在合集中的壁纸
      const collectionWallpaperIds = collection?.wallpapers.map((w) => w.id) || [];
      const available = result.data.filter(
        (w) => !collectionWallpaperIds.includes(w.id)
      );
      setAllWallpapers(available);
    }
  }

  async function handleAddWallpapers() {
    if (selectedWallpapers.length === 0) return;

    const result = await addWallpapersToCollection(
      collectionId,
      selectedWallpapers
    );
    if (result.success) {
      setSelectedWallpapers([]);
      setShowAddModal(false);
      loadCollection();
    } else {
      alert("添加失败：" + result.error);
    }
  }

  async function handleRemoveWallpaper(wallpaperId: string) {
    const result = await removeWallpapersFromCollection(collectionId, [
      wallpaperId,
    ]);
    if (result.success) {
      loadCollection();
    } else {
      alert("移除失败：" + result.error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">合集不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题栏 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/collections")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
            {collection.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                loadAllWallpapers();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              添加壁纸
            </motion.button>
          )}
        </div>

        {/* 壁纸网格 */}
        {collection.wallpapers.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">合集中还没有壁纸</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collection.wallpapers.map((wallpaper) => (
              <motion.div
                key={wallpaper.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
                onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
              >
                <img
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium truncate">
                    {wallpaper.title}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWallpaper(wallpaper.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} className="text-white" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 添加壁纸模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">添加壁纸到合集</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedWallpapers([]);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {allWallpapers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  没有可添加的壁纸
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                    {allWallpapers.map((wallpaper) => (
                      <div
                        key={wallpaper.id}
                        onClick={() => {
                          setSelectedWallpapers((prev) =>
                            prev.includes(wallpaper.id)
                              ? prev.filter((id) => id !== wallpaper.id)
                              : [...prev, wallpaper.id]
                          );
                        }}
                        className={`relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                          selectedWallpapers.includes(wallpaper.id)
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={wallpaper.url}
                          alt={wallpaper.title}
                          className="w-full h-full object-cover"
                        />
                        {selectedWallpapers.includes(wallpaper.id) && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground text-sm">
                                ✓
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedWallpapers([]);
                      }}
                      className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAddWallpapers}
                      disabled={selectedWallpapers.length === 0}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加 ({selectedWallpapers.length})
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
