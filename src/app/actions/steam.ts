'use server';

// import { prisma } from '@/lib/prisma';
import { getSteamWorkshopDetails, extractSteamId } from '@/lib/steam';
import { revalidatePath } from 'next/cache';

export async function importFromSteam(url: string) {
  try {
    // 1. 解析 ID
    const steamId = extractSteamId(url);
    if (!steamId) {
      return { success: false, error: "无效的 Steam 链接" };
    }

    // 2. 检查是否已存在
    // const existing = await prisma.wallpaper.findUnique({
    //   where: { steamId },
    // });
    // if (existing) {
    //   return { success: false, error: "该壁纸已导入过" };
    // }

    // 3. 调用 Steam API
    const details = await getSteamWorkshopDetails(steamId);
    
    // 4. 数据映射
    // Steam 返回的 preview_url 通常是图片。
    // Wallpaper Engine 的实际壁纸是 .pkg 文件，Web 无法直接运行，
    // 所以我们这里只存预览图，用户点击后跳转回 Steam 订阅。
    
    // 简单的类型判断逻辑
    // Steam tags 里面可能包含 "Video", "Scene" 等
    // const isVideo = details.tags?.some((t: { tag: string }) => t.tag.toLowerCase().includes('video'));

    // const wallpaper = await prisma.wallpaper.create({
    //   data: {
    //     title: details.title || `Steam Wallpaper ${steamId}`,
    //     description: details.description || "Imported from Steam Workshop",
    //     // 注意：Steam 的 preview_url 可能有时效性或防盗链，
    //     // 生产环境建议把这个图片下载下来上传到你的 R2，这里演示直接存
    //     url: details.preview_url, 
    //     steamId: steamId,
    //     source: "steam",
    //     type: "image", // 即使是动态壁纸，我们在 Web 端也只能展示预览图，所以类型看你需求
    //     resolution: "Unknown", 
    //   },
    // });

    revalidatePath('/gallery');
    return { success: true, data: details };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "导入失败";
    console.error("Steam Import Error:", error);
    return { success: false, error: errorMessage };
  }
}