import { Home, Layers, Star, Briefcase, Settings, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { icon: Home, label: "Home", path: "/admin/dashboard" },
    { icon: User, label: "Hero", path: "/admin/hero" },
    { icon: Star, label: "Skills", path: "/admin/skills" },
    { icon: Layers, label: "Projects", path: "/admin/projects" },
    { icon: Briefcase, label: "Journey", path: "/admin/journey" },
];

interface GlassDockProps {
    onMenuClick?: () => void;
}

export const GlassDock = ({ onMenuClick }: GlassDockProps) => {
    const location = useLocation();

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md md:hidden">
            <div className="bg-[#050510]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex justify-between items-center bg-gradient-to-r from-black/80 to-purple-900/20">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center p-3 w-full"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-active"
                                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className={cn("relative z-10 transition-all duration-300", isActive ? "text-cyan-400 scale-110" : "text-gray-400 hover:text-white")}>
                                <Icon size={20} />
                            </div>
                        </Link>
                    )
                })}

                {/* Menu Trigger */}
                <button
                    onClick={onMenuClick}
                    className="relative flex flex-col items-center justify-center p-3 w-full text-gray-400 hover:text-white transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>
        </div>
    );
};
