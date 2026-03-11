import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
    hoverEffect?: boolean;
}

export const GlassPanel = ({
    children,
    className,
    intensity = "medium",
    hoverEffect = false,
    ...props
}: GlassPanelProps) => {

    const bgOpacity = {
        low: "bg-black/20",
        medium: "bg-white/5",
        high: "bg-white/10"
    };

    return (
        <motion.div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl",
                bgOpacity[intensity],
                hoverEffect && "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.2)] transition-all duration-300 group",
                className
            )}
            {...props}
        >
            {/* Noise texture overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Gradient Glow Effect on Hover (if enabled) */}
            {hoverEffect && (
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            )}

            {/* Content Buffer */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};
