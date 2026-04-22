'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Image as ImageIcon, Film, Loader2, CheckCircle2 } from 'lucide-react';
import { getPresignedUrl, createWallpaper } from '@/app/actions/wallpaper';
import { cn } from '@/lib/utils'; // 假设你有这个工具函数
import { importFromSteam } from '../actions/steam';
import { DownloadCloud, Link as LinkIcon } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 表单状态 ---
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  
    // 新增：模式切换
  const [mode, setMode] = useState<'local' | 'steam'>('local');
  const [steamUrl, setSteamUrl] = useState('');
  const [steamId, setSteamId] = useState(''); // Steam ID 输入状态
  const commitSteam = async () => { // 提交 Steam ID 的逻辑
    const result = await importFromSteam(steamId);
    console.log("Steam Import Result:", result);
}
// 处理 Steam 导入
  const handleSteamImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!steamUrl) return;
    
    setIsUploading(true);
    setUploadStatus('uploading');

    const res = await importFromSteam(steamUrl);

    if (res.success) {  
      setUploadStatus('success');
      console.log("Steam Import Result:", res);
    //   setTimeout(() => {
    //     router.push('/gallery');
    //     router.refresh();
    //   }, 1500);
    } else {
      alert(res.error);
      setIsUploading(false);
      setUploadStatus('idle');
    }
  };

  // --- UI 状态 ---
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  // --- 1. 处理文件选择 (拖拽或点击) ---
  const handleFileSelect = (selectedFile: File) => {
    // 简单的校验
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB 限制
      alert("文件太大，请上传 50MB 以内的文件");
      return;
    }

    setFile(selectedFile);

    // 生成本地预览 URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // 智能填充：根据文件名设置标题 (去掉扩展名)
    const fileName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
    setTitle(fileName);

    // 智能填充：根据 MIME 类型判断是图片还是视频
    if (selectedFile.type.startsWith('video')) {
      setType('video');
    } else {
      setType('image');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // --- 2. 提交上传 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      // A. 获取 R2 签名 URL
      const { uploadUrl, publicUrl } = await getPresignedUrl(file.name, file.type);

      // B. 直传 R2 (带上 Content-Type)
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Failed to upload to R2');

      // C. 写入数据库
      // 注意：这里需要根据你的图片/视频获取真实分辨率
      // 简单起见，我们暂时硬编码或留空，以后可以用 react-dropzone 或 video metadata 获取
      const dbRes = await createWallpaper({
        title,
        url: publicUrl,
        type,
        source: 'upload', // 本地上传标识为 'upload'
        resolution: "Unknown", // 后续优化：通过 JS 获取 image.naturalWidth
        description: description || undefined, // 传递描述
      });

      if (!dbRes.success) throw new Error(dbRes.error);

      // D. 成功处理
      setUploadStatus('success');
      setTimeout(() => {
        router.push('/gallery'); // 1.5秒后跳转画廊
        router.refresh(); // 刷新数据
      }, 1500);

    } catch (error) {
      console.error(error);
      alert('上传失败，请重试');
      setIsUploading(false);
      setUploadStatus('idle');
    }
  };

  // --- 3. 重置文件 ---
  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            发布新壁纸
          </h1>
          <p className="text-muted-foreground">分享你的创意，支持 4K 图片与动态壁纸</p>
        </div>

