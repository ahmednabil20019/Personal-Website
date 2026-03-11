import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, useCursor, Image } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";

export const CrystalArtifact = ({ certificate, index, position, onClick }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Spring animation for hover
    const { scale, rotationY, positionY } = useSpring({
        scale: hovered ? 1.1 : 1,
        rotationY: hovered ? Math.PI / 4 : 0,
        positionY: hovered ? position[1] + 0.5 : position[1],
        config: config.wobbly
    });

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle floating and rotation
            meshRef.current.rotation.y += 0.002;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
        }
    });

    return (
        <animated.group
            position={[position[0], positionY, position[2]]}
            scale={scale}
            rotation-y={rotationY}
            onClick={(e) => { e.stopPropagation(); onClick(certificate); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* The Crystal Monolith */}
            <mesh ref={meshRef}>
                {/* Octahedron or custom prism shape */}
                <cylinderGeometry args={[0.8, 0.8, 2.5, 6]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={1}
                    thickness={0.5}
                    chromaticAberration={0.1}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    iridescence={1}
                    iridescenceIOR={1}
                    iridescenceThicknessRange={[0, 1400]}
                    roughness={0.1}
                    clearcoat={1}
                    color="#ffffff"
                />
            </mesh>

            {/* Internal "Hologram" Content */}
            <group scale={[0.8, 0.8, 0.8]}>
                <Image
                    url={certificate.image || "https://images.unsplash.com/photo-1589330694653-4a8b2436a223?w=800&q=80"}
                    scale={[1.2, 1.6]}
                    position={[0, 0, 0]}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />

                {/* Glowing Border/Frame inside */}
                <mesh>
                    <boxGeometry args={[1.3, 1.7, 0.05]} />
                    <meshBasicMaterial color={hovered ? "#ffd700" : "#ffffff"} wireframe transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Label (Floating outside) */}
            <Text
                position={[0, -1.8, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="top"
                maxWidth={2}
                textAlign="center"
            >
                {certificate.title}
            </Text>
        </animated.group>
    );
};
