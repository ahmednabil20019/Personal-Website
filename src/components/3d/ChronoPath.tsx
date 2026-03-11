import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Float, Stars, Line, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { cn } from "@/lib/utils";

export interface JourneyItem {
    _id?: string;
    type: 'work' | 'education' | 'project';
    title: string;
    company: string;
    location?: string;
    year: string;
    period?: string;
    description: string;
    icon?: string;
    color?: string; // hex code
    achievements?: string[];
    technologies?: string[];
}

interface ChronoPathProps {
    items: JourneyItem[];
    onItemClick?: (item: JourneyItem) => void;
}

const RenderIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
    if (!iconName) return <LucideIcons.Briefcase className={className} />;

    const isUrl = iconName.startsWith("http") || iconName.startsWith("/");
    if (isUrl) return <img src={iconName} className={cn("object-contain", className)} alt="" />;

    const isSimple = iconName.startsWith("Si");
    // @ts-ignore
    const IconLib = isSimple ? SimpleIcons : LucideIcons;
    // @ts-ignore
    const IconComp = IconLib[iconName] || LucideIcons.Briefcase;

    return <IconComp className={className} />;
};

const PathNode = ({ item, index, isLeft, onItemClick }: { item: JourneyItem, index: number, isLeft: boolean, onItemClick?: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Pulse animation
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.scale.setScalar(1 + Math.sin(t * 2 + index) * 0.05);
        if (hovered) {
            meshRef.current.rotation.y += 0.05;
        }
    });

    const nodeColor = item.color || (item.type === 'work' ? "#a855f7" : "#06b6d4");

    return (
        <group position={[0, -(index + 1) * 10, 0]}>
            {/* 3D Node */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh
                    ref={meshRef}
                    onClick={() => onItemClick?.(item)}
                    onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                >
                    <sphereGeometry args={[0.6, 32, 32]} />
                    <meshStandardMaterial
                        color={nodeColor}
                        emissive={nodeColor}
                        emissiveIntensity={hovered ? 3 : 1.5}
                        toneMapped={false}
                    />
                </mesh>
                {/* Outer Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.8, 0.85, 64]} />
                    <meshBasicMaterial color={nodeColor} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            </Float>

            {/* Connecting Beam */}
            <Line
                points={[[0, 0, 0], [isLeft ? -3.5 : 3.5, 0, 0]]}
                color={nodeColor}
                lineWidth={2}
                transparent
                opacity={0.3}
            />

            {/* Holographic Card (HTML) */}
            <Html position={[isLeft ? -4 : 4, 0, 0]} center transform distanceFactor={12} style={{ pointerEvents: 'none' }}>
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? 50 : -50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="w-[400px] pointer-events-auto text-left"
                >
                    <div
                        className="relative overflow-hidden rounded-xl backdrop-blur-xl bg-black/80 border transition-all duration-300 group hover:scale-[1.02]"
                        style={{
                            borderColor: `${nodeColor}60`,
                            boxShadow: `0 0 30px ${nodeColor}10`
                        }}
                        onClick={() => onItemClick?.(item)}
                    >
                        {/* Header Gradient */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 opacity-80"
                            style={{ backgroundColor: nodeColor }}
                        />

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-lg shrink-0"
                                        style={{ color: nodeColor }}
                                    >
                                        <RenderIcon iconName={item.icon || "Briefcase"} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-2xl leading-none mb-1.5 drop-shadow-md">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-mono text-cyan-200">{item.year}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                            <span className="text-gray-300 font-medium">{item.company}</span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border bg-black/60 shadow-inner"
                                    style={{ borderColor: `${nodeColor}40`, color: nodeColor }}
                                >
                                    {item.type}
                                </span>
                            </div>

                            <p className="text-base text-gray-300 leading-relaxed mb-5 line-clamp-4 font-light">
                                {item.description}
                            </p>

                            {/* Tech Stack */}
                            {item.technologies && item.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                                    {item.technologies.slice(0, 5).map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 group-hover:text-white transition-colors group-hover:border-white/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {item.technologies.length > 5 && (
                                        <span className="text-xs px-2.5 py-1 text-gray-500">+{item.technologies.length - 5}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Html>
        </group>
    );
}

const Path = ({ items, onItemClick }: ChronoPathProps) => {
    const curve = useMemo(() => {
        const points = [];
        points.push(new THREE.Vector3(0, 2, 0)); // Start buffer
        for (let i = 0; i < items.length; i++) {
            points.push(new THREE.Vector3(0, -(i + 1) * 10, 0));
        }
        points.push(new THREE.Vector3(0, -(items.length + 1) * 10, 0)); // End buffer
        return new THREE.CatmullRomCurve3(points);
    }, [items]);

    const linePoints = useMemo(() => curve.getPoints(200), [curve]);

    return (
        <group>
            {/* The Main Glowing Path */}
            <Line points={linePoints} color="white" lineWidth={1} transparent opacity={0.2} />
            <Line points={linePoints} color="#4f46e5" lineWidth={3} transparent opacity={0.1} />

            {/* Ambient Particles */}
            <Sparkles count={100} scale={20} size={2} speed={0.4} opacity={0.2} color="#ffffff" />

            {items.map((item, i) => (
                <PathNode
                    key={item._id || i}
                    item={item}
                    index={i}
                    isLeft={i % 2 === 0}
                    onItemClick={onItemClick}
                />
            ))}
        </group>
    );
};

const ScrollBasedCamera = ({ items }: { items: JourneyItem[] }) => {
    const scroll = useScroll();
    useFrame((state) => {
        const scrollOffset = scroll.offset; // 0 to 1
        // Calculate dynamic height based on item count
        const totalHeight = (items.length + 1) * 10;
        const targetY = -(scrollOffset * totalHeight);

        // Smooth camera movement
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);

        // Dynamic LookAt (look slightly down the path)
        const lookAtY = targetY - 10;
        state.camera.lookAt(0, lookAtY, 0);
    });
    return null;
}

export const ChronoPath = ({ items, onItemClick }: ChronoPathProps) => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }} gl={{ antialias: true, alpha: true }}>
                <ScrollControls pages={Math.max(2, items.length * 0.5) /* Dynamic pages */} damping={0.4} distance={1}>
                    <fog attach="fog" args={['#000000', 5, 40]} />

                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
                    <pointLight position={[-10, -50, 10]} intensity={1} color="#06b6d4" />

                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

                    <ScrollBasedCamera items={items} />
                    <Path items={items} onItemClick={onItemClick} />
                </ScrollControls>
            </Canvas>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 animate-bounce opacity-50">
                <p className="text-[10px] text-white uppercase tracking-[0.2em] font-mono">Scroll to Explore</p>
            </div>
        </div>
    );
};
