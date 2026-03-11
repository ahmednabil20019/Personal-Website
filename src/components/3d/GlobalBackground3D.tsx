import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

const generateSpherePoints = (count: number, radius: number) => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;

        points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
};

const Stars = (props: any) => {
    const ref = useRef<any>();
    // Reduced from 5000 → 2000 (imperceptible at size 0.002)
    const [sphere] = useState(() => generateSpherePoints(2000, 1.5));
    const { currentTheme } = useTheme();
    const elapsed = useRef(0);

    // Throttle to ~15fps instead of 60fps
    useFrame((_state, delta) => {
        elapsed.current += delta;
        if (elapsed.current < 0.066) return; // ~15fps
        elapsed.current = 0;

        if (ref.current) {
            ref.current.rotation.x -= 0.066 / 15;
            ref.current.rotation.y -= 0.066 / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color={currentTheme.primary}
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

export const GlobalBackground3D = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-black pointer-events-none transition-colors duration-1000">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={1} frameloop="always">
                <Stars />
            </Canvas>
        </div>
    );
};
