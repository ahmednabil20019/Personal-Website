import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, ScrollControls, useScroll, Line, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const WarpTunnel = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[10, 10, 100, 32, 1, true]} />
            <meshBasicMaterial color="#4c1d95" wireframe transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>
    );
};

const TimelineItem = ({ position, year, title, description, index, scrollRef, totalItems }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (groupRef.current && scrollRef.current !== undefined) {
            const scroll = scrollRef.current;
            
            // Each item has a "zone" in the scroll progress
            const itemZone = index / totalItems;
            const nextZone = (index + 1) / totalItems;
            
            // Calculate how far through this item's zone we are
            let itemProgress = 0;
            if (scroll >= itemZone && scroll <= nextZone) {
                itemProgress = (scroll - itemZone) / (nextZone - itemZone);
            } else if (scroll > nextZone) {
                itemProgress = 1;
            }

            // Smooth "fly-in" effect: items come from far away and approach camera
            const zPos = position[2] + (1 - itemProgress) * 50;
            
            // Spiral rotation as items approach
            groupRef.current.position.z = zPos;
            groupRef.current.rotation.y = scroll * Math.PI * 2;
            groupRef.current.rotation.x = itemProgress * Math.PI * 0.5;

            // Scale based on proximity to camera
            const dist = Math.abs(zPos - 5);
            const scale = THREE.MathUtils.clamp(1 - dist / 15, 0.3, 1);
            groupRef.current.scale.setScalar(scale);

            // Glow effect on active item
            if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
                const emissiveIntensity = itemProgress > 0.5 ? 1.2 : 0.5;
                meshRef.current.material.emissiveIntensity = emissiveIntensity;
            }
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
                {/* Planet/Node with glow */}
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[0.8, 2]} />
                    <meshStandardMaterial 
                        color="#64ffda" 
                        emissive="#64ffda" 
                        emissiveIntensity={0.8}
                        wireframe={false}
                        metalness={0.3}
                        roughness={0.4}
                    />
                </mesh>

                {/* Outer glow ring */}
                <mesh>
                    <torusGeometry args={[1.2, 0.1, 16, 32]} />
                    <meshBasicMaterial color="#64ffda" transparent opacity={0.6} />
                </mesh>

                {/* Inner Core */}
                <mesh>
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                {/* Text Content */}
                <Text
                    position={[1.5, 0.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="left"
                    anchorY="middle"
                >
                    {year}
                </Text>
                <Text
                    position={[1.5, 0, 0]}
                    fontSize={0.3}
                    color="#bd93f9"
                    anchorX="left"
                    anchorY="top"
                    maxWidth={4}
                >
                    {title}
                </Text>
                <Text
                    position={[1.5, -0.5, 0]}
                    fontSize={0.2}
                    color="#a1a1aa"
                    anchorX="left"
                    anchorY="top"
                    maxWidth={4}
                >
                    {description}
                </Text>
            </Float>
        </group>
    );
};

const CosmicTimeline = ({ items, scrollRef }: { items: any[], scrollRef: any }) => {
    const totalItems = items.length;
    return (
        <group>
            {items.map((item, i) => (
                <TimelineItem
                    key={i}
                    index={i}
                    scrollRef={scrollRef}
                    totalItems={totalItems}
                    position={[
                        Math.sin(i * Math.PI * 0.5) * 3, // Spiral X
                        Math.cos(i * Math.PI * 0.5) * 3, // Spiral Y
                        -i * 20 - 10                     // Depth spacing (spread out more)
                    ]}
                    year={item.date}
                    title={item.title}
                    description={item.description}
                />
            ))}
        </group>
    );
};

export const JourneyScene3D = ({ items, scrollRef }: { items: any[], scrollRef: any }) => {
    return (
        <div className="h-full w-full absolute inset-0 pointer-events-auto">
            <Canvas 
                camera={{ position: [0, 0, 5], fov: 60 }} 
                gl={{ alpha: true }}
                style={{ pointerEvents: 'auto' }}
                eventSource={typeof window !== 'undefined' ? document.body : undefined}
            >
                {/* Removed background color to allow transparency if needed, or keep it if "Void" is separate */}
                {/* <color attach="background" args={['#000000']} /> */}
                <fog attach="fog" args={['#000000', 5, 30]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
                <Sparkles count={500} scale={12} size={2} speed={0.4} opacity={0.5} color="#64ffda" />
                <WarpTunnel />

                <CosmicTimeline items={items} scrollRef={scrollRef} />
            </Canvas>
        </div>
    );
};
