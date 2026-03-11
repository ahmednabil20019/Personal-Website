import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import { cn } from "@/lib/utils";

// --- Interfaces ---

export interface SkillItem {
    id: string;
    name: string;
    icon: string;
    level: string;
}

export interface SkillCategory {
    title: string;
    gradient: string;
    skills: SkillItem[];
}

// --- Icon Renderer ---
const RenderSkillIcon = ({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) => {
    if (!iconName) return <LucideIcons.Code className={className} style={style} />;

    if (iconName.startsWith("http") || iconName.startsWith("/")) {
        return <img src={iconName} className={cn("object-contain", className)} style={style} alt="icon" />;
    }

    const isSimple = iconName.startsWith("Si");
    // @ts-ignore
    const IconLib = isSimple ? SimpleIcons : LucideIcons;
    // @ts-ignore
    const IconComp = IconLib[iconName] || LucideIcons.Code;
    return <IconComp className={className} style={style} />;
};

// --- Skill Card ---
interface SkillCardProps {
    skill: SkillItem;
    delay: number;
    isVisible: boolean;
    index: number;
    totalCount: number;
    onClick: () => void;
    isSelected: boolean;
    accentColor: string;
}

const SkillCard = forwardRef<HTMLDivElement, SkillCardProps>(
    ({ skill, delay, isVisible, index, totalCount, onClick, isSelected, accentColor }, ref) => {
        const middleIndex = (totalCount - 1) / 2;
        const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;

        const rotation = factor * 25;
        const translationX = factor * 85;
        const translationY = Math.abs(factor) * 12;

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute w-20 h-28 cursor-pointer group/card",
                    isSelected && "opacity-0"
                )}
                style={{
                    transform: isVisible
                        ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
                        : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
                    opacity: isSelected ? 0 : isVisible ? 1 : 0,
                    transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                    zIndex: 10 + index,
                    left: "-40px",
                    top: "-56px",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                <div
                    className={cn(
                        "w-full h-full rounded-lg overflow-hidden shadow-xl border border-white/10 relative",
                        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:scale-125"
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}20 0%, rgba(0,0,0,0.8) 100%)`,
                    }}
                >
                    <div className="w-full h-3/5 flex items-center justify-center" style={{ color: accentColor }}>
                        <RenderSkillIcon iconName={skill.icon} className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">
                        {skill.name}
                    </p>
                </div>
            </div>
        );
    }
);
SkillCard.displayName = "SkillCard";

// --- Skill Lightbox ---
interface SkillLightboxProps {
    skills: SkillItem[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    sourceRect: DOMRect | null;
    onCloseComplete?: () => void;
    onNavigate: (index: number) => void;
    accentColor: string;
    categoryTitle: string;
}

const SkillLightbox: React.FC<SkillLightboxProps> = ({
    skills,
    currentIndex,
    isOpen,
    onClose,
    sourceRect,
    onCloseComplete,
    onNavigate,
    accentColor,
    categoryTitle,
}) => {
    const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [internalIndex, setInternalIndex] = useState(currentIndex);
    const [isSliding, setIsSliding] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalSkills = skills.length;
    const hasNext = internalIndex < totalSkills - 1;
    const hasPrev = internalIndex > 0;
    const currentSkill = skills[internalIndex];

    useEffect(() => {
        if (isOpen && currentIndex !== internalIndex && !isSliding) {
            setIsSliding(true);
            const timer = setTimeout(() => {
                setInternalIndex(currentIndex);
                setIsSliding(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isOpen, internalIndex, isSliding]);

    useEffect(() => {
        if (isOpen) {
            setInternalIndex(currentIndex);
            setIsSliding(false);
        }
    }, [isOpen, currentIndex]);

    const navigateNext = useCallback(() => {
        if (internalIndex >= totalSkills - 1 || isSliding) return;
        onNavigate(internalIndex + 1);
    }, [internalIndex, totalSkills, isSliding, onNavigate]);

    const navigatePrev = useCallback(() => {
        if (internalIndex <= 0 || isSliding) return;
        onNavigate(internalIndex - 1);
    }, [internalIndex, isSliding, onNavigate]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        onClose();
        setTimeout(() => {
            setIsClosing(false);
            setShouldRender(false);
            setAnimationPhase("initial");
            onCloseComplete?.();
        }, 500);
    }, [onClose, onCloseComplete]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowRight") navigateNext();
            if (e.key === "ArrowLeft") navigatePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        if (isOpen) document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleClose, navigateNext, navigatePrev]);

    useLayoutEffect(() => {
        if (isOpen && sourceRect) {
            setShouldRender(true);
            setAnimationPhase("initial");
            setIsClosing(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationPhase("animating");
                });
            });
            const timer = setTimeout(() => {
                setAnimationPhase("complete");
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen, sourceRect]);

    if (!shouldRender || !currentSkill) return null;

    const levelColors: Record<string, { gradient: string; progress: number }> = {
        Expert: { gradient: "from-green-400 to-emerald-500", progress: 100 },
        Advanced: { gradient: "from-blue-400 to-cyan-500", progress: 75 },
        Intermediate: { gradient: "from-yellow-400 to-orange-500", progress: 50 },
        Beginner: { gradient: "from-gray-400 to-gray-500", progress: 25 },
    };

    const currentLevel = levelColors[currentSkill.level] || { gradient: "from-gray-500 to-gray-600", progress: 50 };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
            style={{
                opacity: isClosing ? 0 : 1,
                transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                style={{
                    opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
                    transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            />

            {/* Close Button */}
            <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                style={{
                    opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-20px)",
                    transition: "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                }}
            >
                <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Navigation Arrows */}
            <button
                onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                disabled={!hasPrev || isSliding}
                className="absolute left-2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
                style={{
                    top: "50%",
                    transform: `translateY(-50%) ${animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-20px)"}`,
                    opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
                    transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                }}
            >
                <ChevronLeft className="w-5 h-5" strokeWidth={3} />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                disabled={!hasNext || isSliding}
                className="absolute right-2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
                style={{
                    top: "50%",
                    transform: `translateY(-50%) ${animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(20px)"}`,
                    opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
                    transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                }}
            >
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </button>

            {/* Content Container - Center aligned with safe area */}
            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-sm mx-auto"
                onClick={(e) => e.stopPropagation()}
                style={{
                    transform: isClosing
                        ? 'scale(0.92)'
                        : animationPhase === 'initial' && !isClosing
                            ? 'scale(0.8)'
                            : 'scale(1)',
                    opacity: isClosing ? 0 : 1,
                    transition: animationPhase === "initial" && !isClosing
                        ? "none"
                        : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
                }}
            >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900/95 to-black/95 border border-white/10 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.8)]">
                    {/* Category Badge */}
                    <div
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                        style={{
                            background: `${accentColor}30`,
                            color: accentColor,
                            border: `1px solid ${accentColor}40`,
                            opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                            transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
                            transition: "opacity 400ms ease-out 200ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                        }}
                    >
                        {categoryTitle}
                    </div>

                    {/* Skill Counter */}
                    <div
                        className="absolute top-4 right-4 z-20 text-[10px] font-bold text-white/50"
                        style={{
                            opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                            transition: "opacity 400ms ease-out 200ms",
                        }}
                    >
                        {internalIndex + 1} / {totalSkills}
                    </div>

                    {/* Glowing Background Effect */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at 50% 0%, ${accentColor}30 0%, transparent 60%)`,
                        }}
                    />

                    {/* Main Content */}
                    <div className="relative pt-14 pb-6 px-6">
                        {/* Icon Container */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%)`,
                                    border: `2px solid ${accentColor}50`,
                                    boxShadow: `0 0 40px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
                                }}
                            >
                                <RenderSkillIcon iconName={currentSkill.icon} className="w-12 h-12" style={{ color: accentColor }} />
                            </div>
                        </div>

                        {/* Skill Name */}
                        <h3 className="text-2xl font-black text-white text-center tracking-tight mb-2">
                            {currentSkill.name}
                        </h3>

                        {/* Proficiency Section */}
                        <div
                            className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10"
                            style={{
                                opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                                transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(15px)",
                                transition: "opacity 400ms ease-out 300ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Proficiency</span>
                                <span
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r text-white",
                                        currentLevel.gradient
                                    )}
                                >
                                    {currentSkill.level}
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", currentLevel.gradient)}
                                    style={{ width: `${currentLevel.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        <div
                            className="flex items-center justify-center gap-1.5 mt-5"
                            style={{
                                opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                                transition: "opacity 400ms ease-out 400ms",
                            }}
                        >
                            {skills.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onNavigate(idx)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        idx === internalIndex
                                            ? "w-5 bg-white"
                                            : "bg-white/20 hover:bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Animated Folder ---
interface AnimatedFolderProps {
    title: string;
    skills: SkillItem[];
    className?: string;
    gradient: string;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ title, skills, className, gradient }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
    const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const previewSkills = skills.slice(0, 5);

    // Extract accent color from gradient
    const accentMatch = gradient.match(/#[a-fA-F0-9]{6}/);
    const accentColor = accentMatch ? accentMatch[0] : "#00d4ff";

    const handleSkillClick = (skill: SkillItem, index: number) => {
        const cardEl = cardRefs.current[index];
        if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
        setSelectedIndex(index);
        setHiddenCardId(skill.id);
    };

    const handleCloseLightbox = () => {
        setSelectedIndex(null);
        setSourceRect(null);
    };

    const handleCloseComplete = () => {
        setHiddenCardId(null);
    };

    const handleNavigate = (newIndex: number) => {
        setSelectedIndex(newIndex);
        setHiddenCardId(skills[newIndex]?.id || null);
    };

    return (
        <>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl cursor-pointer bg-card border border-border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:border-white/20 group",
                    className
                )}
                style={{
                    minHeight: "220px",
                    perspective: "1200px",
                    transform: isHovered ? "scale(1.04) rotate(-1.5deg)" : "scale(1) rotate(0deg)",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Effect */}
                <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-700"
                    style={{
                        background: `radial-gradient(circle at 50% 70%, ${accentColor} 0%, transparent 70%)`,
                        opacity: isHovered ? 0.15 : 0,
                    }}
                />

                {/* Folder Visual */}
                <div className="relative flex items-center justify-center mb-4" style={{ height: "140px", width: "180px" }}>
                    {/* Back Panel */}
                    <div
                        className="absolute w-28 h-20 rounded-lg shadow-md border border-white/10"
                        style={{
                            background: gradient,
                            filter: "brightness(0.9)",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)",
                            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                            zIndex: 10,
                        }}
                    />

                    {/* Tab */}
                    <div
                        className="absolute w-10 h-3 rounded-t-md border-t border-x border-white/10"
                        style={{
                            background: gradient,
                            filter: "brightness(0.85)",
                            top: "calc(50% - 40px - 10px)",
                            left: "calc(50% - 56px + 12px)",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)",
                            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                            zIndex: 10,
                        }}
                    />

                    {/* Skill Cards Container */}
                    <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
                        {previewSkills.map((skill, index) => (
                            <SkillCard
                                key={skill.id}
                                ref={(el) => { cardRefs.current[index] = el; }}
                                skill={skill}
                                delay={index * 50}
                                isVisible={isHovered}
                                index={index}
                                totalCount={previewSkills.length}
                                onClick={() => handleSkillClick(skill, index)}
                                isSelected={hiddenCardId === skill.id}
                                accentColor={accentColor}
                            />
                        ))}
                    </div>

                    {/* Front Panel */}
                    <div
                        className="absolute w-28 h-20 rounded-lg shadow-lg border border-white/20"
                        style={{
                            background: gradient,
                            top: "calc(50% - 40px + 4px)",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)",
                            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                            zIndex: 30,
                        }}
                    />

                    {/* Front Panel Gloss */}
                    <div
                        className="absolute w-28 h-20 rounded-lg overflow-hidden pointer-events-none"
                        style={{
                            top: "calc(50% - 40px + 4px)",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
                            transformOrigin: "bottom center",
                            transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)",
                            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                            zIndex: 31,
                        }}
                    />
                </div>

                {/* Title & Count */}
                <div className="text-center">
                    <h3
                        className="text-base md:text-lg font-bold text-foreground mt-4 transition-all duration-500"
                        style={{
                            transform: isHovered ? "translateY(2px)" : "translateY(0)",
                            letterSpacing: isHovered ? "-0.01em" : "0",
                        }}
                    >
                        {title}
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground transition-all duration-500" style={{ opacity: isHovered ? 0.8 : 1 }}>
                        {skills.length} {skills.length === 1 ? "skill" : "skills"}
                    </p>
                </div>

                {/* Hover Hint */}
                <div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 transition-all duration-500"
                    style={{
                        opacity: isHovered ? 0 : 1,
                        transform: isHovered ? "translateY(10px)" : "translateY(0)",
                    }}
                >
                    <span>Hover</span>
                </div>
            </div>

            {/* Lightbox */}
            <SkillLightbox
                skills={skills}
                currentIndex={selectedIndex ?? 0}
                isOpen={selectedIndex !== null}
                onClose={handleCloseLightbox}
                sourceRect={sourceRect}
                onCloseComplete={handleCloseComplete}
                onNavigate={handleNavigate}
                accentColor={accentColor}
                categoryTitle={title}
            />
        </>
    );
};

export default AnimatedFolder;
