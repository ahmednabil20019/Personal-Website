import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EarthSphere } from './EarthSphere';

export const Scene3D = ({ className = '', height = 'h-96' }) => (
    <div className={`${height} ${className}`}>
      <Canvas
        camera={{ position: [2.5, 0.8, 3.2], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Brighter lighting to highlight Egypt */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, 2, -3]} intensity={0.8} color="#ffffff" />
        <pointLight position={[2, 2, 3]} intensity={1.5} color="#fbbf24" /> {/* Golden light for Egypt */}
        <spotLight
          position={[4, 2, 4]}
          target-position={[0, 0, 0]}
          angle={0.6}
          penumbra={0.3}
          intensity={1.2}
          color="#f59e0b"
        />

        <Suspense fallback={null}>
          {/* Simple Earth-like sphere */}
          <EarthSphere />

          {/* Interactive controls - positioned to show Egypt, no zoom */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            target={[0, 0, 0]}
            // Start rotation to show Egypt (Africa/Middle East region)
            azimuthAngle={Math.PI * 0.3}
            polarAngle={Math.PI * 0.45}
          />
        </Suspense>
      </Canvas>
    </div>
);