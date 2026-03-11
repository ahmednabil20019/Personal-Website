'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

interface ParallaxImage {
    src: string;
    alt?: string;
}

interface JourneyParallaxProps {
    /** Array of images to be displayed in the parallax effect (max 7 images) */
    images: ParallaxImage[];
    /** Color for glow effects (hex) */
    accentColor?: string;
    /** Reference to the parent container for scroll tracking */
    containerRef?: RefObject<HTMLElement>;
}

export function JourneyParallax({ images, accentColor = '#10b981', containerRef }: JourneyParallaxProps) {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef || container,
        offset: ['start start', 'end end'],
    });

    // Different scale values for each layer
    const scale1 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
    const scale2 = useTransform(scrollYProgress, [0, 1], [1, 3]);
    const scale3 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 4.5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale7 = useTransform(scrollYProgress, [0, 1], [1, 5.5]);

    // Opacity fade out as it scales
    const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0, 0.6, 1], [0.12, 0.08, 0]);
    const opacity3 = useTransform(scrollYProgress, [0, 0.7, 1], [0.1, 0.06, 0]);

    const scales = [scale1, scale2, scale3, scale4, scale5, scale6, scale7];
    const opacities = [opacity1, opacity2, opacity3, opacity1, opacity2, opacity3, opacity1];

    // Position configurations for each image
    const positions = [
        { top: '50%', left: '50%', width: '35vw', height: '35vh', transform: 'translate(-50%, -50%)' }, // Center
        { top: '15%', left: '10%', width: '25vw', height: '20vh', transform: 'translate(0, 0)' },
        { top: '20%', left: '70%', width: '20vw', height: '25vh', transform: 'translate(0, 0)' },
        { top: '60%', left: '5%', width: '22vw', height: '22vh', transform: 'translate(0, 0)' },
        { top: '65%', left: '65%', width: '25vw', height: '20vh', transform: 'translate(0, 0)' },
        { top: '85%', left: '35%', width: '20vw', height: '18vh', transform: 'translate(0, 0)' },
        { top: '40%', left: '80%', width: '15vw', height: '15vh', transform: 'translate(0, 0)' },
    ];

    return (
        <div ref={container} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient glow overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: `radial-gradient(ellipse at 50% 30%, ${accentColor}20 0%, transparent 60%)`
                }}
            />

            {images.slice(0, 7).map(({ src, alt }, index) => {
                const scale = scales[index % scales.length];
                const opacity = opacities[index % opacities.length];
                const pos = positions[index];

                return (
                    <motion.div
                        key={index}
                        style={{
                            scale,
                            opacity,
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                            height: pos.height,
                            transform: pos.transform,
                        }}
                        className="will-change-transform"
                    >
                        <div
                            className="relative w-full h-full rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: `0 0 60px ${accentColor}30`,
                            }}
                        >
                            <img
                                src={src || '/placeholder.svg'}
                                alt={alt || `Parallax layer ${index + 1}`}
                                className="w-full h-full object-cover opacity-60 blur-[2px]"
                            />
                            {/* Color overlay to tint images */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}40 0%, transparent 100%)`,
                                    mixBlendMode: 'overlay',
                                }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default JourneyParallax;
