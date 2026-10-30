"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export function HomeHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-sys-border/60 bg-sys-bg-page/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="Wallpaper Next 首页" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sys-primary text-sys-primary-text">
            <Layers3 size={20} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">Wallpaper<span className="text-sys-text-muted"> Next</span></span>
        </Link>

        <nav aria-label="首页导航" className="hidden items-center gap-8 text-sm text-sys-text-secondary md:flex">
          <Link href="#showcase" className="transition-colors hover:text-sys-primary">灵感预览</Link>
          <Link href="#experience" className="transition-colors hover:text-sys-primary">关于体验</Link>
          <Link href="/docs" className="transition-colors hover:text-sys-primary">使用指南</Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {isAdmin && <ButtonLink href="/uploadpage" variant="ghost" size="sm" className="hidden lg:inline-flex">发布壁纸</ButtonLink>}
          <ModeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal"><Button variant="ghost" size="sm" className="px-2 sm:px-4">登录</Button></SignInButton>
          </Show>
          <Show when="signed-in"><UserButton /></Show>
          <ButtonLink href="/gallery" size="sm" aria-label="探索壁纸" className="size-9 p-0 sm:h-10 sm:w-auto sm:px-4" trailingIcon={<ArrowUpRight />}>
            <span className="hidden sm:inline">探索壁纸</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
