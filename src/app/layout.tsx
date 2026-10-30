import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
// import RouteLoading from "@/components/layout/RouteLoading";
import { ClerkProvider } from '@clerk/nextjs'

// const geistSans = Geist({
//   // variable: "--font-geist-sans",
//   // subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   // variable: "--font-geist-mono",
//   // subsets: ["latin"],
// });

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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "rgb(var(--sys-primary))",
          colorPrimaryForeground: "rgb(var(--sys-primary-text))",
          colorBackground: "rgb(var(--sys-bg-page))",
          colorForeground: "rgb(var(--sys-text-base))",
          colorMuted: "rgb(var(--sys-bg-surface))",
          colorMutedForeground: "rgb(var(--sys-text-secondary))",
          colorInput: "rgb(var(--sys-bg-surface))",
          colorInputForeground: "rgb(var(--sys-text-base))",
          colorBorder: "rgb(var(--sys-border))",
          colorRing: "rgb(var(--sys-primary))",
          colorDanger: "rgb(var(--sys-text-danger))",
          fontFamily: "var(--font-geist-sans), sans-serif",
        },
      }}
    >
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-sys-bg-page text-sys-text-base")}
      >
        {/* 路由切换进度条 */}
        {/* <RouteLoading /> */}
        
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
