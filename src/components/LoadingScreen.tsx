import { motion } from "framer-motion";

interface LoadingScreenProps {
    fullScreen?: boolean;
}

/**
 * Premium loading screen with morphing geometric shapes and elegant typography.
 * Minimalist yet striking design that feels premium and modern.
 */
export const LoadingScreen = ({ fullScreen = true }: LoadingScreenProps) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={`
        ${fullScreen ? "fixed inset-0 z-[9999]" : "absolute inset-0"}
        flex items-center justify-center
        bg-background
      `}
        >
            {/* Subtle radial gradient backdrop */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
            </div>

            {/* Minimalist geometric loader */}
            <div className="relative flex flex-col items-center gap-12">
                {/* Main loader container */}
                <div className="relative w-28 h-28">
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `conic-gradient(from 0deg, transparent, hsl(var(--primary)), hsl(var(--accent)), transparent)`,
                            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
                            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Inner pulsing ring */}
                    <motion.div
                        className="absolute inset-4 rounded-full border border-primary/30"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Center logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent p-[1.5px]"
                            animate={{
                                boxShadow: [
                                    "0 0 20px hsl(var(--primary) / 0.3)",
                                    "0 0 40px hsl(var(--primary) / 0.5)",
                                    "0 0 20px hsl(var(--primary) / 0.3)",
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                <motion.span
                                    className="text-2xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    M
                                </motion.span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Elegant loading indicator */}
                <div className="flex flex-col items-center gap-4">
                    {/* Animated progress dots */}
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                                animate={{
                                    opacity: [0.2, 1, 0.2],
                                    scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Corner accents for premium feel */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
        </motion.div>
    );
};

export default LoadingScreen;
