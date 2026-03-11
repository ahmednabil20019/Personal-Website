import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselItem {
    id: string | number;
    url: string;
    title?: string;
    type?: 'image' | 'video';
    thumbnail?: string; // Optional thumbnail for videos
}

interface ThumbnailCarouselProps {
    items: CarouselItem[];
    className?: string;
    initialIndex?: number;
}

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

function Thumbnails({
    items,
    index,
    setIndex
}: {
    items: CarouselItem[],
    index: number,
    setIndex: (i: number) => void
}) {
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (thumbnailsRef.current) {
            let scrollPosition = 0;
            for (let i = 0; i < index; i++) {
                scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
            }

            scrollPosition += MARGIN_PX;

            const containerWidth = thumbnailsRef.current.offsetWidth;
            const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
            scrollPosition -= centerOffset;

            thumbnailsRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
        }
    }, [index]);

    return (
        <div
            ref={thumbnailsRef}
            className='overflow-x-auto py-2'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            <div className='flex gap-0.5 h-16 md:h-20' style={{ width: 'fit-content' }}>
                {items.map((item, i) => (
                    <motion.button
                        key={item.id}
                        onClick={() => setIndex(i)}
                        initial={false}
                        animate={i === index ? 'active' : 'inactive'}
                        variants={{
                            active: {
                                width: FULL_WIDTH_PX,
                                marginLeft: MARGIN_PX,
                                marginRight: MARGIN_PX,
                                opacity: 1
                            },
                            inactive: {
                                width: COLLAPSED_WIDTH_PX,
                                marginLeft: 0,
                                marginRight: 0,
                                opacity: 0.6
                            },
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={cn(
                            'relative shrink-0 h-full overflow-hidden rounded-md border border-white/5 bg-black/40',
                            i === index ? 'ring-2 ring-primary ring-offset-1 ring-offset-black' : 'hover:opacity-80'
                        )}
                    >
                        {item.type === 'video' || (item.url && /\.(mp4|webm|mov)$/i.test(item.url)) ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <Play className="w-4 h-4 text-white/70" />
                                {/* Optional: Add video thumbnail here if available */}
                            </div>
                        ) : (
                            <img
                                src={item.url}
                                alt={item.title || `Thumbnail ${i + 1}`}
                                className='w-full h-full object-cover pointer-events-none select-none'
                                draggable={false}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

export function ThumbnailCarousel({ items, className, initialIndex = 0 }: ThumbnailCarouselProps) {
    const [index, setIndex] = useState(initialIndex);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const x = useMotionValue(0);

    // Reset video playback and zoom when changing slides
    useEffect(() => {
        setIsPlaying(false);
        setZoom(1);
        videoRefs.current.forEach(video => {
            if (video) video.pause();
        });
    }, [index, isLightboxOpen]);

    useEffect(() => {
        if (!isDragging && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth || 1;
            const targetX = -index * containerWidth;

            animate(x, targetX, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            });
        }
    }, [index, x, isDragging]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
            if (e.key === 'ArrowRight') setIndex((i) => Math.min(items.length - 1, i + 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, items.length]);

    const toggleVideo = (idx: number) => {
        const video = videoRefs.current[idx];
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleMainSlideClick = (idx: number) => {
        if (!isDragging) {
            setIsLightboxOpen(true);
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <>
            <div className={cn('w-full flex flex-col gap-4', className)}>
                {/* Main Display */}
                <div
                    className='relative overflow-hidden rounded-xl bg-black border border-white/10 shadow-2xl aspect-video group cursor-zoom-in'
                    ref={containerRef}
                    onClick={() => handleMainSlideClick(index)}
                >
                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/10 transform scale-90 group-hover:scale-100 duration-200">
                            <ZoomIn size={16} />
                            <span className="text-sm font-medium">View Fullscreen</span>
                        </div>
                    </div>

                    <motion.div
                        className='flex h-full'
                        drag='x'
                        dragElastic={0.2}
                        dragMomentum={false}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(e, info) => {
                            setIsDragging(false);
                            const containerWidth = containerRef.current?.offsetWidth || 1;
                            const offset = info.offset.x;
                            const velocity = info.velocity.x;

                            let newIndex = index;

                            // If fast swipe, use velocity
                            if (Math.abs(velocity) > 500) {
                                newIndex = velocity > 0 ? index - 1 : index + 1;
                            }
                            // Otherwise use offset threshold (30% of container width)
                            else if (Math.abs(offset) > containerWidth * 0.3) {
                                newIndex = offset > 0 ? index - 1 : index + 1;
                            }

                            // Clamp index
                            newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
                            setIndex(newIndex);
                        }}
                        style={{ x }}
                    >
                        {items.map((item, i) => {
                            const isVideo = item.type === 'video' || (item.url && /\.(mp4|webm|mov)$/i.test(item.url));
                            return (
                                <div key={item.id} className='shrink-0 w-full h-full relative flex items-center justify-center bg-zinc-950'>
                                    {isVideo ? (
                                        <div className="relative w-full h-full">
                                            <video
                                                ref={el => videoRefs.current[i] = el}
                                                src={item.url}
                                                className="w-full h-full object-contain pointer-events-none"
                                                playsInline
                                                onEnded={() => setIsPlaying(false)}
                                            />
                                            {/* Overlay for video to allow drag but show controls */}
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                {!isPlaying && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleVideo(i);
                                                        }}
                                                        className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group z-30"
                                                    >
                                                        <Play className="w-6 h-6 text-white fill-white/20 ml-1" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Video Controls Bar */}
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity z-30 flex items-center gap-4"
                                            >
                                                <button onClick={() => toggleVideo(i)} className="text-white hover:text-primary">
                                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                                </button>
                                                <div className="text-white/70 text-xs font-mono truncate">{item.title || 'Video'}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.title || ''}
                                            className='w-full h-full object-contain select-none pointer-events-none'
                                            draggable={false}
                                        />
                                    )}
                                    {/* Item Count / Title Overlay */}
                                    <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/70 border border-white/5 z-20 pointer-events-none'>
                                        {i + 1} / {items.length}
                                    </div>

                                    {item.title && !isVideo && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                                            <h3 className="text-white font-medium text-lg">{item.title}</h3>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Previous Button */}
                    <button
                        disabled={index === 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex((i) => Math.max(0, i - 1));
                        }}
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all z-20 border border-white/10 backdrop-blur-md",
                            index === 0
                                ? 'opacity-0 cursor-not-allowed pointer-events-none'
                                : 'bg-black/40 hover:bg-white text-white hover:text-black hover:scale-110'
                        )}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Next Button */}
                    <button
                        disabled={index === items.length - 1}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex((i) => Math.min(items.length - 1, i + 1));
                        }}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all z-20 border border-white/10 backdrop-blur-md",
                            index === items.length - 1
                                ? 'opacity-0 cursor-not-allowed pointer-events-none'
                                : 'bg-black/40 hover:bg-white text-white hover:text-black hover:scale-110'
                        )}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <Thumbnails items={items} index={index} setIndex={setIndex} />
            </div>

            {/* Lightbox Overlay */}
            {isLightboxOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLightboxOpen(false);
                            setZoom(1);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 z-[70] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer pointer-events-auto"
                        >
                            <X size={24} />
                        </button>

                        {/* Zoom Controls */}
                        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-[70] flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoom(z => Math.min(z + 0.5, 3));
                                }}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer pointer-events-auto"
                            >
                                <ZoomIn size={24} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoom(z => Math.max(z - 0.5, 1));
                                }}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer pointer-events-auto"
                            >
                                <ZoomOut size={24} />
                            </button>
                        </div>

                        {/* Content Content (Moved First in DOM to sit behind controls) */}
                        <motion.div
                            key={items[index].id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: zoom, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full max-w-7xl max-h-[75vh] flex items-center justify-center mb-32 z-10 pointer-events-auto"
                            drag={zoom > 1}
                            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} // Loose constraints for panning
                            dragElastic={0.2}
                            onClick={(e) => e.stopPropagation()} // Prevent close on content click
                            onPointerDown={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setZoom(prev => prev > 1 ? 1 : 2);
                            }}
                            style={{ cursor: zoom > 1 ? 'grab' : 'zoom-in' }}
                        >
                            {items[index].type === 'video' || (items[index].url && /\.(mp4|webm|mov)$/i.test(items[index].url)) ? (
                                <video
                                    src={items[index].url}
                                    className="w-full h-full object-contain max-h-[75vh] rounded-md shadow-2xl bg-black"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={items[index].url}
                                    alt={items[index].title || ''}
                                    className="w-full h-full object-contain max-h-[75vh] rounded-md shadow-2xl"
                                />
                            )}

                            {/* Caption */}
                            {items[index].title && (
                                <div className="absolute bottom-[-2rem] left-0 right-0 text-center text-white/80 font-medium">
                                    {items[index].title} <span className="text-white/40 ml-2 text-sm">({index + 1}/{items.length})</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Navigation Buttons (Moved After Content) */}
                        <div
                            className={cn(
                                "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full flex items-center justify-center transition-all z-[60] cursor-pointer pointer-events-auto",
                                index === 0
                                    ? 'opacity-20 cursor-not-allowed hidden'
                                    : 'bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-sm'
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (index > 0) setIndex((i) => Math.max(0, i - 1));
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </div>

                        <div
                            className={cn(
                                "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full flex items-center justify-center transition-all z-[60] cursor-pointer pointer-events-auto",
                                index === items.length - 1
                                    ? 'opacity-20 cursor-not-allowed hidden'
                                    : 'bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-sm'
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (index < items.length - 1) setIndex((i) => Math.min(items.length - 1, i + 1));
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </div>

                        {/* Thumbnails in Lightbox */}
                        <div
                            className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/90 to-transparent z-[60] h-32 items-center pointer-events-none"
                        >
                            <div className="w-full max-w-2xl px-4 pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <Thumbnails items={items} index={index} setIndex={setIndex} />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
