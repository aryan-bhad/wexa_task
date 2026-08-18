import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs font-semibold",
      accent: "bg-blue-600 text-white hover:bg-blue-700 shadow-xs font-semibold",
      secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs",
      outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs",
      ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-xs font-semibold",
    };

    const sizes = {
      sm: "px-2.5 py-1.5 text-xs gap-1.5",
      md: "px-3.5 py-2 text-xs font-semibold gap-2",
      lg: "px-4.5 py-2.5 text-sm font-semibold gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

