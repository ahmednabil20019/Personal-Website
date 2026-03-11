import { useState, useEffect, useRef, RefObject } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";

// Background images from public/img folder
const GALLERY_IMAGES_1 = [
    "/img/3d-abstract-network-communications-background-with-plexus-design.jpg",
    "/img/3d-render-abstract-background-with-flowing-particles.jpg",
];
const GALLERY_IMAGES_2 = [
    "/img/3d-render-modern-background-with-flowing-cyber-dots-design.jpg",
    "/img/digital-technology-futuristic-ai-big.jpg",
];
const GALLERY_IMAGES_3 = [
    "/img/3d-abstract-network-communications-background-with-plexus-design.jpg",
    "/img/3d-render-modern-background-with-flowing-cyber-dots-design.jpg",
];

// Gallery Background Component - tracks section scroll
const ServicesGalleryBackground = ({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) => {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"], // Track from when section enters to when it leaves
    });

    // 3D rotation effect: starts tilted, becomes flat
    const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -20]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.35, 0.35, 0]);

    // Column Y offsets for parallax
    const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["-5%", "-25%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["15%", "-10%"]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* 3D Perspective Container */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    perspective: "1200px",
                    perspectiveOrigin: "center 40%",
                }}
            >
                <motion.div
                    className="w-full h-full"
                    style={{
                        rotateX,
                        scale,
                        opacity,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Gallery Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6">
                        {/* Column 1 */}
                        <motion.div className="flex flex-col gap-3" style={{ y: y1 }}>
                            {[...GALLERY_IMAGES_1, ...GALLERY_IMAGES_1, ...GALLERY_IMAGES_1, ...GALLERY_IMAGES_1, ...GALLERY_IMAGES_1, ...GALLERY_IMAGES_1].map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 2 */}
                        <motion.div className="flex flex-col gap-3 -mt-[20%]" style={{ y: y2 }}>
                            {[...GALLERY_IMAGES_2, ...GALLERY_IMAGES_2, ...GALLERY_IMAGES_2, ...GALLERY_IMAGES_2, ...GALLERY_IMAGES_2, ...GALLERY_IMAGES_2].map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 3 */}
                        <motion.div className="flex flex-col gap-3" style={{ y: y3 }}>
                            {[...GALLERY_IMAGES_3, ...GALLERY_IMAGES_3, ...GALLERY_IMAGES_3, ...GALLERY_IMAGES_3, ...GALLERY_IMAGES_3, ...GALLERY_IMAGES_3].map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Color overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c1d]/70 via-[#1a0a2e]/60 to-[#0c0c1d]/70 z-10" />
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: "linear-gradient(to right, rgba(139,92,246,0.2), rgba(217,70,239,0.2), rgba(139,92,246,0.2))",
                    filter: "blur(80px)",
                    mixBlendMode: "overlay",
                }}
            />
        </div>
    );
};

interface Service {
    _id: string;
    title: string;
    description: string;
    icon: string;
    highlight?: string;
    features?: string[];
    stats?: { label: string; value: string }[];
}

const DEFAULT_FEATURES = ["Custom Solutions", "Modern Technologies", "Fast Delivery", "24/7 Support"];
const DEFAULT_STATS = [
    { label: "Projects", value: "20+" },
    { label: "Satisfaction", value: "100%" },
    { label: "Experience", value: "3+ Yrs" }
];

const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Briefcase;
};


