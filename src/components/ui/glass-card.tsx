import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverGlow?: boolean;
}

export function GlassCard({
  className,
  elevated = false,
  hoverGlow = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        elevated ? "glass-panel-elevated" : "glass-panel",
        hoverGlow && "card-hover-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
