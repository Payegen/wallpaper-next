"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// 这里我们透传 next-themes 的所有属性
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}