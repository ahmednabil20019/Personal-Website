import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { motion, PanInfo } from "framer-motion";
import { GlassDock } from "@/components/ui/glass-dock";
import { useState, useRef, useEffect } from "react";

export const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Simple swipe detection
    const touchStart = useRef<number>(0);
    const touchEnd = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isRightSwipe && !isSidebarOpen && touchStart.current < 50) {
            // Swipe right from edge -> Open (only if started near edge to avoid conflicts)
            setIsSidebarOpen(true);
        }

        if (isLeftSwipe && isSidebarOpen) {
            // Swipe left -> Close
            setIsSidebarOpen(false);
        }

        // Reset
        touchStart.current = 0;
        touchEnd.current = 0;
    };

    return (
        <div
            className="flex min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 selection:text-white overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >

            {/* --- THE VOID BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Deep Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/20 blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 100, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[40%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/10 blur-[120px]"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

            {/* Glass Dock Navigation (Mobile) */}
            <GlassDock onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 pl-0 lg:pl-64 transition-all duration-300">
                <AdminHeader />

                <main className="flex-1 p-6 lg:p-10 overflow-x-hidden overflow-y-auto mb-20 lg:mb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
