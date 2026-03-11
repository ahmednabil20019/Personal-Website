import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

// --- Shader Code ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uScroll;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Dynamic movement
  float noise = snoise(uv * 3.0 + uTime * 0.1 + uScroll * 2.0);
  float noise2 = snoise(uv * 6.0 - uTime * 0.2);
  
  // Mix noise layers
  float finalNoise = (noise + noise2 * 0.5) / 1.5;
  
  // Color mixing based on scroll and noise
  vec3 baseColor = mix(uColor1, uColor2, uv.y + finalNoise * 0.2);
  vec3 finalColor = mix(baseColor, uColor3, finalNoise * uScroll);
  
  // Vignette
  float dist = distance(uv, vec2(0.5));
  float vignette = smoothstep(0.8, 0.2, dist);
  
  gl_FragColor = vec4(finalColor * vignette, 1.0);
}
`;

const BackgroundPlane = ({ scrollYProgress }: { scrollYProgress: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { currentTheme } = useTheme();

    // Create THREE.Color objects for the current theme
    // We use useMemo to avoid recreating them on every render, but we need them to update when theme changes
    // Actually, creating new THREE.Color objects is cheap, but we want to target them for lerping.

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

            // Get current scroll value (0 to 1)
            const scroll = scrollYProgress.get();
            materialRef.current.uniforms.uScroll.value = scroll;

            // Target colors from current theme
            // We darken them slightly for the background to keep it subtle
            const targetC1 = new THREE.Color(currentTheme.primary).multiplyScalar(0.2);
            const targetC2 = new THREE.Color(currentTheme.secondary).multiplyScalar(0.1);

            // Smoothly lerp current colors to target
            // Increased lerp speed for better responsiveness
            materialRef.current.uniforms.uColor1.value.lerp(targetC1, 0.05);
            materialRef.current.uniforms.uColor2.value.lerp(targetC2, 0.05);
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor1: { value: new THREE.Color("#0f0c29") },
        uColor2: { value: new THREE.Color("#302b63") },
        uColor3: { value: new THREE.Color("#ffffff") }, // Highlight
    }), []);

    return (
        <mesh ref={meshRef} scale={[20, 20, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export const LivingBackground = () => {
    const { scrollYProgress } = useScroll();

    return (
        <div className="fixed inset-0 -z-10 h-screen w-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <BackgroundPlane scrollYProgress={scrollYProgress} />
            </Canvas>
        </div>
    );
};
