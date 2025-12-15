import React, { useState, useCallback } from 'react';
import Viewport from './components/Viewport';
import Controls from './components/Controls';
import { Rotations, RenderSettings } from './types';
import { SHAPES } from './constants';

const INITIAL_ROTATIONS: Rotations = {
  xy: 0, xz: 0, xw: 0,
  yz: 0, yw: 0, zw: 0
};

const INITIAL_SETTINGS: RenderSettings = {
  opacity: 0.8,
  vertexSize: 0.08,
  lineWidth: 2,
  perspective4D: 3,
  autoRotate: true,
  colorMap: 'depth'
};

const App: React.FC = () => {
  const [currentShapeKey, setShapeKey] = useState<string>('tesseract');
  const [rotations, setRotations] = useState<Rotations>(INITIAL_ROTATIONS);
  const [settings, setSettings] = useState<RenderSettings>(INITIAL_SETTINGS);

  const currentShape = SHAPES[currentShapeKey];

  const resetRotations = () => {
    setRotations(INITIAL_ROTATIONS);
  };

  // Logic to slowly rotate specifically in 4D planes for effect
  const handleAutoRotate = useCallback(() => {
    setRotations(prev => ({
      ...prev,
      xw: (prev.xw + 0.005) % (Math.PI * 2),
      zw: (prev.zw + 0.003) % (Math.PI * 2),
    }));
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-white text-gray-800">
      <Viewport 
        shape={currentShape} 
        rotations={rotations} 
        settings={settings}
        onAutoRotateTick={handleAutoRotate}
      />
      
      <Controls 
        currentShapeKey={currentShapeKey}
        setShapeKey={setShapeKey}
        rotations={rotations}
        setRotations={setRotations}
        settings={settings}
        setSettings={setSettings}
        resetRotations={resetRotations}
      />
    </main>
  );
};

export default App;