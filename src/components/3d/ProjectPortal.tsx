import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, Text, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion-3d";

export const ProjectPortal = ({ project, index, onClick }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Animation for hover state
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Floating animation
            groupRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;

            // Tilt on hover
            const targetRotation = hovered ? 0.1 : 0;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation, delta * 5);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, hovered ? 0.1 : 0, delta * 5);
        }
    });

    return (
        <group
            ref={groupRef}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Portal Frame */}
            <mesh position={[0, 0, -0.1]}>
                <boxGeometry args={[3.2, 2.2, 0.2]} />
                <meshStandardMaterial
                    color={hovered ? "#4c1d95" : "#1e1e1e"}
                    emissive={hovered ? "#4c1d95" : "#000000"}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Project Image (Parallax Window) */}
            <Image
                url={project.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"}
                scale={[3, 2]}
                position={[0, 0, 0.05]}
                transparent
                opacity={hovered ? 1 : 0.8}
            />

            {/* Glitch Overlay (Simple Wireframe for now, shader later) */}
            {hovered && (
                <mesh position={[0, 0, 0.1]}>
                    <planeGeometry args={[3, 2, 10, 10]} />
                    <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.1} />
                </mesh>
            )}

            {/* Title Text */}
            <Text
                position={[0, -1.3, 0.1]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="top"
            >
                {project.title}
            </Text>

            {/* Tech Stack Tags */}
            <group position={[0, -1.6, 0.1]}>
                {project.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <Text
                        key={i}
                        position={[(i - 1) * 0.8, 0, 0]}
                        fontSize={0.1}
                        color="#a1a1aa"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {tag}
                    </Text>
                ))}
            </group>
        </group>
    );
};
