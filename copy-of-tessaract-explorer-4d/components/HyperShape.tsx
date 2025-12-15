import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Sphere } from '@react-three/drei';
import { Shape4D, Rotations, RenderSettings } from '../types';
import { rotatePoint4D, project4Dto3D, getVertexColor } from '../services/mathService';

interface HyperShapeProps {
  shape: Shape4D;
  rotations: Rotations;
  settings: RenderSettings;
  onAutoRotateTick: () => void;
}

const HyperShape: React.FC<HyperShapeProps> = ({ shape, rotations, settings, onAutoRotateTick }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (settings.autoRotate) {
      onAutoRotateTick();
    }
    if (groupRef.current) {
      // Slowly rotate the whole 3D group for better inspection
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Calculate projected vertices for this frame
  const projectedData = useMemo(() => {
    // 1. Rotate 4D vertices
    const rotatedVertices = shape.vertices.map(v => rotatePoint4D(v, rotations));
    
    // 2. Project to 3D
    const projectedPoints = rotatedVertices.map(v => ({
      pos: project4Dto3D(v, settings.perspective4D),
      originalW: v[3] // Keep W for coloring
    }));

    // 3. Create line segments
    const lines = shape.edges.map(edge => ({
      start: projectedPoints[edge[0]].pos,
      end: projectedPoints[edge[1]].pos,
      startW: projectedPoints[edge[0]].originalW,
      endW: projectedPoints[edge[1]].originalW
    }));

    return { points: projectedPoints, lines };
  }, [shape, rotations, settings.perspective4D]);

  return (
    <group ref={groupRef}>
      {/* Vertices */}
      {projectedData.points.map((p, i) => (
        <mesh key={`vert-${i}`} position={p.pos}>
          <sphereGeometry args={[settings.vertexSize, 16, 16]} />
          <meshStandardMaterial 
            color={getVertexColor(p.originalW, settings.colorMap)} 
            emissive={getVertexColor(p.originalW, settings.colorMap)}
            emissiveIntensity={0.5}
            transparent
            opacity={settings.opacity}
          />
        </mesh>
      ))}

      {/* Edges */}
      {projectedData.lines.map((line, i) => (
        <Line
          key={`edge-${i}`}
          points={[line.start, line.end]}
          color={settings.colorMap === 'solid' ? '#000000' : getVertexColor((line.startW + line.endW) / 2, settings.colorMap)}
          lineWidth={settings.lineWidth}
          transparent
          opacity={settings.opacity * 0.8}
        />
      ))}
    </group>
  );
};

export default HyperShape;