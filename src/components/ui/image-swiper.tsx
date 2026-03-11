"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSwiperProps {
    images: string[];
    cardWidth?: number;
    cardHeight?: number;
    className?: string;
}

export const ImageSwiper: React.FC<ImageSwiperProps> = ({
    images,
    cardWidth = 256,
    cardHeight = 352,
    className = ''
}) => {
    const cardStackRef = useRef<HTMLDivElement>(null);
    const isSwiping = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const animationFrameId = useRef<number | null>(null);

    const imageList = images.filter(img => img);
    const [cardOrder, setCardOrder] = useState<number[]>(() =>
        Array.from({ length: imageList.length }, (_, i) => i)
    );

    // Current image is the first in cardOrder
    const currentIndex = cardOrder[0] ?? 0;

    const getDurationFromCSS = useCallback((
        variableName: string,
        element?: HTMLElement | null
    ): number => {
        const targetElement = element || document.documentElement;
        const value = getComputedStyle(targetElement)
            ?.getPropertyValue(variableName)
            ?.trim();
        if (!value) return 300;
        if (value.endsWith("ms")) return parseFloat(value);
        if (value.endsWith("s")) return parseFloat(value) * 1000;
        return parseFloat(value) || 300;
    }, []);

    const getCards = useCallback((): HTMLElement[] => {
        if (!cardStackRef.current) return [];
        return [...cardStackRef.current.querySelectorAll('.image-card')] as HTMLElement[];
    }, []);

    const getActiveCard = useCallback((): HTMLElement | null => {
        const cards = getCards();
        return cards[0] || null;
    }, [getCards]);

    const updatePositions = useCallback(() => {
        const cards = getCards();
        cards.forEach((card, i) => {
            card.style.setProperty('--i', (i + 1).toString());
            card.style.setProperty('--swipe-x', '0px');
            card.style.setProperty('--swipe-rotate', '0deg');
            card.style.opacity = '1';
        });
    }, [getCards]);

    const applySwipeStyles = useCallback((deltaX: number) => {
        const card = getActiveCard();
        if (!card) return;
        card.style.setProperty('--swipe-x', `${deltaX}px`);
        card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`);
        card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString();
    }, [getActiveCard]);

    const handleStart = useCallback((clientX: number) => {
        if (isSwiping.current) return;
        isSwiping.current = true;
        startX.current = clientX;
        currentX.current = clientX;
        const card = getActiveCard();
        if (card) card.style.transition = 'none';
    }, [getActiveCard]);

    const swipeCard = useCallback((direction: 1 | -1) => {
        const card = getActiveCard();
        const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current);

        if (card) {
            card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
            card.style.setProperty('--swipe-x', `${direction * 300}px`);
            card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);

            setTimeout(() => {
                if (getActiveCard() === card) {
                    card.style.setProperty('--swipe-rotate', `${-direction * 20}deg`);
                }
            }, duration * 0.5);

            setTimeout(() => {
                setCardOrder(prev => {
                    if (prev.length === 0) return [];
                    return [...prev.slice(1), prev[0]];
                });
            }, duration);
        }
    }, [getActiveCard, getDurationFromCSS]);

    const handleEnd = useCallback(() => {
        if (!isSwiping.current) return;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }

        const deltaX = currentX.current - startX.current;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
            const direction = Math.sign(deltaX) as 1 | -1;
            swipeCard(direction);
        } else {
            applySwipeStyles(0);
            const card = getActiveCard();
            if (card) {
                const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current);
                card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
            }
        }

        isSwiping.current = false;
        startX.current = 0;
        currentX.current = 0;
    }, [swipeCard, getActiveCard, getDurationFromCSS, applySwipeStyles]);

    const handleMove = useCallback((clientX: number) => {
        if (!isSwiping.current) return;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        animationFrameId.current = requestAnimationFrame(() => {
            currentX.current = clientX;
            const deltaX = currentX.current - startX.current;
            applySwipeStyles(deltaX);

            if (Math.abs(deltaX) > 50) {
                handleEnd();
            }
        });
    }, [applySwipeStyles, handleEnd]);

    // Arrow button handlers
    const handlePrev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        swipeCard(1);
    }, [swipeCard]);

    const handleNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        swipeCard(-1);
    }, [swipeCard]);

    useEffect(() => {
        const cardStackElement = cardStackRef.current;
        if (!cardStackElement) return;

        const handlePointerDown = (e: PointerEvent) => handleStart(e.clientX);
        const handlePointerMove = (e: PointerEvent) => handleMove(e.clientX);
        const handlePointerUp = () => handleEnd();

        cardStackElement.addEventListener('pointerdown', handlePointerDown);
        cardStackElement.addEventListener('pointermove', handlePointerMove);
        cardStackElement.addEventListener('pointerup', handlePointerUp);

        return () => {
            cardStackElement.removeEventListener('pointerdown', handlePointerDown);
            cardStackElement.removeEventListener('pointermove', handlePointerMove);
            cardStackElement.removeEventListener('pointerup', handlePointerUp);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [handleStart, handleMove, handleEnd]);

    useEffect(() => {
        updatePositions();
    }, [cardOrder, updatePositions]);

    if (imageList.length === 0) return null;

    return (
        <div className={`relative flex flex-col items-center gap-4 ${className}`}>
            {/* Main Swiper Container */}
            <div className="relative flex items-center gap-4">
                {/* Left Arrow */}
                {imageList.length > 1 && (
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-black/50 border border-orange-500/30 text-orange-500 hover:bg-orange-500/20 transition-colors z-20"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Card Stack */}
                <section
                    className="relative grid place-content-center select-none"
                    ref={cardStackRef}
                    style={{
                        width: cardWidth + 32,
                        height: cardHeight + 32,
                        touchAction: 'none',
                        transformStyle: 'preserve-3d',
                        '--card-perspective': '700px',
                        '--card-z-offset': '12px',
                        '--card-y-offset': '7px',
                        '--card-max-z-index': imageList.length.toString(),
                        '--card-swap-duration': '0.3s',
                    } as React.CSSProperties}
                >
                    {cardOrder.map((originalIndex, displayIndex) => (
                        <article
                            key={`${imageList[originalIndex]}-${originalIndex}`}
                            className="image-card absolute cursor-grab active:cursor-grabbing
                                place-self-center border border-white/20 rounded-xl
                                shadow-2xl overflow-hidden will-change-transform bg-black/50"
                            style={{
                                '--i': (displayIndex + 1).toString(),
                                zIndex: imageList.length - displayIndex,
                                width: cardWidth,
                                height: cardHeight,
                                transform: `perspective(var(--card-perspective))
                                    translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                                    translateY(calc(var(--card-y-offset) * var(--i)))
                                    translateX(var(--swipe-x, 0px))
                                    rotateY(var(--swipe-rotate, 0deg))`
                            } as React.CSSProperties}
                        >
                            <img
                                src={imageList[originalIndex]}
                                alt={`Swiper image ${originalIndex + 1}`}
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable={false}
                            />
                        </article>
                    ))}
                </section>

                {/* Right Arrow */}
                {imageList.length > 1 && (
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-black/50 border border-orange-500/30 text-orange-500 hover:bg-orange-500/20 transition-colors z-20"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Dot Indicators */}
            {imageList.length > 1 && (
                <div className="flex items-center gap-2">
                    {imageList.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-orange-500 scale-125'
                                    : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                    <span className="ml-2 text-xs font-mono text-orange-500/60">
                        {currentIndex + 1} / {imageList.length}
                    </span>
                </div>
            )}
        </div>
    );
};
