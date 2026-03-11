import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const { currentTheme } = useTheme();
    const rafId = useRef<number>(0);
    const latestPos = useRef({ x: 0, y: 0 });

    // Skip on touch/mobile devices
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        // Throttle via rAF — batch mouse moves into one setState per frame
        const updateMousePosition = (e: MouseEvent) => {
            latestPos.current = { x: e.clientX, y: e.clientY };
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(() => {
                    setMousePosition(latestPos.current);
                    rafId.current = 0;
                });
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isMobile]);

    // Don't render on mobile at all
    if (isMobile) return null;

    return (
        <>
            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-screen"
                style={{
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 15px ${currentTheme.primary}80`,
                }}
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                }}
            />
            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen"
                style={{
                    borderColor: currentTheme.secondary,
                    borderWidth: '2px',
                    boxShadow: `0 0 20px ${currentTheme.secondary}60, inset 0 0 10px ${currentTheme.secondary}40`,
                }}
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                }}
            />
        </>
    );
};
