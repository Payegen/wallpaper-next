import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import RouteLoading from "@/components/layout/RouteLoading";
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wallpaper Next - 你的云端桌面",
  description: "集成小工具的 Web 壁纸平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 
      1. ✅ 移除 className="dark" 
      2. ✅ 保留 suppressHydrationWarning (这正是为了消除 next-themes 动态修改 class 带来的警告)
    */
   <ClerkProvider>
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`, 
          "antialiased bg-sys-bg-page text-sys-bg-page")}
      >
        {/* 路由切换进度条 */}
        <RouteLoading />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="relative w-full min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
