import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    // Immediate scroll on mount (before any layout calculations)
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }

    useLayoutEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);

        // Backup scroll after render to fight browser restoration
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);

        return () => clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    return null;
};
