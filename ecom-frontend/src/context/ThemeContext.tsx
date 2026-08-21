"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_URL, STORE_SLUG } from "@/lib/api";
import { ThemePreset } from "@/types";

type ThemeContextValue = {
  theme: ThemePreset;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const defaultTheme: ThemePreset = {
  id: "modern-blue",
  name: "Modern Blue",
  primary: "#111827",
  secondary: "#047857",
  accent: "#F97316",
  background: "#F7F7F2",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
};

function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-background", theme.background);
  root.style.setProperty("--color-surface", theme.surface);
  root.style.setProperty("--color-text", theme.text);
  root.style.setProperty("--color-muted", theme.muted);
  root.style.setProperty("--color-border", theme.border);
}

export function StoreThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/public/stores/${STORE_SLUG}/theme`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const data = json?.data;
        if (!mounted || !data) return;
        setTheme({
          id: data.id ?? data.themeName,
          name: data.themeName,
          primary: data.primaryColor,
          secondary: data.secondaryColor,
          accent: data.accentColor,
          background: data.backgroundColor,
          surface: data.surfaceColor,
          text: data.textColor,
          muted: data.mutedColor,
          border: data.borderColor,
        });
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export function useStoreTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useStoreTheme must be used within StoreThemeProvider");
  }
  return context;
}
