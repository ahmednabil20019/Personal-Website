import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading,
    icon,
    disabled,
    ...props
}, ref) => {

    const variants = {
        primary: "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
        secondary: "bg-purple-500/10 text-purple-400 border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        danger: "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
        ghost: "bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-6 py-3 text-sm rounded-xl",
        lg: "px-8 py-4 text-base rounded-xl",
        icon: "p-2 rounded-lg"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={cn(
                "relative flex items-center justify-center gap-2 font-medium border transition-colors duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : icon ? (
                <span className="mr-1">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
});

NeonButton.displayName = "NeonButton";
