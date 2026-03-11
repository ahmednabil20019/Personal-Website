"use client"

import { useEffect, useRef, useState } from "react"

interface LiquidEffectAnimationProps {
    className?: string;
}

export function LiquidEffectAnimation({ className = "" }: LiquidEffectAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [hasInitialized, setHasInitialized] = useState(false)
    const scriptRef = useRef<HTMLScriptElement | null>(null)
    const uniqueIdRef = useRef(`liquid-canvas-${Math.random().toString(36).substr(2, 9)}`)

    // Only load when visible - trigger once
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect() // Disconnect after first trigger
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible || hasInitialized) return

        const canvasId = uniqueIdRef.current
        const script = document.createElement("script")
        script.type = "module"
        script.textContent = `
            import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
            
            const canvas = document.getElementById('${canvasId}');
            if (canvas) {
                // cleanup previous instance if any
                const appName = 'liquidApp_' + '${canvasId}';
                if (window[appName]) {
                    try { window[appName].dispose(); } catch(e) {}
                }

                const app = LiquidBackground(canvas);
                app.loadImage('/img/liquid-bg.svg');
                app.liquidPlane.material.metalness = 0.75;
                app.liquidPlane.material.roughness = 0.25;
                app.liquidPlane.uniforms.displacementScale.value = 5;
                app.setRain(false);
                
                window[appName] = app;
            }
        `
        document.body.appendChild(script)
        scriptRef.current = script
        setHasInitialized(true)

        return () => {
            const appId = `liquidApp_${uniqueIdRef.current}`
            if (window[appId as any] && (window[appId as any] as any).dispose) {
                (window[appId as any] as any).dispose()
                delete (window as any)[appId]
            }
            if (scriptRef.current) {
                document.body.removeChild(scriptRef.current)
                scriptRef.current = null
            }
        }
    }, [isVisible]) // Removed hasInitialized from dependency/added check inside

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        >
            <canvas
                ref={canvasRef}
                id={uniqueIdRef.current}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    )
}

declare global {
    interface Window {
        [key: string]: any
    }
}
