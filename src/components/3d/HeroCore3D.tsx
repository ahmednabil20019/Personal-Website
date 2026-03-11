import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    float noiseFreq = 2.0;
    float noiseAmp = 0.2;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y * noiseFreq + uTime, pos.z * noiseFreq);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;

  // Simplex 3D Noise 
  // (Simplified for brevity, usually you'd include a full noise function)
  float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
  }

  void main() {
    vec3 color = mix(uColorStart, uColorEnd, vPosition.y + 0.5);
    
    // Pulsating glow
    float glow = sin(uTime * 2.0) * 0.2 + 0.8;
    
    // Dynamic alpha based on noise/position
    float alpha = 0.6 + 0.4 * sin(uTime + vPosition.x * 10.0);
    
    gl_FragColor = vec4(color * glow, alpha);
  }
`;

export const HeroCore3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorStart: { value: new THREE.Color("#64ffda") }, // Cyan
      uColorEnd: { value: new THREE.Color("#bd93f9") },   // Purple
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const { clock } = state;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Core */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </Float>
  );
};