export const ServicesSection = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                const data = await res.json();
                if (data.success) {
                    setServices((data.data || []).slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleCardClick = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const gradients = [
        { bg: "from-violet-500 to-purple-600", light: "violet" },
        { bg: "from-fuchsia-500 to-pink-600", light: "fuchsia" },
        { bg: "from-purple-500 to-indigo-600", light: "purple" },
    ];

    if (services.length === 0 && !isLoading) return null;

    return (
        <section id="services" ref={containerRef} className="relative overflow-hidden z-10"
            style={{ background: 'linear-gradient(180deg, #0c0c1d 0%, #1a0a2e 50%, #0c0c1d 100%)' }}
        >
            {/* Animated Gallery Background - tracks section scroll */}
            <ServicesGalleryBackground containerRef={containerRef} />

            {/* Additional Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-3 md:px-6 relative z-20 pt-16 pb-32 md:py-24 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-violet-500" />
                        <span className="text-violet-400 text-[10px] md:text-sm font-medium uppercase tracking-[0.12em] md:tracking-[0.2em]">What I Do</span>
                        <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-violet-500" />
                    </div>
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3">
                        <span className="text-white">Services & </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400">Expertise</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-[11px] md:text-sm px-4">
                        Tap a card to explore details
                    </p>
                </motion.div>

                {/* Cards Container */}
                {isLoading ? (
                    <div className="flex gap-2 md:gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-[200px] md:h-[280px] rounded-xl md:rounded-2xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* MOBILE VERTICAL STACK */}
                        <div className="md:hidden flex flex-col gap-4">
                            {services.map((service, index) => {
                                const IconComp = getIcon(service.icon);
                                const gradient = gradients[index] || gradients[0];
                                const isExpanded = expandedId === service._id;

                                return (
                                    <div
                                        key={service._id}
                                        onClick={() => handleCardClick(service._id)}
                                        className={`
                                    rounded-xl border transition-all duration-300 overflow-hidden
                                    ${isExpanded ? 'border-violet-500/50 bg-violet-900/10' : 'border-white/10 bg-white/5'}"
                                `}
                                    >
                                        <div className="p-4 flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient.bg} flex items-center justify-center shrink-0`}>
                                                <IconComp size={18} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-white">{service.title}</h3>
                                                {!isExpanded && <p className="text-[11px] text-gray-400 line-clamp-1">{service.description}</p>}
                                            </div>
                                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ArrowRight size={14} className="text-gray-500" />
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-4 pb-4"
                                                >
                                                    <p className="text-[13px] text-gray-300 leading-relaxed mb-3">{service.description}</p>
                                                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                                                        {(service.features || DEFAULT_FEATURES).map(f => (
                                                            <div key={f} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                                <CheckCircle2 size={10} className="text-violet-400" /> {f}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2.5">
                                                        {(service.stats || DEFAULT_STATS).map(s => (
                                                            <div key={s.label} className="bg-black/30 flex-1 p-2.5 rounded-lg text-center">
                                                                <div className="text-[13px] font-semibold text-white">{s.value}</div>
                                                                <div className="text-[9px] text-gray-500">{s.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* DESKTOP ACCORDION (Visible on >= md) */}
                        <div className="hidden md:flex gap-2 md:gap-4">
                            {services.map((service, index) => {
                                const IconComp = getIcon(service.icon);
                                const gradient = gradients[index] || gradients[0];
                                const isExpanded = expandedId === service._id;
                                const isCollapsed = expandedId !== null && !isExpanded;
                                const isHovered = hoveredId === service._id;

                                return (
                                    <motion.div
                                        key={service._id}
                                        layout="position"
                                        onClick={() => handleCardClick(service._id)}
                                        onMouseEnter={() => setHoveredId(service._id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        animate={{
                                            flex: isExpanded ? 5 : isCollapsed ? 0.5 : 1,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                        className={`
                                        relative cursor-pointer overflow-hidden
                                        rounded-xl md:rounded-2xl
                                        border border-white/10
                                        transition-colors duration-300
                                        ${isExpanded ? 'border-violet-500/30' : 'hover:border-white/20'}
                                        ${isCollapsed ? 'min-w-[50px] md:min-w-[70px]' : 'min-w-0'}
                                    `}
                                        style={{
                                            background: isExpanded
                                                ? 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(217,70,239,0.08) 50%, rgba(139,92,246,0.04) 100%)'
                                                : 'rgba(255,255,255,0.03)'
                                        }}
                                    >
                                        {/* Collapsed State */}
                                        <AnimatePresence mode="wait">
                                            {isCollapsed && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-[200px] md:h-[280px] flex flex-col items-center justify-center p-2"
                                                >
                                                    <motion.div
                                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${gradient.bg} flex items-center justify-center mb-2`}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <IconComp size={16} className="text-white md:w-5 md:h-5" />
                                                    </motion.div>
                                                    <span className="text-[8px] md:text-[10px] text-gray-500 text-center [writing-mode:vertical-rl] rotate-180">
                                                        {service.title.split(' ')[0]}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Normal State with Hover Animation */}
                                        <AnimatePresence mode="wait">
                                            {!isExpanded && !isCollapsed && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-[200px] md:h-[280px] p-4 md:p-6 flex flex-col relative overflow-hidden"
                                                >
                                                    {/* Hover glow effect */}
                                                    <motion.div
                                                        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${gradient.bg} blur-3xl`}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{
                                                            opacity: isHovered ? 0.15 : 0,
                                                            scale: isHovered ? 1 : 0.5
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                    />

                                                    {/* Icon with hover animation */}
                                                    <motion.div
                                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient.bg} flex items-center justify-center mb-3 md:mb-4 shadow-lg relative z-10`}
                                                        animate={{
                                                            scale: isHovered ? 1.1 : 1,
                                                            rotate: isHovered ? 5 : 0
                                                        }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                    >
                                                        <IconComp size={20} className="text-white md:w-6 md:h-6" />
                                                    </motion.div>

                                                    {/* Title with stagger */}
                                                    <motion.h3
                                                        className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-2 relative z-10"
                                                        animate={{ y: isHovered ? -2 : 0 }}
                                                        transition={{ duration: 0.2, delay: 0.05 }}
                                                    >
                                                        {service.title}
                                                    </motion.h3>

                                                    {/* Description with stagger */}
                                                    <motion.p
                                                        className="text-[10px] md:text-sm text-gray-400 line-clamp-2 md:line-clamp-3 flex-1 relative z-10"
                                                        animate={{ y: isHovered ? -2 : 0 }}
                                                        transition={{ duration: 0.2, delay: 0.1 }}
                                                    >
                                                        {service.description}
                                                    </motion.p>

                                                    {/* CTA with slide in */}
                                                    <motion.div
                                                        className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-violet-400 mt-2 md:mt-4 relative z-10"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{
                                                            opacity: isHovered ? 1 : 0.5,
                                                            x: isHovered ? 0 : -5
                                                        }}
                                                        transition={{ duration: 0.2, delay: 0.15 }}
                                                    >
                                                        <span>Explore</span>
                                                        <motion.div
                                                            animate={{ x: isHovered ? 3 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                                                        </motion.div>
                                                    </motion.div>

                                                    {/* Top accent line on hover */}
                                                    <motion.div
                                                        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient.bg}`}
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: isHovered ? 1 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        style={{ transformOrigin: 'left' }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Expanded State */}
                                        <AnimatePresence mode="wait">
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                    className="h-[200px] md:h-[280px] p-4 md:p-6 overflow-hidden"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
                                                        {/* Left - Main Info */}
                                                        <div className="flex-1 flex flex-col">
                                                            <motion.div
                                                                className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient.bg} flex items-center justify-center shadow-lg shrink-0`}>
                                                                    <IconComp size={20} className="text-white md:w-7 md:h-7" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-base md:text-xl font-bold text-white mb-0.5">
                                                                        {service.title}
                                                                    </h3>
                                                                    <div className="flex items-center gap-1.5 text-violet-400 text-[10px] md:text-xs">
                                                                        <Sparkles size={12} />
                                                                        <span>{service.highlight || "Premium quality guaranteed"}</span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>

                                                            {/* Description */}
                                                            <motion.p
                                                                className="text-gray-300 text-[10px] md:text-sm leading-relaxed mb-3 flex-1"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.25 }}
                                                            >
                                                                {service.description}
                                                            </motion.p>

                                                            {/* Features */}
                                                            <motion.div
                                                                className="grid grid-cols-2 gap-1.5 md:gap-2"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.3 }}
                                                            >
                                                                {(service.features || DEFAULT_FEATURES).map((feature, i) => (
                                                                    <motion.div
                                                                        key={feature}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: 0.35 + i * 0.05 }}
                                                                        className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-300"
                                                                    >
                                                                        <CheckCircle2 size={10} className="text-violet-400 shrink-0 md:w-3 md:h-3" />
                                                                        <span>{feature}</span>
                                                                    </motion.div>
                                                                ))}
                                                            </motion.div>
                                                        </div>

                                                        {/* Right - Stats (hidden on very small screens) */}
                                                        <motion.div
                                                            className="hidden sm:flex md:flex-col gap-2 md:gap-3 md:w-28"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.4 }}
                                                        >
                                                            {(service.stats || DEFAULT_STATS).map((stat, i) => (
                                                                <motion.div
                                                                    key={stat.label}
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 0.45 + i * 0.08 }}
                                                                    className={`flex-1 p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient.bg}/20 border border-white/10 text-center`}
                                                                >
                                                                    <div className="text-sm md:text-lg font-bold text-white">{stat.value}</div>
                                                                    <div className="text-[8px] md:text-[10px] text-gray-400">{stat.label}</div>
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                    </div>

                                                    {/* Close hint */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                                    >
                                                        <X size={12} className="text-gray-500" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section >
    );
};
