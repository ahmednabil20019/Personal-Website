import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Text3D, Center, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const FloatingShape = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={1.5}>
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.1}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    iridescence={1}
                    iridescenceIOR={1}
                    iridescenceThicknessRange={[0, 1400]}
                />
            </mesh>
        </Float>
    );
};

export const HeroScene3D = () => {
    return (
        <div className="h-[50vh] w-full md:h-full absolute inset-0 -z-10 md:z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <FloatingShape />
            </Canvas>
        </div>
    );
};
