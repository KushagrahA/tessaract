import React from 'react';
import { Rotations, Shape4D, RenderSettings } from '../types';
import { SHAPES } from '../constants';
import { Settings, Info, Rotate3D, Box, Layers, Play, Pause, RefreshCw } from 'lucide-react';

interface ControlsProps {
  currentShapeKey: string;
  setShapeKey: (key: string) => void;
  rotations: Rotations;
  setRotations: React.Dispatch<React.SetStateAction<Rotations>>;
  settings: RenderSettings;
  setSettings: React.Dispatch<React.SetStateAction<RenderSettings>>;
  resetRotations: () => void;
}

const Slider = ({ label, value, onChange, color = "accent-indigo-600" }: { label: string, value: number, onChange: (val: number) => void, color?: string }) => (
  <div className="flex flex-col mb-3">
    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
      <span>{label}</span>
      <span>{(value / Math.PI).toFixed(2)}π</span>
    </div>
    <input
      type="range"
      min="0"
      max={Math.PI * 2}
      step={0.01}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer ${color}`}
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({
  currentShapeKey,
  setShapeKey,
  rotations,
  setRotations,
  settings,
  setSettings,
  resetRotations
}) => {
  const updateRotation = (axis: keyof Rotations, val: number) => {
    setRotations(prev => ({ ...prev, [axis]: val }));
  };

  const currentShape = SHAPES[currentShapeKey];

  return (
    <>
      {/* Left Panel: Shape Selection & Info */}
      <div className="absolute top-4 left-4 w-80 flex flex-col gap-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 pointer-events-auto">
          <div className="flex items-center gap-2 mb-4">
            <Box className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tesseract 4D</h1>
          </div>
          
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Select Object</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.keys(SHAPES).map((key) => (
                <button
                  key={key}
                  onClick={() => setShapeKey(key)}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-all ${
                    currentShapeKey === key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {SHAPES[key].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
             <h2 className="text-sm font-semibold text-gray-900 mb-1">{currentShape.name}</h2>
             <p className="text-xs text-gray-500 leading-relaxed">{currentShape.description}</p>
             <div className="flex gap-4 mt-3">
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 uppercase">Vertices</span>
                 <span className="text-sm font-medium text-gray-700">{currentShape.vertices.length}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 uppercase">Edges</span>
                 <span className="text-sm font-medium text-gray-700">{currentShape.edges.length}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 uppercase">Comp.</span>
                 <span className={`text-sm font-medium ${currentShape.complexity === 'High' ? 'text-orange-500' : 'text-green-600'}`}>
                    {currentShape.complexity}
                 </span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Controls */}
      <div className="absolute top-4 right-4 w-72 flex flex-col gap-4 pointer-events-none">
        
        {/* Dimensional Rotations (The "Magic" Part) */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">4th Dim. Rotation</h2>
            </div>
             <button 
              onClick={resetRotations}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <Slider label="X-W Plane (Ana/Kata)" value={rotations.xw} onChange={(v) => updateRotation('xw', v)} color="accent-purple-600" />
          <Slider label="Y-W Plane" value={rotations.yw} onChange={(v) => updateRotation('yw', v)} color="accent-purple-600" />
          <Slider label="Z-W Plane" value={rotations.zw} onChange={(v) => updateRotation('zw', v)} color="accent-purple-600" />
        </div>

        {/* Standard Rotations */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 pointer-events-auto">
          <div className="flex items-center gap-2 mb-4">
            <Rotate3D className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">3D Space Rotation</h2>
          </div>
          
          <Slider label="X-Y Plane" value={rotations.xy} onChange={(v) => updateRotation('xy', v)} />
          <Slider label="X-Z Plane" value={rotations.xz} onChange={(v) => updateRotation('xz', v)} />
          <Slider label="Y-Z Plane" value={rotations.yz} onChange={(v) => updateRotation('yz', v)} />
        </div>

         {/* Visual Settings */}
         <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-5 pointer-events-auto">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Simulation</h2>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-600">Auto-Rotation</span>
            <button 
              onClick={() => setSettings(s => ({...s, autoRotate: !s.autoRotate}))}
              className={`p-2 rounded-lg transition-colors ${settings.autoRotate ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}
            >
              {settings.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center">
                 <span className="text-xs text-gray-500">Vertex Color</span>
                 <select 
                   value={settings.colorMap}
                   onChange={(e) => setSettings(s => ({...s, colorMap: e.target.value as any}))}
                   className="text-xs bg-gray-100 border-none rounded px-2 py-1 cursor-pointer focus:ring-0"
                 >
                   <option value="solid">Minimal (Black)</option>
                   <option value="heat">Heatmap (Distance)</option>
                   <option value="depth">Depth Fade</option>
                 </select>
             </div>
             
             <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">4D FOV</span>
                 <input 
                    type="range" min="2" max="6" step="0.1"
                    value={settings.perspective4D}
                    onChange={(e) => setSettings(s => ({...s, perspective4D: parseFloat(e.target.value)}))}
                    className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                 />
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-4 w-full text-center pointer-events-none">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest bg-white/50 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            Interactive 4D Sandbox • React Three Fiber • TypeScript
          </p>
      </div>
    </>
  );
};

export default Controls;