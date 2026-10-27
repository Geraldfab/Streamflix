import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "glass" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50",
    accent: "bg-red-50 dark:bg-rose-500/20 text-red-700 dark:text-rose-300 border border-red-200 dark:border-rose-500/30",
    success: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
    warning: "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
    glass: "glass-panel text-zinc-800 dark:text-zinc-300",
    outline: "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md",
    md: "px-2.5 py-1 text-xs font-medium rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
