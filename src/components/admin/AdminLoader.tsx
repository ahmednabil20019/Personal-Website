import { motion } from "framer-motion";

export const AdminLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full bg-[#030014]/50 backdrop-blur-sm rounded-xl border border-white/5 space-y-6">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-500/30"
                />

                {/* Inner rotating ring (reverse) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-yellow-500 border-r-transparent border-b-purple-500 border-l-transparent opacity-80"
                />

                {/* Center pulsing dot */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
            </div>

            <div className="flex flex-col items-center space-y-2">
                <motion.h3
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-lg font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 uppercase"
                >
                    Loading Data
                </motion.h3>
                <div className="flex gap-1 h-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scaleY: [1, 2, 1], backgroundColor: ["#22d3ee", "#a855f7", "#22d3ee"] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-full rounded-full bg-cyan-500"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
