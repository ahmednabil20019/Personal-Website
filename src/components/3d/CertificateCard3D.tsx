import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const Monolith = ({ certificate, index, position }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Hover animation: Tilt and Glow
            const targetRotX = hovered ? -0.1 : 0;
            const targetRotY = hovered ? 0.1 : 0;
            const targetY = hovered ? position[1] + 0.2 : position[1];

            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, delta * 4);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, delta * 4);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 4);

            // Pulse emissive intensity
            if (hovered) {
                (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
            } else {
                (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = THREE.MathUtils.lerp((meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity, 0, delta * 4);
            }
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                    onClick={() => window.open(certificate.link, "_blank")}
                >
                    {/* Tall Monolith Shape */}
                    <boxGeometry args={[2.2, 3.5, 0.2]} />
                    <meshPhysicalMaterial
                        color={hovered ? "#bd93f9" : "#ffffff"}
                        emissive="#bd93f9"
                        emissiveIntensity={0}
                        transparent
                        opacity={0.15}
                        roughness={0.1}
                        metalness={0.8}
                        transmission={0.6}
                        thickness={2}
                        side={THREE.DoubleSide}
                    />

                    {/* Inner Content */}
                    <group position={[0, 0, 0.05]}>
                        <Text
                            position={[0, 1.2, 0]}
                            fontSize={0.15}
                            color="#bd93f9"
                            anchorX="center"
                            anchorY="top"
                            letterSpacing={0.1}
                        >
                            CERTIFICATION
                        </Text>

                        <Text
                            position={[0, 0.2, 0]}
                            fontSize={0.25}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={1.8}
                            textAlign="center"
                        >
                            {certificate.name}
                        </Text>

                        <Text
                            position={[0, -1.2, 0]}
                            fontSize={0.12}
                            color="#a1a1aa"
                            anchorX="center"
                            anchorY="bottom"
                        >
                            {certificate.issuer}
                        </Text>

                        {/* Decorative Line */}
                        <mesh position={[0, 0.8, 0]}>
                            <boxGeometry args={[0.5, 0.02, 0.01]} />
                            <meshBasicMaterial color="#bd93f9" />
                        </mesh>
                    </group>
                </mesh>

                {/* Hover Sparkles */}
                {hovered && (
                    <Sparkles count={20} scale={[2.5, 4, 1]} size={2} speed={0.4} opacity={0.5} color="#bd93f9" />
                )}
            </Float>
        </group>
    );
};

export const CertificateCard3D = ({ certificates }: { certificates: any[] }) => {
    return (
        <div className="h-[70vh] w-full">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <fog attach="fog" args={['#000000', 5, 20]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
                <pointLight position={[-10, -5, -5]} intensity={0.5} color="#bd93f9" />

                {/* Center the carousel */}
                <group position={[0, 0, 0]}>
                    {/* If many certificates, we could wrap in ScrollControls, but for < 5, centering is fine */}
                    {certificates.map((cert, i) => (
                        <Monolith
                            key={i}
                            certificate={cert}
                            index={i}
                            position={[(i - (certificates.length - 1) / 2) * 2.8, 0, 0]}
                        />
                    ))}
                </group>
            </Canvas>
        </div>
    );
};
