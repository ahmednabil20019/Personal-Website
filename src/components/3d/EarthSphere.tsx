import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const EarthSphere = () => {
  const meshRef = useRef();
  const atmosphereRef = useRef();
  const lightsRef = useRef();
  const egyptLightRef = useRef();

  // Load real Earth textures from NASA using CORS-friendly CDN
  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // Using NASA's Blue Marble Earth texture via jsdelivr CDN (CORS-friendly)
    const texture = loader.load('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-blue-marble.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  const earthBumpTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // Earth elevation/bump map for realistic terrain
    const texture = loader.load('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-topology.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  const earthSpecularTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // Earth specular map for water reflection
    const texture = loader.load('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-water.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Load real cloud texture
  const cloudTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // Real Earth clouds texture
    const texture = loader.load('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-clouds.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Load real night lights texture
  const cityLightsTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // Real NASA night lights texture
    const texture = loader.load('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-night.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Create accurate Egypt country border highlight
  const egyptHighlightTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Start with transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Egypt's approximate borders in longitude/latitude
    // Convert to texture coordinates: x = (lon + 180) / 360 * width, y = (90 - lat) / 180 * height
    const egyptBorders = [
      // Egypt's actual border coordinates (simplified)
      { lon: 25, lat: 22 }, // Southwest corner (Sudan border)
      { lon: 25, lat: 31.5 }, // Northwest corner (Mediterranean)
      { lon: 32, lat: 31.5 }, // Northeast corner (Gaza)
      { lon: 34.5, lat: 29.5 }, // East (Sinai)
      { lon: 34.5, lat: 28 }, // Southeast Sinai
      { lon: 33, lat: 22 }, // Southeast (Red Sea)
      { lon: 25, lat: 22 }, // Back to start
    ];

    // Convert to canvas coordinates
    const canvasPoints = egyptBorders.map(point => ({
      x: (point.lon + 180) / 360 * 1024,
      y: (90 - point.lat) / 180 * 512
    }));

    // Create the Egypt country shape with golden glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.8)'; // Bright gold
    ctx.strokeStyle = 'rgba(255, 215, 0, 1)'; // Golden border
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    canvasPoints.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add glow effect around Egypt
    const centerX = canvasPoints.reduce((sum, p) => sum + p.x, 0) / canvasPoints.length;
    const centerY = canvasPoints.reduce((sum, p) => sum + p.y, 0) / canvasPoints.length;

    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
    glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
    glowGradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
    glowGradient.addColorStop(1, 'rgba(217, 119, 6, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Add special highlights for major cities
    const cities = [
      { name: 'Cairo', lon: 31.2, lat: 30.0, size: 8 },
      { name: 'Alexandria', lon: 29.9, lat: 31.2, size: 6 },
      { name: 'Luxor', lon: 32.6, lat: 25.7, size: 5 },
      { name: 'Aswan', lon: 32.9, lat: 24.1, size: 4 },
    ];

    cities.forEach(city => {
      const cityX = (city.lon + 180) / 360 * 1024;
      const cityY = (90 - city.lat) / 180 * 512;

      const cityGradient = ctx.createRadialGradient(cityX, cityY, 0, cityX, cityY, city.size);
      cityGradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white center
      cityGradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.9)'); // Gold
      cityGradient.addColorStop(1, 'rgba(255, 215, 0, 0)'); // Transparent

      ctx.fillStyle = cityGradient;
      ctx.beginPath();
      ctx.arc(cityX, cityY, city.size, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (meshRef.current) {
      // Start with Egypt visible, then rotate slowly
      meshRef.current.rotation.y = -Math.PI * 0.7 + time * 0.05; // Start showing Egypt region

      // Subtle wobble
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.01;
      meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.005;
    }

    if (atmosphereRef.current) {
      // Rotate clouds slightly faster, starting with Egypt visible
      atmosphereRef.current.rotation.y = -Math.PI * 0.7 + time * 0.06;
    }

    if (lightsRef.current) {
      // City lights rotate with Earth, starting with Egypt visible
      lightsRef.current.rotation.y = -Math.PI * 0.7 + time * 0.05;

      // Subtle pulsing effect for city lights
      const pulse = 0.8 + Math.sin(time * 2) * 0.2;
      lightsRef.current.material.opacity = pulse * 0.6;
    }

    if (egyptLightRef.current) {
      // Special golden pulsing for Egypt
      const egyptPulse = 0.7 + Math.sin(time * 1.5) * 0.3;
      egyptLightRef.current.material.opacity = egyptPulse;
      egyptLightRef.current.rotation.y = -Math.PI * 0.7 + time * 0.05;
    }
  });

  return (
    <group>
      {/* Main Earth sphere with realistic textures */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 128, 64]} />
        <meshLambertMaterial
          map={earthTexture}
          // Removed bump and specular maps to make it brighter
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.02, 128, 64]} />
        <meshLambertMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* City lights layer */}
      <mesh ref={lightsRef}>
        <sphereGeometry args={[2.01, 128, 64]} />
        <meshBasicMaterial
          map={cityLightsTexture}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Egypt golden highlight layer */}
      <mesh ref={egyptLightRef}>
        <sphereGeometry args={[2.03, 128, 64]} />
        <meshBasicMaterial
          map={egyptHighlightTexture}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 16]} />
        <meshBasicMaterial
          color={new THREE.Color(0x4da6ff)}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle ring particles (like space debris) */}
      {Array.from({ length: 100 }, (_, i) => {
        const angle = (i / 100) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 0.5;
        const height = (Math.random() - 0.5) * 0.2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.005 + Math.random() * 0.01]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(0.6, 0.3, 0.8)}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}


    </group>
  );
};
