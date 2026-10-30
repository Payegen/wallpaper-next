"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { transitionTheme } from "@/lib/theme-transition";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ModeToggle() {
  const { setTheme, resolvedTheme, forcedTheme } = useTheme();
  // 服务端与首次水合保持一致，不通过 effect 触发额外的状态更新。
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const label = mounted ? `切换到${nextTheme === "dark" ? "深" : "浅"}色模式` : "切换主题";

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={!mounted || Boolean(forcedTheme)}
      onClick={(event) => {
        void transitionTheme(() => setTheme(nextTheme), event.currentTarget);
      }}
      className="group relative bg-sys-bg-page/50 backdrop-blur-md hover:bg-sys-bg-elevated [&_svg]:size-5"
      aria-label={label}
      title={label}
    >
      <Sun aria-hidden="true" className="rotate-0 scale-100 text-sys-text-warning transition-transform duration-300 motion-reduce:transition-none dark:-rotate-90 dark:scale-0" />
      <Moon aria-hidden="true" className="absolute rotate-90 scale-0 text-sys-info transition-transform duration-300 motion-reduce:transition-none dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
