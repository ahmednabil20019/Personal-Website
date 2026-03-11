import { Variants } from "framer-motion";

export const tokens = {
    colors: {
        void: "#050510", // Deep black/blue background
        obsidian: "rgba(5, 5, 16, 0.8)", // Panel background
        glassBorder: "rgba(255, 255, 255, 0.08)",
        primaryGlow: "rgba(56, 189, 248, 0.3)", // Cyan glow
        secondaryGlow: "rgba(168, 85, 247, 0.3)", // Purple glow
        text: {
            primary: "#ffffff",
            secondary: "#94a3b8",
            accent: "#38bdf8", // Cyan-400
        }
    },
    shadows: {
        neon: "0 0 20px rgba(56, 189, 248, 0.15), 0 0 5px rgba(56, 189, 248, 0.5)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    },
    backdrop: {
        blur: "blur(16px)",
    }
};

export const motionVariants = {
    container: {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    },
    item: {
        hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
        show: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                stiffness: 50,
                damping: 20
            }
        }
    },
    hoverScale: {
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    },
    tapScale: {
        scale: 0.98
    },
    glitch: {
        initial: { x: 0 },
        hover: {
            x: [-2, 2, -2, 0],
            transition: { repeat: Infinity, duration: 0.2, repeatType: "mirror" as const }
        }
    }
};
