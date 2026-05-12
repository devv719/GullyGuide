"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props} forcedTheme="light" defaultTheme="light">
      {children}
    </NextThemesProvider>
  );
}
