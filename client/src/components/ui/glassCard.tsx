"use client";

import { cn } from "@/lib/utils"; // optional helper (see below)
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        `
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-lg
        transition-all duration-300
        hover:bg-white/10
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
