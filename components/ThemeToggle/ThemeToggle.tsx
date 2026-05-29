"use client";

import { useEffect, useState } from "react";
import { MinusIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<Theme, string> = {
  light: "Light theme — click for dark",
  dark: "Dark theme — click for system",
  system: "System theme — click for light",
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (mounted ? (theme as Theme | undefined) : undefined) ?? "system";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={LABEL[current]}
      title={LABEL[current]}
      onClick={() => setTheme(NEXT[current])}
    >
      {current === "light" && <SunIcon />}
      {current === "dark" && <MoonIcon />}
      {current === "system" && <MinusIcon />}
    </Button>
  );
}
