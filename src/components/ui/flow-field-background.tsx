import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NeuralBackgroundProps {
    className?: string;
    color?: string;
    trailOpacity?: number;
    particleCount?: number;
    speed?: number;
}

export default function NeuralBackground({
    className,
    color = "#6366f1", // Default Indigo
    trailOpacity = 0.15,
    particleCount = 600,
    speed = 1,
}: NeuralBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Performance: Only run when visible
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        let particles: Particle[] = [];
        let animationFrameId: number;
        // Start off-screen
        let mouse = { x: -1000, y: -1000 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            age: number;
            life: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.age = 0;
                this.life = Math.random() * 200 + 100;
            }

            update() {
                // Flow Field Math (Simplex-ish noise angle)
                const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;

                this.vx += Math.cos(angle) * 0.2 * speed;
                this.vy += Math.sin(angle) * 0.2 * speed;

                // Mouse Repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 150;

                if (distance < interactionRadius) {
                    const force = (interactionRadius - distance) / interactionRadius;
                    this.vx -= dx * force * 0.05;
                    this.vy -= dy * force * 0.05;
                }

                // Friction & Move
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.95;
                this.vy *= 0.95;

                // Aging
                this.age++;
                if (this.age > this.life) {
                    this.reset();
                }

                // Wrap around
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.age = 0;
                this.life = Math.random() * 200 + 100;
            }

            draw(context: CanvasRenderingContext2D) {
                context.fillStyle = color;
                const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
                context.globalAlpha = alpha;
                context.fillRect(this.x, this.y, 1.5, 1.5);
            }
        }

        const init = () => {
            // Handle High-DPI
            const dpr = window.devicePixelRatio || 1;
            // Set display size (css pixels)
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            // Set actual size in memory (scaled to account for extra pixel density)
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            // Normalize coordinate system to use css pixels
            ctx.scale(dpr, dpr);

            particles = [];
            // Adjust particle count for mobile
            const count = width < 768 ? Math.floor(particleCount / 2) : particleCount;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity})`;
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        init();
        animate();

        window.addEventListener("resize", handleResize);
        // Attach mouse events to container to ensure they trigger nicely
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, trailOpacity, particleCount, speed, isVisible]);

    return (
        <div ref={containerRef} className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-auto", className)}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
