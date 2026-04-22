"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PlayCircle, Search, X, FolderOpen, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllWallpaper, getAllTags } from "../actions/wallpaper";

interface Wallpaper {
  id: string;
  title: string;
  type: string;
  url: string;
  source: string;
  tags: string[];
  thumbnail?: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function GalleryPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 2,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadWallpapers();
    loadTags();
  }, [currentPage]);

  useEffect(() => {
    // 当筛选条件改变时，重置到第一页并重新加载
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadWallpapers();
    }
  }, [searchQuery, selectedTags, selectedSource]);

  async function loadWallpapers() {
    setIsLoading(true);
    const result = await getAllWallpaper({
      search: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      source: selectedSource !== "all" ? (selectedSource as 'upload' | 'steam') : undefined,
      page: currentPage,
      pageSize: pagination.pageSize,
    });
    
    if (result.success && result.data) {
      setWallpapers(result.data);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    }
    setIsLoading(false);
  }

  async function loadTags() {
    const result = await getAllTags();
    if (result.success && result.data) {
      setAllTags(result.data);
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部导航 */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">探索壁纸</h1>
          </div>

          {/* 合集入口 */}
          <Link
            href="/collections"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <FolderOpen size={18} />
            <span>合集</span>
          </Link>
        </header>

        {/* 搜索和筛选栏 */}
        <div className="mb-8 space-y-4">
          {/* 搜索框 */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索壁纸..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters
                  ? "bg-white text-black border-white"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <Filter size={18} />
              <span>筛选</span>
            </button>
          </div>

          {/* 筛选面板 */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  {/* 来源筛选 */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      来源
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "all", label: "全部" },
                        { value: "upload", label: "用户上传" },
                        { value: "steam", label: "Steam 导入" },
                      ].map((source) => (
                        <button
                          key={source.value}
                          onClick={() => setSelectedSource(source.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedSource === source.value
                              ? "bg-white text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {source.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 标签筛选 */}
                  {allTags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/60">
                        标签
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedTags.includes(tag)
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 清除筛选 */}
                  {(selectedTags.length > 0 || selectedSource !== "all") && (
                    <button
                      onClick={() => {
                        setSelectedTags([]);
                        setSelectedSource("all");
                      }}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      清除所有筛选
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 当前筛选状态 */}
          {(searchQuery || selectedTags.length > 0 || selectedSource !== "all") && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>
                找到 {pagination.total} 张壁纸
              </span>
            </div>
          )}
        </div>

        {/* 壁纸网格 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/40">加载中...</div>
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search size={64} className="text-white/20 mb-4" />
            <p className="text-white/40">没有找到匹配的壁纸</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wallpapers.map((wp) => (
                <Link href={`/wallpaper/${wp.id}`} key={wp.id} className="group block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    {/* 图片/封面 */}
                    <Image
                      src={wp.type === "video" && wp.thumbnail ? wp.thumbnail : wp.url}
                      alt={wp.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* 动态壁纸标识 */}
                    {wp.type === "video" && (
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                        <PlayCircle size={16} className="text-white" />
                      </div>
                    )}

                    {/* 来源标识 */}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs text-white">
                        {wp.source === "steam" ? "Steam" : "上传"}
                      </span>
                    </div>

                    {/* 悬停遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold text-lg">{wp.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/60 text-xs">点击预览桌面效果</span>
                        {wp.tags && wp.tags.length > 0 && (
                          <div className="flex gap-1">
                            {wp.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-white/20 rounded text-xs text-white"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* 分页控件 */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* 上一页 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                {/* 页码 */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // 显示当前页附近的页码
                      if (Math.abs(page - currentPage) <= 2) return true;
                      if (page === 1 || page === pagination.totalPages) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-white/40">...</span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => goToPage(page)}
                          className={`min-w-[40px] h-10 px-3 rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-white text-black font-semibold"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          {page}
                        </motion.button>
                      </div>
                    ))}
                </div>

                {/* 下一页 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}

            {/* 分页信息 */}
            <div className="text-center text-sm text-white/40 mt-4">
              第 {currentPage} / {pagination.totalPages} 页，共 {pagination.total} 张壁纸
            </div>
          </>
        )}
      </div>
    </div>
  );
}
