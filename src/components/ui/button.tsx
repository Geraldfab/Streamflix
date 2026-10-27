import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "glass", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:focus-visible:ring-rose-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 dark:bg-rose-600 dark:hover:bg-rose-500 dark:text-white dark:shadow-rose-600/30 font-semibold",
      secondary:
        "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 border border-zinc-200/80 dark:border-transparent dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 font-medium",
      glass:
        "glass-panel hover:bg-zinc-100/80 dark:hover:bg-white/10 text-zinc-900 dark:text-zinc-100 hover:border-red-500/30 dark:hover:border-rose-500/30",
      ghost:
        "bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20",
      outline:
        "border border-zinc-300 dark:border-zinc-700 hover:border-red-600 dark:hover:border-rose-500 text-zinc-800 dark:text-zinc-200",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
