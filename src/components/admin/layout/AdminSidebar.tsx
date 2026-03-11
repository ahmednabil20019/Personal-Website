import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Zap,
    Briefcase,
    Map,
    Settings,
    Menu,
    X,
    User,
    Layers,
    LogOut,
    Award,
    Monitor,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Monitor, label: "Hero Section", path: "/admin/hero" },
    { icon: User, label: "About Me", path: "/admin/about" },
    { icon: Zap, label: "Skills", path: "/admin/skills" },
    { icon: Briefcase, label: "Projects", path: "/admin/projects" },
    { icon: Map, label: "Journey", path: "/admin/journey" },
    { icon: Layers, label: "Services", path: "/admin/services" },
    { icon: Award, label: "Certificates", path: "/admin/certifications" },
    { icon: Mail, label: "Messages", path: "/admin/messages" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const AdminSidebar = ({ isOpen: propIsOpen, onOpenChange }: AdminSidebarProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(true);
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    const isControlled = propIsOpen !== undefined;
    const isOpen = isControlled ? propIsOpen : internalIsOpen;
    const setIsOpen = isControlled ? onOpenChange : setInternalIsOpen;

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!isControlled) {
                if (mobile) setInternalIsOpen(false);
                else setInternalIsOpen(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [isControlled]);

    return (
        <>
            {/* Mobile Toggle Button - Only show if NOT controlled (fallback) */}
            {isMobile && !isControlled && (
                <button
                    onClick={() => setIsOpen?.(!isOpen)}
                    className="fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-white"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Sidebar Container */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "fixed top-0 left-0 h-full z-40 bg-[#050510]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300",
                    "w-64"
                )}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Logo Area */}
                    <div className="mb-10 flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            <span className="font-bold text-white">V</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Void Admin
                        </h1>
                        {isMobile && (
                            <button onClick={() => setIsOpen?.(false)} className="ml-auto text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => isMobile && setIsOpen?.(false)}
                                >
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {/* Active Background Glow */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}

                                        <item.icon
                                            size={20}
                                            className={cn(
                                                "relative z-10 transition-colors",
                                                isActive ? "text-cyan-400" : "group-hover:text-cyan-400"
                                            )}
                                        />
                                        <span className="relative z-10 font-medium">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Backdrop for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen?.(false)}
                />
            )}
        </>
    );
};

