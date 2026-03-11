import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholderClassName?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export const LazyImage = ({
    src,
    alt,
    className,
    placeholderClassName,
    onLoad,
    onError,
}: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    return (
        <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
            {/* Placeholder/Skeleton */}
            {!isLoaded && !hasError && (
                <div
                    className={cn(
                        'absolute inset-0 bg-white/5 animate-pulse',
                        placeholderClassName
                    )}
                />
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}

            {/* Actual Image */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                />
            )}
        </div>
    );
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

// Preload multiple images
export const preloadImages = (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(preloadImage));
};
