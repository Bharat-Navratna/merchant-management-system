"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function LocalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppProviders");
  }
  return context;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <LocalThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LocalThemeProvider>
  );
}
