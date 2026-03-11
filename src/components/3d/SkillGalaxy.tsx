import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

interface SkillNode {
    _id: string;
    name: string;
    category: string;
    level: string;
    position?: [number, number, number];
}

interface SkillGalaxyProps {
    skills: SkillNode[];
    onSkillClick?: (skill: SkillNode) => void;
}

const SkillStar = ({ skill, onClick }: { skill: SkillNode; onClick?: () => void }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Random initial rotation speed
    const rotSpeed = useMemo(() => (Math.random() - 0.5) * 0.02, []);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += rotSpeed;
            meshRef.current.rotation.z += rotSpeed * 0.5;
        }
    });

    const color = useMemo(() => {
        switch (skill.category) {
            case "Frontend": return "#38bdf8"; // Cyan
            case "Backend": return "#a855f7"; // Purple
            case "Tools": return "#f472b6"; // Pink
            default: return "#ffffff";
        }
    }, [skill.category]);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <group onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                >
                    <sphereGeometry args={[hovered ? 0.3 : 0.2, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        toneMapped={false}
                    />
                </mesh>

                {/* Glowing Aura (Billboard) */}
                <sprite scale={[1.5, 1.5, 1.5]}>
                    <spriteMaterial
                        attach="material"
                        map={new THREE.TextureLoader().load("https://assets.codepen.io/127738/glow.png")} // Fallback or generate texture
                        color={color}
                        transparent
                        opacity={0.4}
                        blending={THREE.AdditiveBlending}
                    />
                </sprite>

                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="black"
                >
                    {skill.name}
                </Text>
            </group>
        </Float>
    );
};

export const SkillGalaxy = ({ skills, onSkillClick }: SkillGalaxyProps) => {
    // Distribute skills in a spherical cloud
    const skillPositions = useMemo(() => {
        return skills.map((skill) => {
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            const radius = 4 + Math.random() * 2; // Radius between 4 and 6

            return {
                ...skill,
                position: [
                    radius * Math.cos(theta) * Math.sin(phi),
                    radius * Math.sin(theta) * Math.sin(phi),
                    radius * Math.cos(phi)
                ] as [number, number, number]
            };
        });
    }, [skills]);

    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <group>
                    {skillPositions.map((skill, i) => (
                        <group key={skill._id} position={skill.position}>
                            <SkillStar skill={skill} onClick={() => onSkillClick?.(skill)} />
                            {/* Connect lines to center or similar categories could go here */}
                        </group>
                    ))}
                </group>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxDistance={20}
                    minDistance={2}
                />
            </Canvas>

            <div className="absolute bottom-4 left-4 pointer-events-none">
                <p className="text-xs text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                    Drag to rotate • Scroll to zoom • Click stars to edit
                </p>
            </div>
        </div>
    );
};
