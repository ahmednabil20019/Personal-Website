import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { cn } from "@/lib/utils";
import { X, ExternalLink, Layout, Award, Shield, Terminal, Cpu, Activity, Zap } from "lucide-react";
import { useModal } from "@/context/ModalContext";

interface SkillCardProps {
    skill: {
        _id: string;
        name: string;
        category: string;
        level: string;
        icon: string;
        projectIds?: Array<{ _id: string; title: string; category: string; images?: string[] }>;
        certIds?: Array<{ _id: string; title: string; issuer: string }>;
    };
    index: number;
    isMobile?: boolean;
}

// Tech jargon generator for "System Info"
const SYSTEM_OBSERVATIONS: Record<string, string[]> = {
    Frontend: [
        "DOM manipulation optimization active.",
        "Rendering engine status: OPTIMAL.",
        "Client-side state: SYNCHRONIZED.",
        "Pixel pipeline throughput: MAXIMUM."
    ],
    Backend: [
        "Server-side processes: EXECUTING.",
        "Database connection pool: STABLE.",
        "API latency: < 20ms.",
        "Security protocols: ENFORCED."
    ],
    Mobile: [
        "Touch event listeners: ATTACHED.",
        "Native bridge communication: ESTABLISHED.",
        "View hierarchy flattening: COMPLETE.",
        "Battery usage efficiency: HIGH."
    ],
    DevOps: [
        "CI/CD pipelines: AUTOMATED.",
        "Infrastructure as Code: COMPILED.",
        "Container orchestration: CLUSTER HEALTHY.",
        "Deployment strategy: BLUE/GREEN."
    ],
    Database: [
        "Query optimization index: BUILT.",
        "Data integrity checks: PASSED.",
        "Transaction isolation level: SERIALIZABLE.",
        "Replication lag: 0ms."
    ],
    Tools: [
        "Workflow automation: ENABLED.",
        "Development environment: CONFIGURED.",
        "Version control head: DETACHED.",
        "Utility scripts: EXECUTABLE."
    ],
    Other: [
        "Auxiliary system module loaded.",
        "Process ID allocated.",
        "Memory address space reserved.",
        "Thread priority: NORMAL."
    ]
};

