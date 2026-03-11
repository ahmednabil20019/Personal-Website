"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Award, Ribbon } from "lucide-react"
import { CertificateMorphingStack } from "./certificate-morphing-stack"

interface Certificate {
    id?: string | number;
    _id?: string;
    title: string;
    issuer: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    courseHours?: string;
    category?: string;
    description?: string;
    credentialId?: string;
    verifyUrl?: string;
    image?: string;
}

interface CertificatesGalleryProps {
    certificates: Certificate[];
    onCertificateClick?: (cert: Certificate) => void;
    className?: string;
    maxHeight?: number;
    pauseOnHover?: boolean;
    marqueeRepeat?: number;
}

export function CertificatesGallery({
    certificates,
    onCertificateClick,
    className = "",
    maxHeight = 140,
    pauseOnHover = true,
    marqueeRepeat = 3
}: CertificatesGalleryProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    if (!certificates || certificates.length === 0) return null;

    return (
        <div className={cn("relative w-full", className)}>
            {/* Desktop 3D overlapping layout - hidden on mobile */}
            <div className="hidden md:block relative overflow-visible pb-8">
                <div className="flex pb-8 pt-32 items-end justify-center">
                    {certificates.map((cert, index) => {
                        const totalCerts = certificates.length
                        const middle = Math.floor(totalCerts / 2)
                        const distanceFromMiddle = Math.abs(index - middle)
                        const staggerOffset = maxHeight - distanceFromMiddle * 25

                        const zIndex = totalCerts - index

                        const isHovered = hoveredIndex === index
                        const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

                        const yOffset = isHovered ? -130 : isOtherHovered ? 0 : -staggerOffset

                        // Dynamic card width: shrinks as more certs are added (min 220px)
                        const cardWidth = Math.max(220, 400 - Math.max(0, totalCerts - 7) * 18)
                        // Dynamic overlap: tighter as more certs are added
                        const overlap = Math.min(cardWidth * 0.82, 160 + Math.max(0, totalCerts - 3) * 16)

                        return (
                            <motion.div
                                key={cert.id || cert._id || index}
                                className="group cursor-pointer flex-shrink-0"
                                style={{
                                    zIndex,
                                    marginLeft: index === 0 ? 0 : `-${overlap}px`,
                                }}
                                initial={{
                                    transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`,
                                    opacity: 0,
                                }}
                                animate={{
                                    transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.25,
                                    delay: index * 0.06,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                onClick={() => onCertificateClick?.(cert)}
                            >
                                {/* Certificate Card - Top Info Design */}
                                <div
                                    className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                                    style={{
                                        width: `${cardWidth}px`,
                                        boxShadow: `rgba(0, 0, 0, 0.3) 0px 8px 32px, rgba(197, 160, 89, 0.08) 0px 0px 40px`,
                                    }}
                                >
                                    {/* Top Header */}
                                    <div className="relative bg-gradient-to-b from-[#151515] to-[#0d0d0d] p-4">
                                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />

                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="px-2 py-0.5 bg-[#c5a059]/15 rounded text-[#c5a059] text-[10px] font-bold tracking-widest uppercase">
                                                {cert.category || "Certified"}
                                            </span>
                                            <span className="text-[10px] text-zinc-500">{cert.date}</span>
                                        </div>

                                        <h3 className="text-sm lg:text-[15px] font-semibold text-white leading-snug line-clamp-2 mb-2">
                                            {cert.title}
                                        </h3>

                                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
                                            {cert.issuer}
                                        </div>
                                    </div>

                                    {/* Image Section */}
                                    <div className="relative bg-[#0a0a0a] p-2.5">
                                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#c5a059]/15">
                                            {cert.image ? (
                                                <img
                                                    src={cert.image}
                                                    alt={cert.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#151515] to-[#0a0a0a] flex items-center justify-center">
                                                    <Award className="w-10 h-10 text-[#c5a059]/10" />
                                                </div>
                                            )}

                                            <div className="absolute bottom-2 right-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8a6e36] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Ribbon className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none group-hover:border-[#c5a059]/20 transition-colors" />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Mobile Morphing Card Stack */}
            <div className="block md:hidden py-4">
                <CertificateMorphingStack
                    certificates={certificates.map((cert, i) => ({
                        id: String(cert.id || cert._id || i),
                        title: cert.title,
                        issuer: cert.issuer,
                        category: cert.category,
                        date: cert.date,
                        image: cert.image,
                    }))}
                    onCardClick={(card) => {
                        const originalCert = certificates.find(
                            c => String(c.id || c._id) === card.id || c.title === card.title
                        );
                        if (originalCert) onCertificateClick?.(originalCert);
                    }}
                />
            </div>
        </div>
    )
}
