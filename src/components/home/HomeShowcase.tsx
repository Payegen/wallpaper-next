import { ArrowUpRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { SceneArtwork } from "./SceneArtwork";
import { homeScenes } from "./scenes";

export function HomeShowcase() {
  return (
    <section id="showcase" aria-labelledby="showcase-title" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-12">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-sys-text-muted"><Sparkles size={14} aria-hidden="true" /> A SMALL ESCAPE</p>
          <h2 id="showcase-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">总有一处风景，<br className="sm:hidden" />刚好是你的心情。</h2>
        </div>
        <ButtonLink href="/gallery" variant="ghost" className="self-start px-0 hover:bg-transparent sm:self-auto" trailingIcon={<ArrowUpRight />}>去画廊发现更多</ButtonLink>
      </div>

      <div id="home-scene-showcase" className="grid gap-8 md:grid-cols-3">
        {homeScenes.map((scene, index) => (
          <article key={scene.id} className="group min-w-0">
            <ParallaxCard className="aspect-[4/4.5]" innerClassName="rounded-2xl border border-sys-media-border/15 bg-sys-media-bg" activeOffset={24} rotateXMax={7} rotateYMax={9} eventsEl="#home-scene-showcase" stretchX={6} role="group" aria-label={`${scene.name}分层风景预览`}>
              <SceneArtwork scene={scene.id} />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-sys-media-bg/15 via-transparent to-sys-media-bg/70" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-[10px] text-sys-media-muted" data-atropos-offset="3">
                <span className="font-mono tracking-widest">0{index + 1} / INSPIRATION</span>
                <span className="size-1.5 rounded-full bg-sys-media-text/60" />
              </div>
              <div className="absolute bottom-0 left-0 p-6 text-sys-media-text" data-atropos-offset="9">
                <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-sys-media-muted">{scene.label}</p>
                <h3 className="text-3xl font-medium tracking-tight">{scene.name}</h3>
              </div>
            </ParallaxCard>
            <div className="flex items-start justify-between gap-4 px-1 pt-5">
              <p className="max-w-56 text-sm leading-6 text-sys-text-secondary">{scene.description}</p>
              <ButtonLink href="/gallery" variant="outline" size="icon" aria-label={`去画廊发现${scene.name}的灵感`} trailingIcon={<ArrowUpRight />} />
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-sys-text-muted">以上为交互场景预览，更多壁纸等你在画廊发现。</p>
    </section>
  );
}
