import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

import { cn } from "../lib/utils";

// Note: We didn't install class-variance-authority, let's stick to simple props or install it.
// To avoid extra dependencies not approved, I will implement a simpler variant logic without cva for now,
// or I can just install cva. CVA is very standard.
// Actually, I didn't ask for CVA in the plan. I'll stick to manual class logic or just basic templates.
// Let's use flexible string interpolation which is easier without CVA.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, asChild = false, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 border border-blue-500/20",
            secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-white/10",
            ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
            destructive: "bg-red-600 text-white hover:bg-red-500 border border-red-500/20",
            outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100"
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
            icon: "h-10 w-10 p-2 flex items-center justify-center"
        };

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
