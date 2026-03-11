import { useRef, useEffect, useState, useMemo } from "react";
import { SkillCard } from "./SkillCard";
import { cn } from "@/lib/utils";

interface Skill {
    _id: string;
    name: string;
    category: string;
    level: string;
    icon: string;
}

interface SkillRailProps {
    category: string;
    skills: Skill[];
    isMobile?: boolean;
}

// Per-category accent color tokens
const CATEGORY_COLORS: Record<string, { bar: string; text: string; glow: string; packet: string }> = {
    Frontend: { bar: "bg-cyan-500", text: "text-cyan-500", glow: "shadow-[0_0_6px_rgba(6,182,212,0.8)]", packet: "bg-cyan-400" },
    Backend: { bar: "bg-green-500", text: "text-green-500", glow: "shadow-[0_0_6px_rgba(34,197,94,0.8)]", packet: "bg-green-400" },
    Tools: { bar: "bg-amber-500", text: "text-amber-500", glow: "shadow-[0_0_6px_rgba(245,158,11,0.8)]", packet: "bg-amber-400" },
    Mobile: { bar: "bg-fuchsia-500", text: "text-fuchsia-500", glow: "shadow-[0_0_6px_rgba(217,70,239,0.8)]", packet: "bg-fuchsia-400" },
    DevOps: { bar: "bg-red-500", text: "text-red-500", glow: "shadow-[0_0_6px_rgba(239,68,68,0.8)]", packet: "bg-red-400" },
    Database: { bar: "bg-blue-500", text: "text-blue-500", glow: "shadow-[0_0_6px_rgba(59,130,246,0.8)]", packet: "bg-blue-400" },
    Design: { bar: "bg-rose-500", text: "text-rose-500", glow: "shadow-[0_0_6px_rgba(244,63,94,0.8)]", packet: "bg-rose-400" },
};
const DEFAULT_COLOR = { bar: "bg-zinc-500", text: "text-zinc-400", glow: "shadow-[0_0_6px_rgba(161,161,170,0.6)]", packet: "bg-zinc-400" };

// Total segments in the progress track
const SEGMENTS = 20;

export const SkillRail = ({ category, skills, isMobile = false }: SkillRailProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0); // 0–100

    const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

    // 1. Ensure we have enough items for a loop
    let baseList = [...skills];
    const minItems = isMobile ? 4 : 10;
    while (baseList.length < minItems) {
        baseList = [...baseList, ...skills];
    }
    const displaySkills = [...baseList, ...baseList, ...baseList, ...baseList];

    // 2. Auto-scroll + progress tracking
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let animationFrameId: number;

        const scroll = () => {
            if (!isPaused) {
                if (el.scrollLeft >= el.scrollWidth / 2) {
                    el.scrollLeft = el.scrollWidth / 4;
                } else {
                    el.scrollLeft += 0.5;
                }
            }

            // Track scroll progress within the visible "loop window" (first half)
            const maxScroll = el.scrollWidth / 2;
            const pct = Math.min(100, Math.round((el.scrollLeft / maxScroll) * 100));
            setScrollProgress(pct);

            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    // 3. Calculate how many segments to fill
    const filledSegments = Math.round((scrollProgress / 100) * SEGMENTS);

    // 4. Packet positions — 3 animated dots that race across the bar
    // We derive them from scrollProgress so they "move" in sync
    const packets = useMemo(() => [0, 33, 66], []); // offsets in %

    return (
        <div className="w-full relative overflow-hidden group border-y border-white/5 bg-[#050505]">
            {/* TERMINAL BACKGROUND GRID */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* FADE EDGES */}
            <div
                className={cn("absolute left-0 top-0 bottom-0 z-10 border-r border-white/10", isMobile ? "w-6" : "w-12")}
                style={{ background: isMobile ? "linear-gradient(to right, #0c0c0c, transparent)" : "#0c0c0c" }}
            />
            <div
                className={cn("absolute right-0 top-0 bottom-0 z-10 border-l border-white/10", isMobile ? "w-6" : "w-12")}
                style={{ background: isMobile ? "linear-gradient(to left, #0c0c0c, transparent)" : "#0c0c0c" }}
            />

            {/* SCANLINE */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000000_3px)] opacity-20 pointer-events-none z-10" />

            {/* THE RAIL TRACK */}
            <div
                ref={scrollRef}
                className={cn(
                    "flex overflow-x-auto scrollbar-hide relative z-20",
                    isMobile ? "py-4 gap-3" : "py-8 gap-6"
                )}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}
            >
                <div className="flex gap-3 md:gap-6 px-4 min-w-max">
                    {displaySkills.map((skill, index) => (
                        <div
                            key={`${skill._id}-${index}`}
                            className={cn("flex-shrink-0 snap-center", isMobile ? "w-[200px]" : "w-[240px]")}
                        >
                            <SkillCard skill={skill} index={index} isMobile={isMobile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                HUD DATA-TRANSFER PROGRESS BAR
                ─ segment track  ─ moving packets  ─ live readout
            ═══════════════════════════════════════════════════════════ */}
            <div className={cn(
                "relative flex items-center gap-2 px-3 border-t border-white/5 transition-opacity duration-300",
                isMobile ? "h-6" : "h-7",
                isPaused ? "opacity-50" : "opacity-100"
            )}>

                {/* Left label */}
                <span className={cn("font-mono shrink-0 select-none", colors.text, isMobile ? "text-[7px]" : "text-[9px]")}>
                    {isPaused ? "⏸ HOLD" : "▶ TX"}
                </span>

                {/* Segment track */}
                <div className="relative flex-1 flex items-center gap-px h-full py-[5px]">
                    {/* Segments */}
                    <div className="flex gap-px w-full">
                        {Array.from({ length: SEGMENTS }).map((_, i) => {
                            const filled = i < filledSegments;
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex-1 rounded-sm transition-all duration-75",
                                        isMobile ? "h-[3px]" : "h-[4px]",
                                        filled
                                            ? cn(colors.bar, "opacity-90")
                                            : "bg-white/8 opacity-30"
                                    )}
                                />
                            );
                        })}
                    </div>

                    {/* Animated packets — 3 glowing dots racing across the track */}
                    {!isPaused && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden py-[5px]">
                            {packets.map((offset, i) => {
                                // Position = (scrollProgress + offset) % 100
                                const pos = ((scrollProgress + offset) % 100);
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute rounded-full",
                                            colors.packet,
                                            colors.glow,
                                            isMobile ? "w-1 h-[3px]" : "w-1.5 h-[4px]"
                                        )}
                                        style={{
                                            left: `${pos}%`,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            opacity: 1 - i * 0.25,
                                            transition: "left 0.05s linear",
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right readout */}
                <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className={cn(colors.text, isMobile ? "text-[7px]" : "text-[9px]")}>
                        {scrollProgress.toString().padStart(3, "0")}%
                    </span>
                    <span className={cn("text-white/20", isMobile ? "text-[7px]" : "text-[8px]")}>
                        {isPaused ? "IDLE" : "SYS"}
                    </span>
                </div>
            </div>
        </div>
    );
};
