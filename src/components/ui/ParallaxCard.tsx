"use client";

import Atropos, { type AtroposInstance } from "atropos";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ParallaxCardProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  activeOffset?: number;
  rotateXMax?: number;
  rotateYMax?: number;
  eventsEl?: string;
  stretchX?: number;
}

export function ParallaxCard({
  children,
  className,
  innerClassName,
  activeOffset = 36,
  rotateXMax = 8,
  rotateYMax = 10,
  eventsEl,
  stretchX = 0,
  ...props
}: ParallaxCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: AtroposInstance | undefined;

    const synchronizeMotion = () => {
      instance?.destroy();
      instance = undefined;
      element.classList.remove("atropos-active");
      if (preference.matches) return;

      instance = Atropos({
        el: element,
        eventsEl,
        activeOffset,
        rotateXMax,
        rotateYMax,
        rotateTouch: "scroll-y",
        stretchX,
        commonOrigin: true,
        shadow: false,
        highlight: true,
        duration: 400,
      });
    };

    synchronizeMotion();
    preference.addEventListener("change", synchronizeMotion);
    return () => {
      preference.removeEventListener("change", synchronizeMotion);
      instance?.destroy();
      element.classList.remove("atropos-active");
    };
  }, [activeOffset, eventsEl, rotateXMax, rotateYMax, stretchX]);

  return (
    <div {...props} ref={elementRef} className={cn("atropos parallax-card", className)}>
      <div className="atropos-scale">
        <div className="atropos-rotate">
          <div className={cn("atropos-inner", innerClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