{/* --- 模式切换 Tab --- */}
        <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50 mb-8">
          <button
            onClick={() => setMode('local')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
              mode === 'local' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            本地上传
          </button>
          <button
            onClick={() => setMode('steam')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
              mode === 'steam' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <DownloadCloud size={16}/> Steam 导入
          </button>
        </div>

{   mode === 'local' ? (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl">
            
            {/* --- A. 文件上传区域 --- */}
            <div className="space-y-2">
                <label className="text-sm font-medium ml-1">文件预览</label>
                
                {!file ? (
                // 1. 未选择文件：显示拖拽框
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed border-border/50 bg-background/50 transition-all duration-300",
                    isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "hover:border-primary/50 hover:bg-muted/50"
                    )}
                >
                    <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors mb-4 border border-border">
                    <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-foreground">点击或拖拽上传</p>
                    <p className="text-xs text-muted-foreground mt-1">支持 JPG, PNG, WEBM, MP4 (Max 50MB)</p>
                    <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                </div>
                ) : (
                // 2. 已选择文件：显示预览图
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border bg-black group">
                    {type === 'video' && previewUrl ? (
                    <video src={previewUrl} className="w-full h-full object-contain" controls />
                    ) : (
                    previewUrl && <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                    )}
                    
                    {/* 删除按钮 */}
                    <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors"
                    >
                    <X size={20} />
                    </button>
                </div>
                )}
            </div>

            {/* --- B. 表单字段 --- */}
            <AnimatePresence>
                {file && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                >
                    {/* 标题 */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">标题</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="给壁纸起个好听的名字"
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        required
                    />
                    </div>

                    {/* 类型选择 (Segment Control) */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">类型</label>
                    <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50">
                        <button
                        type="button"
                        onClick={() => setType('image')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                            type === 'image' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                        >
                        <ImageIcon size={16} /> 图片
                        </button>
                        <button
                        type="button"
                        onClick={() => setType('video')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                            type === 'video' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                        >
                        <Film size={16} /> 动态壁纸
                        </button>
                    </div>
                    </div>

                    {/* 描述 */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">描述 (可选)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="写点什么介绍这张壁纸..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                    </div>

                    {/* 提交按钮 */}
                    <button
                    type="submit"
                    disabled={isUploading || !title}
                    className={cn(
                        "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
                        uploadStatus === 'success' 
                        ? "bg-green-500 text-white"
                        : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",
                        (isUploading || !title) && "opacity-50 cursor-not-allowed"
                    )}
                    >
                    {uploadStatus === 'uploading' ? (
                        <><Loader2 className="animate-spin" /> 上传中...</>
                    ) : uploadStatus === 'success' ? (
                        <><CheckCircle2 /> 发布成功</>
                    ) : (
                        "确认发布"
                    )}
                    </button>

                </motion.div>
                )}
            </AnimatePresence>

            </form>
    ) : (
        // ... 新的 Steam 导入 Form ...
            <form onSubmit={handleSteamImport} className="space-y-8 bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl">
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                        <div className="p-4 bg-[#171a21] rounded-full mb-4">
                        {/* Steam Logo 颜色 */}
                        <LinkIcon size={32} className="text-[#66c0f4]" />
                        </div>
                        <h3 className="text-lg font-bold">粘贴创意工坊链接</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                        支持 Wallpaper Engine 官方创意工坊链接。<br/>
                        例如: https://steamcommunity.com/sharedfiles/filedetails/?id=xxxx
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">链接地址</label>
                        <input
                        type="url"
                        value={steamUrl}
                        onChange={(e) => setSteamUrl(e.target.value)}
                        placeholder="https://steamcommunity.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-[#66c0f4]/50 outline-none transition-all"
                        required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUploading || !steamUrl}
                    className={cn(
                        "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
                        uploadStatus === 'success' 
                        ? "bg-green-500 text-white"
                        : "bg-[#171a21] text-white hover:bg-[#1b2838]", // Steam 风格按钮
                        (isUploading || !steamUrl) && "opacity-50 cursor-not-allowed"
                    )}
                    >
                    {uploadStatus === 'uploading' ? "正在获取元数据..." : uploadStatus === 'success' ? "导入成功" : "导入壁纸"}
                </button>
            </form>
)}

        <div>
            <input value={steamId} onChange={
                (e) => setSteamId(e.target.value)
            }>
            </input>
            <button onClick={commitSteam}>
                获取
            </button>
        </div>
      </motion.div>
    </div>
  );
}