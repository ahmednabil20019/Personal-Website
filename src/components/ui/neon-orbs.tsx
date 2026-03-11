"use client"

import { useEffect, useState } from "react"
import "./neon-orbs.css"

interface NeonOrbsProps {
    className?: string;
}

export function NeonOrbs({ className = "" }: NeonOrbsProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Top-left orb */}
            <div
                className={`absolute transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
                    top-[-100px] md:top-[-40%] -left-[10%] md:-left-[20%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]`}
            >
                <div className="w-full h-full rounded-full relative neon-orbs-orb-light transition-all duration-500">
                    <div className="neon-orbs-beam-container neon-orbs-spin-8">
                        <div className="neon-orbs-beam-light" />
                    </div>
                </div>
            </div>

            {/* Bottom-center orb */}
            <div
                className={`absolute transition-all duration-1000 ease-out delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                    -bottom-[100px] md:-bottom-[50%] left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px]`}
            >
                <div className="w-full h-full rounded-full relative neon-orbs-orb-light transition-all duration-500">
                    <div className="neon-orbs-beam-container neon-orbs-spin-10-reverse">
                        <div className="neon-orbs-beam-light" />
                    </div>
                </div>
            </div>

            {/* Top-right orb */}
            <div
                className={`absolute transition-all duration-1000 ease-out delay-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
                    top-[-50px] md:top-[-30%] -right-[10%] md:-right-[25%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px]`}
            >
                <div className="w-full h-full rounded-full relative neon-orbs-orb-light transition-all duration-500">
                    <div className="neon-orbs-beam-container neon-orbs-spin-6">
                        <div className="neon-orbs-beam-light" />
                    </div>
                </div>
            </div>

            {/* Bottom-right orb */}
            <div
                className={`absolute transition-all duration-1000 ease-out delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                    -bottom-[50px] md:-bottom-[35%] -right-[5%] md:-right-[15%] w-[75vw] h-[75vw] max-w-[750px] max-h-[750px]`}
            >
                <div className="w-full h-full rounded-full relative neon-orbs-orb-light transition-all duration-500">
                    <div className="neon-orbs-beam-container neon-orbs-spin-7-reverse">
                        <div className="neon-orbs-beam-light" />
                    </div>
                </div>
            </div>
        </div>
    )
}
