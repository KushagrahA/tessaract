import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import HyperShape from './HyperShape';
import { Shape4D, Rotations, RenderSettings } from '../types';

interface ViewportProps {
  shape: Shape4D;
  rotations: Rotations;
  settings: RenderSettings;
  onAutoRotateTick: () => void;
}

const Viewport: React.FC<ViewportProps> = ({ shape, rotations, settings, onAutoRotateTick }) => {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Minimalist Lighting */}
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* The 4D Shape */}
        <HyperShape 
          shape={shape} 
          rotations={rotations} 
          settings={settings} 
          onAutoRotateTick={onAutoRotateTick}
        />

        {/* Environment Reference */}
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor={"#e5e7eb"} 
          cellColor={"#f3f4f6"} 
          position={[0, -2, 0]} 
        />
        
        {/* User Controls for the 3D camera (not the 4D rotation) */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2} 
          maxDistance={10} 
          autoRotate={false}
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Viewport;