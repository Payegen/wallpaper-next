"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight, CloudSun, MoveUpRight, Pointer } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { cn } from "@/lib/utils";
import { SceneArtwork } from "./SceneArtwork";
import { homeScenes } from "./scenes";

export function HomeHero() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = homeScenes[sceneIndex];

  return (
    <section aria-labelledby="home-title" className="relative isolate px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="home-hero-halo pointer-events-none absolute inset-x-0 top-0 -z-10 h-full" aria-hidden="true" />
      <div className="home-hero-copy mx-auto max-w-6xl text-center">
        <p className="mb-5 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-sys-text-muted sm:text-xs">
          <span className="size-1.5 rounded-full bg-sys-primary" /> A NEW PERSPECTIVE ON YOUR EVERYDAY
        </p>
        <h1 id="home-title" className="text-[clamp(2.6rem,6.5vw,5.25rem)] font-semibold leading-[1.15] tracking-[-0.055em]">
          好看的桌面，<br className="sm:hidden" /><span className="home-gradient-text">不止一面。</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-sys-text-secondary sm:text-base">
          精选壁纸、随心小工具，还有跟随指尖的微妙层次。<br className="hidden sm:block" />
          把浏览器，变成你喜欢的样子。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/gallery" size="lg" trailingIcon={<ArrowUpRight />}>发现你的壁纸</ButtonLink>
          <ButtonLink href="#desktop-preview" variant="outline" size="lg" trailingIcon={<ArrowDown />}>先感受一下</ButtonLink>
        </div>
      </div>

      <div id="desktop-preview" className="home-hero-preview mx-auto mt-12 max-w-5xl scroll-mt-28 sm:mt-14">
        <ParallaxCard className="home-hero-scene aspect-[4/3] w-full sm:aspect-[16/8]" innerClassName="rounded-[1.75rem] border border-sys-media-border/15 bg-sys-media-bg" activeOffset={40} role="group" aria-label={`${scene.name}壁纸交互预览`} aria-describedby="preview-instruction">
          <SceneArtwork scene={scene.id} />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-sys-media-bg/15 via-transparent to-sys-media-bg/40" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-sys-media-muted sm:p-8" data-atropos-offset="3">
            <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] sm:text-[10px]">
              <span className="size-1.5 rounded-full bg-sys-media-text/70" /> DESKTOP PREVIEW
            </span>
            <span className="font-mono text-[9px] tracking-wider sm:text-[10px]">0{sceneIndex + 1} / 03</span>
          </div>

          <div className="pointer-events-none absolute left-[8%] top-[24%] text-sys-media-text" data-atropos-offset="10">
            <p className="font-mono text-[8px] tracking-[0.22em] text-sys-media-muted sm:text-[11px]">YOUR TIME. YOUR SPACE.</p>
            <p className="mt-1 text-[clamp(3.25rem,10vw,7.5rem)] font-medium leading-none tracking-[-0.07em] drop-shadow-sys-lg">09:41</p>
            <p className="mt-3 text-xs tracking-wide text-sys-media-muted sm:text-sm">慢一点，也没关系。</p>
          </div>

          <div className="absolute bottom-[22%] right-[7%] hidden w-40 rounded-2xl border border-sys-media-border/15 bg-sys-media-text/10 p-4 text-sys-media-text backdrop-blur-xl sm:block" data-atropos-offset="16">
            <div className="flex items-center justify-between"><CloudSun size={26} strokeWidth={1.5} /><span className="text-2xl font-medium">24°</span></div>
            <div className="mt-3 flex justify-between text-[10px] text-sys-media-muted"><span>天气小工具</span><span>晴好的一天</span></div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
            <div className="text-sys-media-text" data-atropos-offset="7">
              <p className="font-mono text-[8px] tracking-[0.2em] text-sys-media-muted sm:text-[10px]">{scene.subtitle}</p>
              <p className="mt-2 text-lg font-medium tracking-wide sm:text-2xl">{scene.name}</p>
            </div>
            <ButtonLink href="/gallery" variant="glass" size="icon" data-atropos-offset="8" aria-label="前往画廊探索更多壁纸" trailingIcon={<MoveUpRight />} />
          </div>
        </ParallaxCard>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p id="preview-instruction" className="flex items-center gap-2 text-xs text-sys-text-muted"><Pointer size={14} aria-hidden="true" />移动指针，换个角度。触屏也可以试试。</p>
          <div role="group" aria-label="选择预览场景" className="flex items-center gap-1 rounded-full border border-sys-border bg-sys-bg-surface/70 p-1">
            {homeScenes.map((item, index) => (
              <Button key={item.id} variant="ghost" size="sm" aria-pressed={sceneIndex === index} onClick={() => setSceneIndex(index)} className={cn("h-8 px-3 text-[11px]", sceneIndex === index && "bg-sys-bg-page text-sys-primary shadow-sys-sm hover:bg-sys-bg-page hover:text-sys-primary")}>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
