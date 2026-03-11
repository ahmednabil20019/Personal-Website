"use client";

import { useEffect, useRef, useState } from "react";

interface ConstellationBackgroundProps {
    color?: string;
    particleCount?: number;
    connectionDistance?: number;
}

export const ConstellationBackground = ({
    color = "#c5a059",
    particleCount = 50, // Reduced from 80 (O(n²) scales badly)
    connectionDistance = 120,
}: ConstellationBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Only animate when in viewport
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

        let width = container.offsetWidth;
        let height = container.offsetHeight;
        let particles: Particle[] = [];
        let animationFrameId: number;

        const handleResize = () => {
            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = width < 768 ? Math.floor(particleCount / 2) : particleCount;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            connectParticles();

            animationFrameId = requestAnimationFrame(animate);
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = filterHex(color, opacity * 0.5);
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const filterHex = (hex: string, alpha: number) => {
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt("0x" + hex[1] + hex[1]);
                g = parseInt("0x" + hex[2] + hex[2]);
                b = parseInt("0x" + hex[3] + hex[3]);
            } else if (hex.length === 7) {
                r = parseInt("0x" + hex[1] + hex[2]);
                g = parseInt("0x" + hex[3] + hex[4]);
                b = parseInt("0x" + hex[5] + hex[6]);
            }
            return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, particleCount, connectionDistance, isVisible]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="block" />
        </div>
    );
};
