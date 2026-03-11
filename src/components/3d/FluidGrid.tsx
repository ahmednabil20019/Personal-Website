import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ProjectPortal } from "./ProjectPortal";

export const FluidGrid = ({ projects, onProjectClick }: any) => {
    const { viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null);

    // Calculate grid layout based on viewport width
    const columns = viewport.width > 10 ? 3 : viewport.width > 6 ? 2 : 1;
    const spacingX = 4;
    const spacingY = 3;

    // Store original positions for spring-back
    const originalPositions = useMemo(() => {
        return projects.map((_: any, i: number) => {
            const row = Math.floor(i / columns);
            const col = i % columns;
            // Center the grid
            const x = (col - (columns - 1) / 2) * spacingX;
            const y = -(row * spacingY) + (Math.ceil(projects.length / columns) * spacingY) / 2 - 2; // Offset to start higher
            return new THREE.Vector3(x, y, 0);
        });
    }, [projects, columns, viewport.width]);

    useFrame((state) => {
        if (!groupRef.current) return;

        const mouse = state.pointer; // Normalized -1 to 1
        // Convert mouse to world space (approximate at z=0)
        const mouseVec = new THREE.Vector3(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, 0);

        groupRef.current.children.forEach((child, i) => {
            const originalPos = originalPositions[i];
            if (!originalPos) return;

            // Calculate distance to mouse
            const dx = mouseVec.x - child.position.x;
            const dy = mouseVec.y - child.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Repulsion force
            const force = Math.max(0, 5 - dist) * 0.5; // Radius 5, strength 0.5
            const angle = Math.atan2(dy, dx);

            const targetX = originalPos.x - Math.cos(angle) * force;
            const targetY = originalPos.y - Math.sin(angle) * force;

            // Lerp to target (Spring back)
            child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 0.1);
            child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, 0.1);

            // Add gentle floating sine wave
            child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.001;
        });
    });

    return (
        <group ref={groupRef}>
            {projects.map((project: any, i: number) => (
                <group key={project.id || i} position={[originalPositions[i]?.x || 0, originalPositions[i]?.y || 0, 0]}>
                    <ProjectPortal
                        project={project}
                        index={i}
                        onClick={() => onProjectClick(project)}
                    />
                </group>
            ))}
        </group>
    );
};
