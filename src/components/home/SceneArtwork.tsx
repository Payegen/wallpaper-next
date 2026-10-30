"use client";

import { useId } from "react";
import type { SceneId } from "./scenes";

const stars = [
  [84, 88], [164, 180], [260, 64], [342, 139], [460, 52], [534, 176],
  [620, 93], [704, 37], [793, 112], [938, 65], [1060, 153], [1133, 72],
  [66, 280], [210, 340], [403, 264], [584, 306], [731, 214], [1037, 303],
];

const landscapes: Record<SceneId, { far: string; middle: string; front: string }> = {
  cosmic: {
    far: "M-100 650V470L60 432 180 474 330 260 480 438 650 335 780 405 930 270 1090 420 1300 360V750Z",
    middle: "M-100 750V560L90 494 180 530 350 440 520 550 670 440 820 488 1000 410 1300 530V750Z",
    front: "M-100 750V640L60 585 260 630 410 550 580 614 780 558 970 602 1150 520 1300 570V750Z",
  },
  alpine: {
    far: "M-100 750V550L80 460 225 315 380 480 540 218 725 435 880 285 1060 475 1300 370V750Z",
    middle: "M-100 750V585L100 495 245 520 420 398 590 520 775 405 940 525 1100 435 1300 505V750Z",
    front: "M-100 750V655L80 570 220 605 360 538 550 625 760 555 920 630 1100 545 1300 610V750Z",
  },
  dune: {
    far: "M-100 750V475Q100 310 280 430T650 390T1000 420T1300 375V750Z",
    middle: "M-100 750V555Q120 405 350 510T750 475T1100 515T1300 450V750Z",
    front: "M-100 750V650Q160 480 430 600T850 565T1300 575V750Z",
  },
};

/** 原创分层矢量场景；每层独立参与 Atropos 的景深移动。 */
export function SceneArtwork({ scene = "cosmic" }: { scene?: SceneId }) {
  const id = useId().replaceAll(":", "");
  const shape = landscapes[scene];

  return (
    <div className={`scene-artwork scene-artwork--${scene}`} aria-hidden="true">
      <svg className="scene-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" data-atropos-offset="-6">
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgb(var(--scene-tone-a))" stopOpacity="0.7" />
            <stop offset="0.55" stopColor="rgb(var(--sys-media-bg))" stopOpacity="0.2" />
            <stop offset="1" stopColor="rgb(var(--scene-tone-b))" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="rgb(var(--scene-tone-c))" stopOpacity="0.45" />
            <stop offset="1" stopColor="rgb(var(--scene-tone-c))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-planet`} x1="0" y1="0" x2="0.85" y2="1">
            <stop stopColor="rgb(var(--sys-media-text))" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="rgb(var(--scene-tone-c))" />
            <stop offset="1" stopColor="rgb(var(--scene-tone-a))" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path d="M0 0h1200v700H0z" fill="rgb(var(--sys-media-bg))" />
        <path d="M0 0h1200v700H0z" fill={`url(#${id}-sky)`} />
        <ellipse cx="820" cy="265" rx="400" ry="310" fill={`url(#${id}-glow)`} />
        {scene === "cosmic" && stars.map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r={index % 3 === 0 ? 2 : 1} fill="rgb(var(--sys-media-text))" opacity={index % 3 === 0 ? 0.8 : 0.4} />
        ))}
        <circle cx="820" cy="240" r={scene === "dune" ? 122 : 100} fill={`url(#${id}-planet)`} />
        {scene === "cosmic" && (
          <g transform="rotate(-25 820 240)" fill="none" stroke="rgb(var(--sys-media-text))">
            <ellipse cx="820" cy="240" rx="190" ry="36" opacity="0.3" />
            <ellipse cx="820" cy="240" rx="220" ry="43" opacity="0.1" />
          </g>
        )}
        {scene === "alpine" && (
          <path d="M-50 180Q280 60 580 200T1250 140" fill="none" stroke="rgb(var(--scene-tone-b))" strokeWidth="48" opacity="0.15" />
        )}
      </svg>

      <svg className="scene-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" data-atropos-offset="-3">
        <defs>
          <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="rgb(var(--scene-tone-b))" stopOpacity="0.65" />
            <stop offset="1" stopColor="rgb(var(--scene-tone-a))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d={shape.far} fill={`url(#${id}-far)`} />
        <path d={shape.far} fill="none" stroke="rgb(var(--scene-tone-b))" strokeOpacity="0.25" />
      </svg>

      <svg className="scene-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" data-atropos-offset="2">
        <defs>
          <linearGradient id={`${id}-middle`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="rgb(var(--scene-tone-a))" stopOpacity="0.8" />
            <stop offset="1" stopColor="rgb(var(--sys-media-bg))" />
          </linearGradient>
        </defs>
        <path d={shape.middle} fill={`url(#${id}-middle)`} />
        <path d={shape.middle} fill="none" stroke="rgb(var(--scene-tone-c))" strokeOpacity="0.18" />
      </svg>

      <svg className="scene-layer" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" data-atropos-offset="6">
        <path d={shape.front} fill="rgb(var(--sys-media-bg))" />
        <path d={shape.front} fill="none" stroke="rgb(var(--scene-tone-b))" strokeOpacity="0.25" />
        {scene === "alpine" && [65, 130, 205, 960, 1040, 1135].map((x, index) => (
          <path key={x} d={`M${x - 22} 620l22 -${90 + index % 3 * 15} 22 ${90 + index % 3 * 15}z`} fill="rgb(var(--sys-media-bg))" />
        ))}
      </svg>
    </div>
  );
}
