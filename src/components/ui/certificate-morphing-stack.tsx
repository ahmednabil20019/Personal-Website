"use client"

import { useState } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers, LayoutList, Award, Ribbon, ChevronLeft, ChevronRight } from "lucide-react"

export type LayoutMode = "stack" | "grid" | "list"

export interface CertificateCardData {
    id: string
    title: string
    issuer: string
    category?: string
    date?: string
    image?: string
}

export interface CertificateMorphingStackProps {
    certificates: CertificateCardData[]
    className?: string
    defaultLayout?: LayoutMode
    onCardClick?: (cert: CertificateCardData) => void
}

const layoutIcons = {
    stack: Layers,
    grid: Grid3X3,
    list: LayoutList,
}

const SWIPE_THRESHOLD = 50

export function CertificateMorphingStack({
    certificates,
    className,
    defaultLayout = "stack",
    onCardClick,
}: CertificateMorphingStackProps) {
    const [layout, setLayout] = useState<LayoutMode>(defaultLayout)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    if (!certificates || certificates.length === 0) {
        return null
    }

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const { offset, velocity } = info
        const swipe = Math.abs(offset.x) * velocity.x

        if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
            setActiveIndex((prev) => (prev + 1) % certificates.length)
        } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
            setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length)
        }
        setIsDragging(false)
    }

    const getStackOrder = () => {
        const reordered = []
        for (let i = 0; i < certificates.length; i++) {
            const index = (activeIndex + i) % certificates.length
            reordered.push({ ...certificates[index], stackPosition: i })
        }
        return reordered.reverse()
    }

    // Reusable card styles
    const CardContent = ({ cert, isListMode = false }: { cert: CertificateCardData, isListMode?: boolean }) => (
        <>
            {/* Certificate Image */}
            <div className={cn(
                "relative overflow-hidden bg-black",
                isListMode ? "w-24 h-full flex-shrink-0" : "absolute inset-0"
            )}>
                {cert.image ? (
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" draggable={false} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#151515] to-[#0a0a0a] flex items-center justify-center">
                        <Award className={cn("text-[#c5a059]/20", isListMode ? "w-6 h-6" : "w-10 h-10")} />
                    </div>
                )}
            </div>

            {/* Gold border frame */}
            {!isListMode && <div className="absolute inset-[3px] rounded-lg border border-[#c5a059]/30 pointer-events-none z-10" />}

            {/* Category Badge */}
            <div className={cn("absolute z-20", isListMode ? "top-1 left-[100px]" : "top-2 left-2")}>
                <span className={cn(
                    "inline-block bg-black/80 backdrop-blur-sm rounded border border-[#c5a059]/40 text-[#c5a059] font-bold tracking-wider",
                    isListMode ? "px-1 py-0.5 text-[7px]" : "px-1.5 py-0.5 text-[8px]"
                )}>
                    {cert.category?.toUpperCase() || "CERT"}
                </span>
            </div>

            {/* Info Overlay */}
            <div className={cn(
                "z-20",
                isListMode
                    ? "flex-1 flex flex-col justify-center px-2 py-1"
                    : "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/90 to-transparent"
            )}>
                <h3 className={cn(
                    "font-bold text-white leading-tight",
                    isListMode ? "text-[11px] line-clamp-1 mt-2" : "text-xs line-clamp-2 mb-0.5"
                )}>
                    {cert.title}
                </h3>
                <p className={cn("text-[#c5a059]/70", isListMode ? "text-[8px]" : "text-[9px]")}>
                    {cert.issuer}
                </p>
            </div>

            {/* Ribbon Badge */}
            <div className={cn("absolute z-20", isListMode ? "right-2 top-1/2 -translate-y-1/2" : "bottom-2 right-2")}>
                <div className={cn(
                    "rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6e36] shadow-lg flex items-center justify-center",
                    isListMode ? "w-5 h-5" : "w-6 h-6"
                )}>
                    <Ribbon className={cn("text-white", isListMode ? "w-2.5 h-2.5" : "w-3 h-3")} />
                </div>
            </div>
        </>
    )

    return (
        <div className={cn("space-y-4", className)}>
            {/* Layout Toggle */}
            <div className="flex items-center justify-center gap-1 rounded-xl bg-black/40 backdrop-blur-sm border border-[#c5a059]/20 p-1 w-fit mx-auto">
                {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
                    const Icon = layoutIcons[mode]
                    return (
                        <button
                            key={mode}
                            onClick={() => setLayout(mode)}
                            className={cn(
                                "rounded-lg p-2.5 transition-all",
                                layout === mode
                                    ? "bg-gradient-to-br from-[#c5a059] to-[#8a6e36] text-white shadow-lg"
                                    : "text-[#c5a059]/50 hover:text-[#c5a059] hover:bg-white/5",
                            )}
                            aria-label={`Switch to ${mode} layout`}
                        >
                            <Icon className="h-4 w-4" />
                        </button>
                    )
                })}
            </div>

            {/* STACK Layout */}
            {layout === "stack" && (
                <div className="relative h-52 w-64 mx-auto">
                    <AnimatePresence mode="popLayout">
                        {getStackOrder().map((cert) => {
                            const isTopCard = cert.stackPosition === 0
                            return (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    drag={isTopCard ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    onDragStart={() => setIsDragging(true)}
                                    onDragEnd={handleDragEnd}
                                    whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                                    onClick={() => { if (!isDragging) onCardClick?.(cert) }}
                                    className={cn(
                                        "absolute w-56 h-40 cursor-pointer rounded-xl overflow-hidden border-2 border-[#c5a059]/20 bg-[#0a0a0a]",
                                        "hover:border-[#c5a059]/40 transition-colors",
                                        isTopCard && "cursor-grab active:cursor-grabbing",
                                    )}
                                    style={{
                                        top: cert.stackPosition * 5,
                                        left: cert.stackPosition * 5,
                                        zIndex: certificates.length - cert.stackPosition,
                                        boxShadow: `rgba(0, 0, 0, 0.3) 0px 4px 16px`,
                                    }}
                                >
                                    <CardContent cert={cert} />
                                    {isTopCard && (
                                        <div className="absolute bottom-0.5 left-0 right-0 text-center z-30">
                                            <span className="text-[8px] text-white/30">← Swipe →</span>
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* GRID Layout */}
            {layout === "grid" && (
                <div className="max-h-[350px] overflow-y-auto px-2">
                    <div className="grid grid-cols-2 gap-2">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                onClick={() => onCardClick?.(cert)}
                                className="relative aspect-[4/3] cursor-pointer rounded-lg overflow-hidden border border-[#c5a059]/20 bg-[#0a0a0a] hover:border-[#c5a059]/40 transition-colors active:scale-95"
                                style={{ boxShadow: `rgba(0, 0, 0, 0.2) 0px 2px 8px` }}
                            >
                                <CardContent cert={cert} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LIST Layout */}
            {layout === "list" && (
                <div className="max-h-[350px] overflow-y-auto px-2">
                    <div className="flex flex-col gap-2">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                onClick={() => onCardClick?.(cert)}
                                className="relative h-16 flex cursor-pointer rounded-lg overflow-hidden border border-[#c5a059]/20 bg-[#0a0a0a] hover:border-[#c5a059]/40 transition-colors active:scale-[0.98]"
                                style={{ boxShadow: `rgba(0, 0, 0, 0.2) 0px 2px 8px` }}
                            >
                                <CardContent cert={cert} isListMode />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation for Stack Mode */}
            {layout === "stack" && certificates.length > 1 && (
                <div className="flex justify-center items-center gap-3">
                    <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length)}
                        className="w-8 h-8 rounded-full bg-[#c5a059]/20 hover:bg-[#c5a059]/40 flex items-center justify-center text-[#c5a059] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-[#c5a059]/70 min-w-[3rem] text-center">
                        {activeIndex + 1} / {certificates.length}
                    </span>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % certificates.length)}
                        className="w-8 h-8 rounded-full bg-[#c5a059]/20 hover:bg-[#c5a059]/40 flex items-center justify-center text-[#c5a059] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
