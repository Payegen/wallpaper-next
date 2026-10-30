import Link from "next/link";
import { ArrowUpRight, Layers3, MonitorPlay, MousePointer2, SlidersHorizontal } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { ButtonLink } from "@/components/ui/Button";

const experiences = [
  { number: "01", icon: MonitorPlay, title: "让风景，动起来。", description: "静态的风景，或是流动的瞬间。找到适合自己节奏的壁纸，让每一次打开都有新鲜感。", href: "/gallery", link: "发现更多壁纸" },
  { number: "02", icon: MousePointer2, title: "每次靠近，都有回应。", description: "轻轻移动指尖，看远山、光线与文字各自舒展。细微的层次，带来恰到好处的惊喜。", href: "#desktop-preview", link: "再体验一次" },
  { number: "03", icon: SlidersHorizontal, title: "喜欢什么，就放什么。", description: "把时钟、搜索栏与待办面板放进桌面。自由摆放，让日常的小习惯都有舒服的位置。", href: "/docs", link: "看看使用指南" },
];

export default function Home() {
  return (
    <div className="home-page bg-sys-bg-page text-sys-text-base">
      <HomeHero />

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-sys-border px-5 py-5 text-[11px] text-sys-text-muted sm:gap-x-14 sm:text-xs">
        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-sys-primary" />静态与动态壁纸</span>
        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-sys-info" />自由组合的小工具</span>
        <span className="flex items-center gap-2"><span className="size-1 rounded-full bg-sys-accent" />属于你的灵感合集</span>
      </div>

      <HomeShowcase />

      <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24 border-y border-sys-border bg-sys-bg-surface/60 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-sys-text-muted">LITTLE DETAILS, EVERY DAY</p>
            <h2 id="experience-title" className="text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">给平常的日子，<br />加一点喜欢的细节。</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {experiences.map(({ number, icon: Icon, title, description, href, link }) => (
              <article key={number} className="flex flex-col rounded-2xl border border-sys-border bg-sys-bg-page p-6 sm:p-8">
                <div className="mb-10 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-sys-border bg-sys-bg-surface text-sys-primary"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="font-mono text-[10px] text-sys-text-muted">/ {number}</span>
                </div>
                <h3 className="mb-4 text-xl font-medium tracking-tight">{title}</h3>
                <p className="mb-6 flex-1 text-sm leading-7 text-sys-text-secondary">{description}</p>
                <ButtonLink href={href} variant="ghost" size="sm" className="self-start px-0 hover:bg-transparent" trailingIcon={<ArrowUpRight />}>{link}</ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="start-title">
        <div className="home-cta mx-auto max-w-7xl rounded-[2rem] border border-sys-border px-6 py-16 text-center sm:py-20">
          <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl border border-sys-border bg-sys-bg-page text-sys-primary shadow-sys-sm"><Layers3 size={24} strokeWidth={1.5} aria-hidden="true" /></span>
          <h2 id="start-title" className="text-3xl font-semibold leading-snug tracking-tight sm:text-5xl">你的下一次打开，<br className="sm:hidden" />从喜欢开始。</h2>
          <p className="mx-auto mb-8 mt-5 max-w-lg text-sm leading-7 text-sys-text-secondary">不妨先选一张壁纸。剩下的，慢慢变成你的样子。</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/gallery" size="lg" trailingIcon={<ArrowUpRight />}>找到我的壁纸</ButtonLink>
            <ButtonLink href="/collections" variant="outline" size="lg">逛逛灵感合集</ButtonLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-sys-border px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium"><Layers3 size={17} className="text-sys-primary" aria-hidden="true" />Wallpaper Next</Link>
          <p className="font-mono text-[10px] tracking-wider text-sys-text-muted">A LITTLE SPACE, A LOT OF YOU.</p>
          <nav aria-label="页脚导航" className="flex gap-6 text-xs text-sys-text-secondary">
            <Link href="/docs" className="hover:text-sys-primary">使用指南</Link>
            <Link href="/about" className="hover:text-sys-primary">关于作者</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
