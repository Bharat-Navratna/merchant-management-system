"use client";

import { Toaster as Sonner } from "sonner";
import { useAppTheme } from "@/components/providers/app-providers";

export function Toaster() {
  const { theme } = useAppTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
    />
  );
}
