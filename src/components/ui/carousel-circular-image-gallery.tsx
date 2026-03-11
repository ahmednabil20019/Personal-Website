"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { ElementRef } from "react"
// Add gsap types if available, otherwise declare global
declare global {
    interface Window {
        gsap: any;
        MotionPathPlugin: any;
    }
}

export interface ImageData {
    title: string
    url: string
}

const defaultImages: ImageData[] = [
    {
        title: "Mini canine",
        url: "https://images.unsplash.com/photo-1583551536442-0fc55ac443f6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
        title: "Wheely tent",
        url: "https://images.unsplash.com/photo-1583797227225-4233106c5a2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
        title: "Red food things",
        url: "https://images.unsplash.com/photo-1561626450-730502dba332?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
        title: "Sand boat",
        url: "https://images.unsplash.com/photo-1585221454166-ce690e60465f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
        title: "Screen thing",
        url: "https://images.unsplash.com/photo-1585427795543-33cf23ea2853?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
    {
        title: "Horse tornado",
        url: "https://images.unsplash.com/photo-1507160874687-6fe86a78b22e?ixlib?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&h=600&fit=min&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
    },
]

interface ImageGalleryProps {
    images?: ImageData[]
}

// Main component for the Image Gallery
export function ImageGallery({ images = defaultImages }: ImageGalleryProps) {
    const [opened, setOpened] = useState(0)
    const [inPlace, setInPlace] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [gsapReady, setGsapReady] = useState(false)
    const autoplayTimer = useRef<number | null>(null)

    useEffect(() => {
        // This effect loads the GSAP library and its plugin from a CDN.
        const loadScripts = () => {
            if (window.gsap && window.MotionPathPlugin) {
                window.gsap.registerPlugin(window.MotionPathPlugin)
                setGsapReady(true)
                return
            }

            const gsapScript = document.createElement("script")
            gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
            gsapScript.onload = () => {
                const motionPathScript = document.createElement("script")
                motionPathScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"
                motionPathScript.onload = () => {
                    if (window.gsap && window.MotionPathPlugin) {
                        window.gsap.registerPlugin(window.MotionPathPlugin)
                        setGsapReady(true)
                    }
                }
                document.body.appendChild(motionPathScript)
            }
            document.body.appendChild(gsapScript)
        }

        loadScripts()
    }, [])

    const onClick = (index: number) => {
        if (!disabled) setOpened(index)
    }

    const onInPlace = (index: number) => setInPlace(index)

    const next = useCallback(() => {
        setOpened((currentOpened) => {
            let nextIndex = currentOpened + 1
            if (nextIndex >= images.length) nextIndex = 0
            return nextIndex
        })
    }, [images.length])

    const prev = useCallback(() => {
        setOpened((currentOpened) => {
            let prevIndex = currentOpened - 1
            if (prevIndex < 0) prevIndex = images.length - 1
            return prevIndex
        })
    }, [images.length])

    // Disable clicks during animation transitions
    useEffect(() => setDisabled(true), [opened])
    useEffect(() => setDisabled(false), [inPlace])

    // Autoplay and timer reset logic
    useEffect(() => {
        if (!gsapReady) return

        if (autoplayTimer.current) {
            clearInterval(autoplayTimer.current)
        }

        autoplayTimer.current = window.setInterval(next, 4500)

        return () => {
            if (autoplayTimer.current) {
                clearInterval(autoplayTimer.current)
            }
        }
    }, [opened, gsapReady, next])

    return (
        <div className="flex items-center justify-center min-h-[400px] font-sans w-full h-full relative">
            <div className="relative h-[80vmin] w-[80vmin] max-h-[600px] max-w-[600px] overflow-hidden rounded-[20px]">
                {gsapReady &&
                    images.map((image, i) => (
                        <div
                            key={image.url}
                            className="absolute left-0 top-0 h-full w-full"
                            style={{ zIndex: inPlace === i ? i : images.length + 1 }}
                        >
                            <GalleryImage
                                total={images.length}
                                id={i}
                                url={image.url}
                                title={image.title}
                                open={opened === i}
                                inPlace={inPlace === i}
                                onInPlace={onInPlace}
                            />
                        </div>
                    ))}
                <div className="absolute left-0 top-0 z-[100] h-full w-full pointer-events-none">
                    <Tabs images={images} onSelect={onClick} />
                </div>
            </div>

            <button
                className="absolute left-4 top-1/2 z-[101] flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 hover:bg-black/60 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={prev}
                disabled={disabled}
                aria-label="Previous Image"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:-translate-x-0.5"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <button
                className="absolute right-4 top-1/2 z-[101] flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 hover:bg-black/60 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={next}
                disabled={disabled}
                aria-label="Next Image"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    )
}

interface GalleryImageProps {
    url: string
    title: string
    open: boolean
    inPlace: boolean
    id: number
    onInPlace: (id: number) => void
    total: number
}

function GalleryImage({ url, title, open, inPlace, id, onInPlace, total }: GalleryImageProps) {
    const [firstLoad, setLoaded] = useState(true)
    const clip = useRef<SVGCircleElement>(null)

    // --- Animation Constants ---
    const gap = 10
    const circleRadius = 7
    const defaults = { transformOrigin: "center center" }
    const duration = 0.4
    const width = 400
    const height = 400
    const scale = 700

    const bigSize = circleRadius * scale
    const overlap = 0

    // --- Position Calculation Functions ---
    const getPosSmall = () => ({
        cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
        cy: height - 30,
        r: circleRadius,
    })
    const getPosSmallAbove = () => ({
        cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
        cy: height / 2,
        r: circleRadius * 2,
    })
    const getPosCenter = () => ({ cx: width / 2, cy: height / 2, r: circleRadius * 7 })
    const getPosEnd = () => ({ cx: width / 2 - bigSize + overlap, cy: height / 2, r: bigSize })
    const getPosStart = () => ({ cx: width / 2 + bigSize - overlap, cy: height / 2, r: bigSize })

    // --- Animation Logic ---
    useEffect(() => {
        const gsap = window.gsap
        if (!gsap) return // Guard against GSAP not being loaded yet

        setLoaded(false)
        if (clip.current) {
            const flipDuration = firstLoad ? 0 : duration
            const upDuration = firstLoad ? 0 : 0.2
            const bounceDuration = firstLoad ? 0.01 : 1
            const delay = firstLoad ? 0 : flipDuration + upDuration

            if (open) {
                gsap
                    .timeline()
                    .set(clip.current, { ...defaults, ...getPosSmall() })
                    .to(clip.current, {
                        ...defaults,
                        ...getPosCenter(),
                        duration: upDuration,
                        ease: "power3.inOut",
                    })
                    .to(clip.current, {
                        ...defaults,
                        ...getPosEnd(),
                        duration: flipDuration,
                        ease: "power4.in",
                        onComplete: () => onInPlace(id),
                    })
            } else {
                gsap
                    .timeline({ overwrite: true })
                    .set(clip.current, { ...defaults, ...getPosStart() })
                    .to(clip.current, {
                        ...defaults,
                        ...getPosCenter(),
                        delay: delay,
                        duration: flipDuration,
                        ease: "power4.out",
                    })
                    .to(clip.current, {
                        ...defaults,
                        motionPath: {
                            path: [getPosSmallAbove(), getPosSmall()],
                            curviness: 1,
                        },
                        duration: bounceDuration,
                        ease: "bounce.out",
                    })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
        >
            <defs>
                <clipPath id={`${id}_circleClip`}>
                    <circle className="clip" cx="0" cy="0" r={circleRadius} ref={clip}></circle>
                </clipPath>
                <clipPath id={`${id}_squareClip`}>
                    <rect className="clip" width={width} height={height}></rect>
                </clipPath>
            </defs>
            <g clipPath={`url(#${id}${inPlace ? "_squareClip" : "_circleClip"})`}>
                <image width={width} height={height} href={url} className="pointer-events-none" preserveAspectRatio="xMidYMid slice"></image>
            </g>
        </svg>
    )
}

interface TabsProps {
    images: ImageData[]
    onSelect: (index: number) => void
}

function Tabs({ images, onSelect }: TabsProps) {
    const gap = 10
    const circleRadius = 7
    const width = 400
    const height = 400

    const getPosX = (i: number) =>
        width / 2 - (images.length * (circleRadius * 2 + gap) - gap) / 2 + i * (circleRadius * 2 + gap)
    const getPosY = () => height - 30

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
        >
            {images.map((image, i) => (
                <g key={image.url} className="pointer-events-auto">
                    <defs>
                        <clipPath id={`tab_${i}_clip`}>
                            <circle cx={getPosX(i)} cy={getPosY()} r={circleRadius} />
                        </clipPath>
                    </defs>
                    <image
                        x={getPosX(i) - circleRadius}
                        y={getPosY() - circleRadius}
                        width={circleRadius * 2}
                        height={circleRadius * 2}
                        href={image.url}
                        clipPath={`url(#tab_${i}_clip)`}
                        className="pointer-events-none"
                        preserveAspectRatio="xMidYMid slice"
                    />
                    <circle
                        onClick={() => onSelect(i)}
                        className="cursor-pointer fill-white/0 stroke-white/70 hover:stroke-white/100 transition-all"
                        strokeWidth="2"
                        cx={getPosX(i)}
                        cy={getPosY()}
                        r={circleRadius + 2}
                    />
                </g>
            ))}
        </svg>
    )
}
