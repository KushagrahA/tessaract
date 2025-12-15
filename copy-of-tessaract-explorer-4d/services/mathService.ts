import { Vector4, Rotations } from '../types';
import * as THREE from 'three';

// Rotate a 4D point in 6 possible planes
export const rotatePoint4D = (point: Vector4, rotations: Rotations): Vector4 => {
  let [x, y, z, w] = point;

  // Helper to rotate a pair of coordinates
  const rot = (a: number, b: number, theta: number): [number, number] => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return [a * cos - b * sin, a * sin + b * cos];
  };

  // 1. XY Plane (Rotation around ZW plane)
  if (rotations.xy !== 0) [x, y] = rot(x, y, rotations.xy);
  // 2. XZ Plane
  if (rotations.xz !== 0) [x, z] = rot(x, z, rotations.xz);
  // 3. XW Plane (Dimensional rotation)
  if (rotations.xw !== 0) [x, w] = rot(x, w, rotations.xw);
  // 4. YZ Plane
  if (rotations.yz !== 0) [y, z] = rot(y, z, rotations.yz);
  // 5. YW Plane (Dimensional rotation)
  if (rotations.yw !== 0) [y, w] = rot(y, w, rotations.yw);
  // 6. ZW Plane (Dimensional rotation)
  if (rotations.zw !== 0) [z, w] = rot(z, w, rotations.zw);

  return [x, y, z, w];
};

// Project 4D point to 3D using stereographic-like projection or perspective
export const project4Dto3D = (point: Vector4, distance: number): THREE.Vector3 => {
  const [x, y, z, w] = point;
  
  // 4D Perspective Projection
  // w represents distance into the 4th dimension.
  // We project onto the w=0 hyperplane from a point at w = distance (or -distance)
  
  const wFactor = 1 / (distance - w); 
  
  // Safe guard for division by zero if point hits camera
  const scale = Math.abs(distance - w) < 0.01 ? 100 : wFactor;
  
  return new THREE.Vector3(x * scale, y * scale, z * scale);
};

export const getVertexColor = (w: number, mode: 'depth' | 'solid' | 'heat'): string => {
  if (mode === 'solid') return '#1f2937'; // gray-800
  
  // Map W (-2 to 2 typically) to a color gradient
  // Normalize W roughly between 0 and 1
  const norm = (w + 2) / 4; 
  
  if (mode === 'heat') {
    // Blue (far) to Red (close)
    const r = Math.floor(Math.max(0, Math.min(1, norm)) * 255);
    const b = Math.floor(Math.max(0, Math.min(1, 1 - norm)) * 255);
    return `rgb(${r}, 0, ${b})`;
  }

  // Depth (Black to Light Gray)
  const val = Math.floor((1 - Math.max(0, Math.min(1, norm))) * 200);
  return `rgb(${val}, ${val}, ${val})`;
};