const ROTATION_RANGE = 15; // Reduced for stiffer, mechanical feel
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export const SkillCard = ({ skill, index, isMobile = false }: SkillCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hover Preview State
    const [hoveredProjectImage, setHoveredProjectImage] = useState<string | null>(null);

    const { openProject, openCert } = useModal();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Motion - Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 400, damping: 20 }); // Stiffer spring for mechanical feel
    const ySpring = useSpring(y, { stiffness: 400, damping: 20 });
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || isOpen || isMobile) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE / rect.width - HALF_ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE / rect.height - HALF_ROTATION_RANGE;
        x.set(mouseY * -1);
        y.set(mouseX);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    // TERMINAL IMAGE COMPONENT (Nested for simplicity in this file, or move to ui/terminal-image.tsx)
    const TerminalImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
        const [error, setError] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoading(false);
            img.onerror = () => { setLoading(false); setError(true); };
        }, [src]);

        if (error || !src) {
            return (
                <div className={cn("w-full h-full bg-[#050505] flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group/err", className)}>
                    {/* Scanline BG */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000000_3px)] opacity-20" />
                    <div className="text-red-500 font-mono text-[10px] font-bold tracking-widest animate-pulse">
                        ERR::404
                    </div>
                    <div className="text-gray-600 font-mono text-[8px] mt-1">
                        ASSET_MISSING
                    </div>
                    {/* Glitch Overlay */}
                    <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover/err:translate-y-0 transition-transform duration-300" />
                </div>
            );
        }

        if (loading) {
            return (
                <div className={cn("w-full h-full bg-[#0a0a0a] flex items-center justify-center", className)}>
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            );
        }

        return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
    };

    // Render Icon Logic
    const renderIcon = () => {
        const isUrl = skill.icon.startsWith("http") || skill.icon.startsWith("/");
        if (isUrl) {
            return <TerminalImage src={skill.icon} alt={skill.name} className={cn("object-contain transition-all duration-100", isMobile ? "w-6 h-6" : "w-8 h-8", hovered ? "sepia-0" : "sepia grayscale opacity-70")} />
        }
        const isSimpleIcon = skill.icon.startsWith("Si");
        let IconComponent: any;
        if (isSimpleIcon) {
            IconComponent = (SimpleIcons as any)[skill.icon] || SimpleIcons.SiReact;
        } else {
            const source = (LucideIcons as any).icons || LucideIcons;
            IconComponent = (skill.icon !== "Icon" && source[skill.icon]) || source.Box;
        }
        if (!IconComponent) return <LucideIcons.Box className={cn("text-gray-500", isMobile ? "w-6 h-6" : "w-8 h-8")} />;

        return (
            <IconComponent
                size={isMobile ? 24 : 32}
                className={cn(
                    "transition-all duration-100",
                    hovered ? theme.text : "text-[#444] opacity-80"
                )}
            />
        );
    };

    const getCategoryTheme = (cat: string) => {
        // Terminal Colors: Cyan, Green, Amber, Red (No soft purples/blues unless electric)
        switch (cat) {
            case "Frontend": return { border: "group-hover:border-cyan-500", text: "text-cyan-500", bg: "bg-cyan-500/10", glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]" };
            case "Backend": return { border: "group-hover:border-green-500", text: "text-green-500", bg: "bg-green-500/10", glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]" };
            case "Tools": return { border: "group-hover:border-amber-500", text: "text-amber-500", bg: "bg-amber-500/10", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]" };
            case "Mobile": return { border: "group-hover:border-fuchsia-500", text: "text-fuchsia-500", bg: "bg-fuchsia-500/10", glow: "shadow-[0_0_20px_rgba(217,70,239,0.3)]" };
            case "DevOps": return { border: "group-hover:border-red-500", text: "text-red-500", bg: "bg-red-500/10", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]" };
            case "Data": return { border: "group-hover:border-blue-500", text: "text-blue-500", bg: "bg-blue-500/10", glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]" };
            default: return { border: "group-hover:border-zinc-400", text: "text-zinc-400", bg: "bg-zinc-500/10", glow: "shadow-[0_0_20px_rgba(161,161,170,0.3)]" };
        }
    };
    const theme = getCategoryTheme(skill.category);
    const masteryLevel = skill.level === "Expert" ? 95 : skill.level === "Advanced" ? 85 : skill.level === "Intermediate" ? 65 : 40;

    // Generate System Info
    const systemInfo = useMemo(() => {
        const obs = SYSTEM_OBSERVATIONS[skill.category] || SYSTEM_OBSERVATIONS.Other;
        // Deterministic hash for consistent text
        const hash = skill.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            obs: obs[hash % obs.length],
            mem: `0x${(hash * 1234).toString(16).substring(0, 4).toUpperCase()}`,
            pid: 1000 + index * 42
        };
    }, [skill.name, skill.category, index]);

    return (
        <>
            <motion.div
                ref={ref}
                onClick={() => setIsOpen(true)}
                custom={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ transformStyle: "preserve-3d", transform: isMobile ? 'none' : transform }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setHovered(true)}
                className={cn("relative w-full cursor-pointer z-0 group", isMobile ? "min-h-[90px]" : "h-[120px]")}
            >
                <div
                    className={cn(
                        "relative h-full w-full overflow-hidden bg-[#0a0a0a] transition-all duration-100 flex items-center gap-3",
                        isMobile ? "p-3" : "p-4",
                        "border border-white/10 hover:bg-[#0f0f0f]",
                        theme.border,
                        hovered && theme.glow
                    )}
                >
                    {/* Scanlines Overlay (Subtle) */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                    {/* Active Corner Markers */}
                    <div className={cn("absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-100", hovered ? theme.text.replace("text-", "border-") : "border-white/10")} />
                    <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-100", hovered ? theme.text.replace("text-", "border-") : "border-white/10")} />

                    {/* Icon Container */}
                    <div className={cn(
                        "relative shrink-0 flex items-center justify-center bg-[#050505] border border-white/10 z-20 transition-colors duration-100",
                        isMobile ? "w-10 h-10" : "w-14 h-14",
                        hovered && theme.border
                    )}>
                        {renderIcon()}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1 z-20">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                                <h3 className={cn(
                                    "font-mono font-bold tracking-tight uppercase",
                                    isMobile ? "text-[11px] line-clamp-2 leading-tight" : "text-sm",
                                    hovered ? "text-white" : "text-gray-400"
                                )}>
                                    {hovered ? `>_ ${skill.name}` : skill.name}
                                    <span className={cn("inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle", hovered ? theme.text : "hidden")} />
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className={cn("text-[9px] font-mono", theme.text)}>
                                        MEM::{systemInfo.mem}
                                    </span>
                                    <span className="text-[9px] font-mono text-gray-600">
                                        PID::{systemInfo.pid}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ASCII-style Progress Bar */}
                        <div className="mt-auto">
                            <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-0.5 uppercase tracking-wider">
                                <span>Sys.Load</span>
                                <span>{masteryLevel}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#111] border border-white/10 flex items-center px-0.5">
                                <div
                                    className={cn("h-0.5 transition-all duration-300", theme.bg.replace("/10", ""))}
                                    style={{ width: `${masteryLevel}%`, backgroundColor: "currentColor" }}
                                >
                                    {/* Fake block segments could go here if we used a flex container instead */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Terminal Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 60, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                    "relative w-full sm:max-w-2xl bg-[#0a0a0a] border border-white/20 shadow-2xl overflow-hidden flex flex-col",
                                    "max-h-[92dvh]",
                                    "shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                                )}
                            >
                                <div className="h-9 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-3 sm:px-4 select-none shrink-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex gap-1.5 shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <span className="font-mono text-[10px] text-gray-500 ml-1 truncate min-w-0">
                                            usr/bin/{skill.name.toLowerCase().slice(0, 20)}{skill.name.length > 20 ? '…' : ''} --v
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="relative flex-1 overflow-y-auto scrollbar-hide font-mono text-sm text-gray-300 p-0">

                                    {/* HOVER PREVIEW BACKGROUND */}
                                    <AnimatePresence>
                                        {hoveredProjectImage && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.2 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-0 pointer-events-none"
                                            >
                                                <TerminalImage src={hoveredProjectImage} alt="preview" className="w-full h-full object-cover grayscale" />
                                                <div className="absolute inset-0 bg-[#0a0a0a]/90" />
                                                {/* Scanlines on image */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative z-10 p-4 sm:p-6 space-y-5 sm:space-y-8">
                                        {/* Skill Header Block */}
                                        <div className="flex gap-3 sm:gap-6 items-start border-b border-white/10 pb-4 sm:pb-6">
                                            <div className={cn("w-14 h-14 sm:w-24 sm:h-24 shrink-0 bg-black border flex items-center justify-center relative", theme.border)}>
                                                <div className="absolute inset-0 bg-grid-white/[0.05]" />
                                                {renderIcon()}
                                                <div className="absolute top-0 left-0 w-1 h-1 bg-white" />
                                                <div className="absolute top-0 right-0 w-1 h-1 bg-white" />
                                                <div className="absolute bottom-0 left-0 w-1 h-1 bg-white" />
                                                <div className="absolute bottom-0 right-0 w-1 h-1 bg-white" />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-start gap-2 flex-wrap">
                                                    <h1 className="text-base sm:text-3xl font-bold text-white tracking-tighter uppercase leading-tight">
                                                        {skill.name}
                                                    </h1>
                                                    <span className={cn("shrink-0 px-2 py-0.5 text-[10px] border self-start mt-0.5", theme.text.replace("text-", "border-"), theme.text)}>
                                                        V.{String(skill.level === "Expert" ? "5.0" : skill.level === "Advanced" ? "3.2" : "1.0")}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs mt-1 sm:mt-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-600 uppercase text-[10px]">Category</span>
                                                        <span className={theme.text}>{skill.category}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-600 uppercase text-[10px]">Mastery</span>
                                                        <span className="text-white text-[11px]">
                                                            [{Array(10).fill(0).map((_, i) => (
                                                                <span key={i} className={i < (masteryLevel / 10) ? theme.text : "text-[#222]"}>|</span>
                                                            ))}] {masteryLevel}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-white/5 border-l-2 border-white/20 text-xs italic text-gray-400">
                                                    <span className="not-italic text-gray-500 mr-2">$ system_check:</span>
                                                    "{systemInfo.obs}"
                                                </div>
                                            </div>
                                        </div>

                                        {/* Linked Projects Section */}
                                        {(skill.projectIds?.length || 0) > 0 ? (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4 text-cyan-500">
                                                    <Terminal size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Executed Instances</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {skill.projectIds?.map(project => (
                                                        <div
                                                            key={project._id}
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                openProject(project._id);
                                                            }}
                                                            onMouseEnter={() => setHoveredProjectImage(project.images?.[0] || null)}
                                                            onMouseLeave={() => setHoveredProjectImage(null)}
                                                            className="group/p relative p-3 bg-black border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all overflow-hidden"
                                                        >
                                                            <div className="flex items-center gap-3 relative z-10">
                                                                <div className="w-1.5 h-1.5 bg-cyan-500 group-hover/p:animate-pulse" />
                                                                <span className="text-xs text-gray-300 group-hover/p:text-cyan-400 truncate font-mono">
                                                                    {project.title}
                                                                </span>
                                                                <ExternalLink size={10} className="ml-auto opacity-0 group-hover/p:opacity-100 text-cyan-500" />
                                                            </div>
                                                            {/* BG Reveal */}
                                                            <div className="absolute inset-0 bg-cyan-500/5 translate-x-[-100%] group-hover/p:translate-x-0 transition-transform duration-300" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            // Fallback Info if no projects (SYSTEM LOGS)
                                            <div className="space-y-3 opacity-60">
                                                <div className="flex items-center gap-2 mb-2 text-gray-500">
                                                    <Activity size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">System Activity Log</span>
                                                </div>
                                                <div className="font-mono text-[10px] text-gray-500 space-y-1 p-3 border border-dashed border-gray-800 rounded">
                                                    <p>[{new Date().toISOString()}] MODULE_LOADED: {skill.name}</p>
                                                    <p>[{new Date().toISOString()}] MEMORY_ALLOC: {systemInfo.mem}</p>
                                                    <p>[{new Date().toISOString()}] THREAD_STATUS: SLEEPING (No active projects)</p>
                                                    <p><span className="text-yellow-600">WARN:</span> Standby mode engaged.</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Certifications Section */}
                                        {(skill.certIds?.length || 0) > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4 text-purple-500">
                                                    <Shield size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Secured Credentials</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {skill.certIds?.map(cert => (
                                                        <div
                                                            key={cert._id}
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                openCert(cert._id);
                                                            }}
                                                            className="group/c relative p-3 bg-black border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Award size={12} className="text-purple-500" />
                                                                <span className="text-xs text-gray-300 group-hover/c:text-purple-400 truncate font-mono">
                                                                    {cert.title}
                                                                </span>
                                                                <ExternalLink size={10} className="ml-auto opacity-0 group-hover/c:opacity-100 text-purple-500" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Footer */}
                                <div className="h-6 bg-[#0f0f0f] border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-600">
                                    <span>STATUS: ONLINE</span>
                                    <span>UID: {skill._id.substring(0, 8)}</span>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};
