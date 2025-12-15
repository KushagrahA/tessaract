import { Shape4D, Edge } from './types';

// Helper to generate hypercube vertices
const generateHypercube = (): Shape4D => {
  const vertices: any[] = [];
  const edges: any[] = [];
  
  // Generate 16 vertices for Tesseract
  for (let i = 0; i < 16; i++) {
    const x = (i & 1) ? 1 : -1;
    const y = (i & 2) ? 1 : -1;
    const z = (i & 4) ? 1 : -1;
    const w = (i & 8) ? 1 : -1;
    vertices.push([x, y, z, w]);
  }

  // Generate edges based on Hamming distance of 1
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      // Check bit differences
      if (((i ^ j) & 1)) diff++;
      if (((i ^ j) & 2)) diff++;
      if (((i ^ j) & 4)) diff++;
      if (((i ^ j) & 8)) diff++;
      
      if (diff === 1) {
        edges.push([i, j]);
      }
    }
  }

  return {
    name: 'Tesseract',
    description: 'The 4D analogue of a cube. 16 vertices, 32 edges. It is composed of 8 cubical cells.',
    complexity: 'Medium',
    vertices,
    edges,
  };
};

const generatePentachoron = (): Shape4D => {
  const vertices: any[] = [
    [1, 1, 1, -1/Math.sqrt(5)],
    [1, -1, -1, -1/Math.sqrt(5)],
    [-1, 1, -1, -1/Math.sqrt(5)],
    [-1, -1, 1, -1/Math.sqrt(5)],
    [0, 0, 0, 4/Math.sqrt(5) - 1/Math.sqrt(5)]
  ].map(v => [v[0], v[1], v[2], v[3] || 0]);

  // 5 vertices, fully connected
  const edges: any[] = [];
  for(let i=0; i<5; i++) {
    for(let j=i+1; j<5; j++) {
      edges.push([i, j]);
    }
  }

  return {
    name: 'Pentachoron (5-Cell)',
    description: 'The simplest regular polychoron. 5 vertices, 10 edges. Analogous to a tetrahedron.',
    complexity: 'Low',
    vertices,
    edges
  };
};

const generate16Cell = (): Shape4D => {
  // Permutations of (±1, 0, 0, 0)
  const vertices: any[] = [
    [1,0,0,0], [-1,0,0,0],
    [0,1,0,0], [0,-1,0,0],
    [0,0,1,0], [0,0,-1,0],
    [0,0,0,1], [0,0,0,-1]
  ];
  
  const edges: any[] = [];
  for(let i=0; i<vertices.length; i++) {
    for(let j=i+1; j<vertices.length; j++) {
      // Connect orthogonal vertices (dot product 0)
      let dot = 0;
      for(let k=0; k<4; k++) dot += vertices[i][k] * vertices[j][k];
      if (Math.abs(dot) < 0.1) {
         edges.push([i, j]);
      }
    }
  }

  return {
    name: 'Hexadecachoron (16-Cell)',
    description: 'The dual of the tesseract. 8 vertices, 24 edges. Composed of 16 tetrahedra.',
    complexity: 'High',
    vertices,
    edges
  };
};

const generate24Cell = (): Shape4D => {
  const vertices: number[][] = [];
  // Permutations of (±1, ±1, 0, 0)
  // 6 coordinate pairs * 4 sign combinations = 24 vertices
  const pairs = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 3], [2, 3]
  ];
  
  pairs.forEach(([p1, p2]) => {
     for (let s1 of [-1, 1]) {
       for (let s2 of [-1, 1]) {
         const v = [0, 0, 0, 0];
         v[p1] = s1;
         v[p2] = s2;
         vertices.push(v);
       }
     }
  });

  const edges: Edge[] = [];
  // Vertices are connected if Euclidean distance is sqrt(2)
  // Equivalent to dot product = 1 for this set of vertices
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      let dot = 0;
      for(let k=0; k<4; k++) dot += vertices[i][k] * vertices[j][k];
      if (Math.abs(dot - 1) < 0.01) {
        edges.push([i, j]);
      }
    }
  }

  return {
    name: 'Icositetrachoron (24-Cell)',
    description: 'A unique regular polychoron with no 3D analogue. 24 vertices, 96 edges. Self-dual.',
    complexity: 'High',
    vertices: vertices as any,
    edges,
  };
};

const generateCliffordTorus = (): Shape4D => {
  const vertices: number[][] = [];
  const edges: Edge[] = [];
  const steps = 24; // Resolution
  
  for (let i = 0; i < steps; i++) {
    const u = (i / steps) * Math.PI * 2;
    for (let j = 0; j < steps; j++) {
      const v = (j / steps) * Math.PI * 2;
      // Parametric definition on S3: x=cos u, y=sin u, z=cos v, w=sin v
      vertices.push([Math.cos(u), Math.sin(u), Math.cos(v), Math.sin(v)]);
    }
  }

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const idx = i * steps + j;
      const nextU = ((i + 1) % steps) * steps + j;
      const nextV = i * steps + ((j + 1) % steps);
      edges.push([idx, nextU]);
      edges.push([idx, nextV]);
    }
  }

  return {
    name: 'Clifford Torus',
    description: 'A "flat" torus sitting inside the 3-sphere. It appears as a donut turning inside out when rotated in 4D.',
    complexity: 'High',
    vertices: vertices as any,
    edges,
  };
};

const generateHyperbolicSurface = (): Shape4D => {
  const vertices: number[][] = [];
  const edges: Edge[] = [];
  const steps = 14;
  const range = 1.5;
  
  // A parametric 4D patch with hyperbolic curvature
  // x = u, y = v, z = u² - v² (saddle), w = 2uv
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * range * 2 - range;
    for (let j = 0; j <= steps; j++) {
      const v = (j / steps) * range * 2 - range;
      vertices.push([u, v, (u*u - v*v)*0.6, u*v*0.6]);
    }
  }

  const rowSize = steps + 1;
  // Create grid mesh
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const idx = i * rowSize + j;
      edges.push([idx, idx + 1]); // Horizontal
      edges.push([idx, idx + rowSize]); // Vertical
    }
  }
  // Cap the last edges
  for(let i=0; i<steps; i++) {
     edges.push([(steps)*rowSize + i, (steps)*rowSize + i + 1]); 
     edges.push([i*rowSize + steps, (i+1)*rowSize + steps]);
  }

  return {
    name: 'Hyperbolic Surface',
    description: 'A 4D surface patch exhibiting hyperbolic curvature (Saddle shape extended to 4D).',
    complexity: 'Medium',
    vertices: vertices as any,
    edges
  };
};

export const SHAPES: Record<string, Shape4D> = {
  tesseract: generateHypercube(),
  pentachoron: generatePentachoron(),
  hexadecachoron: generate16Cell(),
  icositetrachoron: generate24Cell(),
  clifford: generateCliffordTorus(),
  hyperbola: generateHyperbolicSurface(),
};