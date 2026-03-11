import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, Variants, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { cn } from "@/lib/utils";
import { JourneyParallax } from "@/components/ui/journey-parallax";

// Parallax images - abstract/geometric with teal/emerald tones
const parallaxImages = [
    { src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=60', alt: 'Abstract gradient' },
    { src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=60', alt: 'Gradient mesh' },
    { src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=60', alt: 'Abstract waves' },
    { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=60', alt: 'Geometric pattern' },
    { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=60', alt: 'Minimalist design' },
];

// Types
interface JourneyItem {
    _id: string;
    type: 'work' | 'education' | 'project';
    title: string;
    company: string;
    location?: string;
    year: string;
    period?: string;
    description: string;
    icon?: string;
    color?: string;
    achievements?: string[];
    technologies?: string[];
}

const RenderIcon = ({ iconName, className, itemType }: { iconName?: string, className?: string, itemType?: string }) => {
    // Default icon based on item type
    const defaultIcon = itemType === 'education' ? 'GraduationCap' : 'Briefcase';
    let finalIconName = iconName || defaultIcon;

    // FORCE CORRECT ICON: If it's education but has a work icon, override it
    if (itemType === 'education' && finalIconName === 'Briefcase') {
        finalIconName = 'GraduationCap';
    }

    if (finalIconName.startsWith("http") || finalIconName.startsWith("/")) {
        return <img src={finalIconName} className={cn("object-contain", className)} alt="icon" />;
    }

    const isSimple = finalIconName.startsWith("Si");
    // @ts-ignore
    const IconLib = isSimple ? SimpleIcons : LucideIcons;
    // @ts-ignore
    const IconComp = IconLib[finalIconName] || (itemType === 'education' ? LucideIcons.GraduationCap : LucideIcons.Briefcase);
    return <IconComp className={className} />;
};

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

// ----------------------
// WORK COMPONENT - Cyber/Tech Aesthetic
// ----------------------
const WorkCard = ({ item, isEven }: { item: JourneyItem, isEven: boolean }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: false, margin: "-10% 0px -10% 0px" });

    return (
        <motion.div
            ref={cardRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="relative p-5 md:p-8 rounded-xl md:rounded-2xl bg-[#080808] border overflow-hidden group"
            style={{
                borderColor: `${item.color}20`,
                boxShadow: `0 0 0 1px ${item.color}05, 0 25px 50px -12px rgba(0,0,0,0.5)`
            }}
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />

            {/* Corner Glow Effect */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 0.3, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px]"
                style={{ backgroundColor: item.color }}
            />

            {/* Status Indicator */}
            <motion.div
                variants={scaleIn}
                className="absolute top-4 right-4 flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Active</span>
            </motion.div>

            {/* Header Section */}
            <motion.div
                variants={isEven ? slideInLeft : slideInRight}
                className="flex items-start gap-3 md:gap-5 mb-4 md:mb-6 relative z-10"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center border-2 bg-black/60 shadow-2xl shrink-0"
                    style={{ borderColor: `${item.color}60`, color: item.color }}
                >
                    <RenderIcon iconName={item.icon} itemType="work" className="w-6 h-6 md:w-8 md:h-8" />
                </motion.div>
                <div className="flex-1">
                    <motion.h3
                        variants={fadeUp}
                        className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2 leading-tight"
                    >
                        {item.title}
                    </motion.h3>
                    <motion.div
                        variants={fadeUp}
                        className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm"
                    >
                        <span className="font-bold tracking-wide" style={{ color: item.color }}>{item.company}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-white/40 font-mono text-xs">{item.period || item.year}</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Description */}
            <motion.div
                variants={fadeUp}
                className="relative z-10 mb-4 md:mb-6"
            >
                <div className="flex items-stretch gap-4">
                    <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: `${item.color}40` }} />
                    <p className="text-gray-300 text-[13px] md:text-sm lg:text-base leading-relaxed font-light">
                        {item.description}
                    </p>
                </div>
            </motion.div>

            {/* Tech Stack */}
            {item.technologies && item.technologies.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6 relative z-10"
                >
                    {item.technologies.slice(0, 10).map((tech, i) => (
                        <motion.span
                            key={i}
                            variants={scaleIn}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="px-2 py-1 md:px-3 md:py-1.5 rounded md:rounded-lg text-[10px] md:text-xs uppercase tracking-wider bg-white/5 border border-white/10 text-white/70 font-mono cursor-default transition-colors"
                            style={{ borderColor: i === 0 ? `${item.color}50` : undefined }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {/* Achievements */}
            {item.achievements && item.achievements.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    className="relative z-10 pt-3 md:pt-4 border-t border-white/5"
                >
                    <motion.span
                        variants={fadeUp}
                        className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block font-mono"
                    >
                        Key Impact
                    </motion.span>
                    <div className="space-y-2">
                        {item.achievements.map((ach, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="flex items-start gap-3 group/item"
                            >
                                <LucideIcons.Zap
                                    size={12}
                                    className="shrink-0 mt-0.5 md:mt-1 transition-transform group-hover/item:scale-125"
                                    style={{ color: item.color }}
                                />
                                <span className="text-[13px] md:text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors">
                                    {ach}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

// ----------------------
// EDUCATION COMPONENT - Academic/Elegant Aesthetic
// ----------------------
const EducationCard = ({ item, isEven }: { item: JourneyItem, isEven: boolean }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: false, margin: "-10% 0px -10% 0px" });

    return (
        <motion.div
            ref={cardRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="relative p-5 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border border-white/10 overflow-hidden backdrop-blur-md"
        >
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_50%)]" />
            </div>

            {/* Floating Diploma Icon */}
            <motion.div
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={isInView ? { opacity: 0.03, rotate: 12, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -top-10 -right-10 pointer-events-none"
            >
                <LucideIcons.GraduationCap size={220} />
            </motion.div>


            {/* Header */}
            <motion.div
                variants={isEven ? slideInLeft : slideInRight}
                className="flex items-start gap-4 md:gap-6 mb-5 md:mb-8 pb-4 md:pb-6 border-b border-white/5"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xl"
                >
                    <RenderIcon iconName={item.icon} itemType="education" className="w-7 h-7 md:w-10 md:h-10" />
                </motion.div>
                <div className="flex-1 min-w-0">
                    <motion.h3
                        variants={fadeUp}
                        className="text-lg md:text-2xl lg:text-4xl font-serif text-white tracking-wide leading-tight mb-1 md:mb-2"
                    >
                        {item.title}
                    </motion.h3>
                    <motion.p
                        variants={fadeUp}
                        className="text-[13px] md:text-lg text-cyan-300/70 font-light"
                    >
                        {item.company}
                    </motion.p>
                </div>
                {/* Year Badge — inline so it never overlaps the title */}
                <motion.div variants={scaleIn} className="shrink-0 self-start">
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs md:text-sm font-mono whitespace-nowrap">
                        {item.year}
                    </div>
                </motion.div>
            </motion.div>

            {/* Info Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-5 md:mb-8"
            >
                {item.location && (
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <LucideIcons.MapPin size={16} className="text-white/40 md:hidden" />
                            <LucideIcons.MapPin size={18} className="text-white/40 hidden md:block" />
                        </div>
                        <div>
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 block">Campus</span>
                            <span className="text-white/80 text-[13px] md:text-base">{item.location}</span>
                        </div>
                    </motion.div>
                )}
                {item.period && (
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <LucideIcons.Clock size={16} className="text-white/40 md:hidden" />
                            <LucideIcons.Clock size={18} className="text-white/40 hidden md:block" />
                        </div>
                        <div>
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 block">Duration</span>
                            <span className="text-white/80 text-[13px] md:text-base">{item.period}</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Coursework Pills */}
            {item.technologies && item.technologies.length > 0 && (
                <motion.div variants={containerVariants} className="mb-5 md:mb-8">
                    <motion.span
                        variants={fadeUp}
                        className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-white/30 mb-3 md:mb-4"
                    >
                        <LucideIcons.BookOpen size={12} className="md:hidden" />
                        <LucideIcons.BookOpen size={14} className="hidden md:block" /> Key Coursework
                    </motion.span>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {item.technologies.slice(0, 8).map((tech, i) => (
                            <motion.span
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -2 }}
                                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 text-[12px] md:text-sm text-gray-300 border border-white/5 flex items-center gap-2 cursor-default"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Honors Section */}
            {item.achievements && item.achievements.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent rounded-lg md:rounded-xl p-4 md:p-5 border-l-4 border-yellow-500/60"
                >
                    <motion.span
                        variants={fadeUp}
                        className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-yellow-400/80 mb-2 md:mb-3 font-bold"
                    >
                        <LucideIcons.Trophy size={12} className="md:hidden" />
                        <LucideIcons.Trophy size={14} className="hidden md:block" /> Honors & Achievements
                    </motion.span>
                    <div className="space-y-2">
                        {item.achievements.map((ach, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="flex items-start gap-2 md:gap-3 text-[13px] md:text-sm text-white/80"
                            >
                                <LucideIcons.Star size={12} className="shrink-0 mt-0.5 text-yellow-400/60 md:hidden" />
                                <LucideIcons.Star size={14} className="shrink-0 mt-0.5 text-yellow-400/60 hidden md:block" />
                                {ach}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

// Timeline Node Component
const TimelineNode = ({ item, index }: { item: JourneyItem, index: number }) => {
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: false, margin: "-20% 0px -20% 0px" });

    if (item.type === 'education') {
        return (
            <motion.div
                ref={nodeRef}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-full bg-[#030303] border-4 border-purple-500/30 flex items-center justify-center z-10 relative shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
                <LucideIcons.GraduationCap size={20} className="text-purple-400" />
            </motion.div>
        )
    }
    // Work Node
    return (
        <motion.div
            ref={nodeRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-xl bg-[#030303] border-2 flex items-center justify-center z-10 relative shadow-lg rotate-45"
            style={{
                borderColor: `${item.color}60`,
                boxShadow: `0 0 25px ${item.color}30`
            }}
        >
            <div className="-rotate-45">
                <LucideIcons.Briefcase size={18} style={{ color: item.color }} />
            </div>
        </motion.div>
    );
};

// Timeline Row
const TimelineRow = ({ item, index, isLast }: { item: JourneyItem, index: number, isLast: boolean }) => {
    const isEven = index % 2 === 0;
    const rowRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: rowRef,
        offset: ["start end", "end start"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

    return (
        <div
            ref={rowRef}
            className={cn(
                "relative flex gap-4 md:gap-0 w-full mb-8 md:mb-0",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            {/* Spine Column: Left on Mobile, Center on Desktop */}
            <div className="absolute left-2 md:left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center z-10">
                <TimelineNode item={item} index={index} />
                {!isLast && (
                    <div className="w-0.5 grow mt-2 mb-2 bg-white/5 relative overflow-hidden">
                        <motion.div
                            style={{ height: lineHeight }}
                            className="absolute top-0 left-0 w-full"
                            initial={{ height: 0 }}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    background: `linear-gradient(to bottom, ${item.color}60, transparent)`
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Content Column: Pushed Right on Mobile */}
            <div className={cn(
                "flex-1 ml-12 md:ml-0 py-2 md:py-6 md:pb-24",
                isEven ? "md:pr-28" : "md:pl-28"
            )}>
                {item.type === 'education' ? (
                    <EducationCard item={item} isEven={isEven} />
                ) : (
                    <WorkCard item={item} isEven={isEven} />
                )}
            </div>

            {/* Balance Column (Desktop Only) */}
            <div className="flex-1 hidden md:block" />
        </div>
    );
};

// Main Section
export const JourneySection = () => {
    const [items, setItems] = useState<JourneyItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchJourney = async () => {
            try {
                const response = await fetch('/api/journey');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) setItems(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch journey items", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJourney();
    }, []);

    if (isLoading) return (
        <div className="h-screen bg-[#030303] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
                <LucideIcons.Loader2 className="w-8 h-8 text-cyan-400" />
            </motion.div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            id="journey"
            className="relative py-16 md:py-32 bg-[#030303] overflow-hidden min-h-screen"
        >
            {/* Zoom Parallax Background */}
            <JourneyParallax
                images={parallaxImages}
                accentColor="#10b981"
                containerRef={sectionRef as React.RefObject<HTMLElement>}
            />

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute top-1/4 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-900/10 rounded-full blur-[100px] md:blur-[150px]" />
                <div className="absolute bottom-1/4 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-teal-900/10 rounded-full blur-[100px] md:blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-32"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-emerald-400 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono mb-3 md:mb-4 block"
                    >
                        Experience & Education
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight text-white">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Journey</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
                        A timeline of growth, learning, and professional development
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-6xl mx-auto relative">
                    {/* Central Spine */}
                    <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-0" />

                    <div className="w-full">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <TimelineRow
                                    key={item._id}
                                    item={item}
                                    index={index}
                                    isLast={index === items.length - 1}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-500 py-32 font-mono"
                            >
                                <LucideIcons.FileQuestion className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                No entries yet. Add your first milestone!
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
