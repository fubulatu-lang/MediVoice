import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "light", padding = "md", children, ...props }, ref) => {
    const paddingMap = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/20 shadow-2xl transition-all hover:shadow-3xl",
          variant === "light" ? "bg-white/10 backdrop-blur-xl" : "bg-black/20 backdrop-blur-xl",
          paddingMap[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
export { GlassCard };
