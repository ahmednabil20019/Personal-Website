import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollManager } from "./ScrollManager";
import { CustomCursor } from "./CustomCursor";
import { GlobalBackground3D } from "./3d/GlobalBackground3D";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useSectionDetection } from "@/hooks/useSectionDetection";

interface LayoutWrapperProps {
    children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    useSectionDetection();
    
    return (
        <>
            <ScrollManager />
            <CustomCursor />
            <GlobalBackground3D />
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
            <Toaster />
            <Sonner />
        </>
    );
};
