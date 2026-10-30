import { flushSync } from "react-dom";

let isTransitioning = false;

// 固定顶点数量，让相邻关键帧的扇形边缘可以平滑插值。
function fanKeyframes(width: number, height: number, trigger: DOMRect): Keyframe[] {
  const right = trigger.left + trigger.width / 2 >= width / 2;
  const bottom = trigger.top + trigger.height / 2 >= height / 2;
  const x = right ? width : 0;
  const y = bottom ? height : 0;
  // 外接圆略大于视口，避免扇形圆弧及插值弦留下未覆盖的角落。
  const radius = Math.hypot(width, height) + 8;
  const start = right ? Math.PI : 0;
  const direction = right === bottom ? 1 : -1;

  return Array.from({ length: 31 }, (_, frame) => {
    const progress = frame / 30;
    const points = [`${x}px ${y}px`];

    for (let segment = 0; segment <= 32; segment++) {
      const angle = start + direction * (Math.PI / 2) * progress * (segment / 32);
      points.push(`${(x + Math.cos(angle) * radius).toFixed(2)}px ${(y + Math.sin(angle) * radius).toFixed(2)}px`);
    }

    return { clipPath: `polygon(${points.join(", ")})`, offset: progress };
  });
}

/** 从按钮最近的屏幕角落展开扇形；next-themes 继续负责主题状态和持久化。 */
export async function transitionTheme(updateTheme: () => void, trigger: HTMLElement): Promise<void> {
  // 所有主题按钮共享锁，避免快速点击或多个入口启动重叠的截图过渡。
  if (isTransitioning) return;
  isTransitioning = true;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let transition: ViewTransition | undefined;
  let animation: Animation | undefined;
  let completed: Promise<void> | undefined;
  let updated: Promise<void> | undefined;
  let applied = false;

  const applyTheme = () => {
    // 同步提交 next-themes 的 class / color-scheme 更新，再拍摄新主题快照。
    flushSync(updateTheme);
    applied = true;
  };
  const skipOnReducedMotion = () => {
    if (reducedMotion.matches) transition?.skipTransition();
  };

  try {
    if (
      !document.startViewTransition ||
      !root.animate ||
      reducedMotion.matches ||
      document.visibilityState === "hidden"
    ) {
      applyTheme();
      return;
    }

    const frames = fanKeyframes(window.innerWidth, window.innerHeight, trigger.getBoundingClientRect());
    root.dataset.themeTransition = "fan";
    transition = document.startViewTransition(applyTheme);
    // 截图可能因页面隐藏等原因取消，立即接住所有生命周期的拒绝。
    completed = transition.finished.catch(() => undefined);
    updated = transition.updateCallbackDone.catch(() => undefined);
    reducedMotion.addEventListener("change", skipOnReducedMotion);

    await transition.ready;
    animation = root.animate(frames, {
      duration: 760,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both",
      pseudoElement: "::view-transition-new(root)",
    });
    await completed;
  } catch {
    // 动画不可用或被浏览器取消时，仍然完成用户要求的主题切换。
    transition?.skipTransition();
    await updated;
    if (!applied) applyTheme();
    await completed;
  } finally {
    animation?.cancel();
    reducedMotion.removeEventListener("change", skipOnReducedMotion);
    delete root.dataset.themeTransition;
    isTransitioning = false;
  }
}
