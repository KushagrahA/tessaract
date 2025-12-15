export type Vector4 = [number, number, number, number]; // x, y, z, w
export type Edge = [number, number]; // Indices of connected vertices

export interface Shape4D {
  name: string;
  description: string;
  vertices: Vector4[];
  edges: Edge[];
  complexity: 'Low' | 'Medium' | 'High';
}

export interface Rotations {
  xy: number;
  xz: number;
  xw: number;
  yz: number;
  yw: number;
  zw: number;
}

export enum DimensionMode {
  D3 = '3D',
  D4 = '4D',
}

export interface RenderSettings {
  opacity: number;
  vertexSize: number;
  lineWidth: number;
  perspective4D: number; // The "distance" of the 4D camera
  autoRotate: boolean;
  colorMap: 'depth' | 'solid' | 'heat';
}