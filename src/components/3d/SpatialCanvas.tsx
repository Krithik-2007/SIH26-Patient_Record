import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Timeline3DScene } from './Timeline3DScene';
import { Incident } from '../../types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface SpatialCanvasProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="h-64 rounded-2xl bg-[#0d111a] border border-white/10 flex items-center justify-center text-slate-400 text-xs">
        Spatial 2.5D Mode Active (WebGL Hardware Acceleration Unavailable)
      </div>
    );
  }

  return (
    <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0e17] to-[#0d111a] border border-white/[0.08] relative shadow-spatial-md">
      {/* Visual Overlay Tag */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-brand-cyan">
          <Sparkles className="w-3 h-3 animate-pulse text-brand-cyan" />
          <span>Spatial Longitudinal Map (2024 — 2026)</span>
        </span>
      </div>

      <div className="absolute bottom-3 right-4 z-10 text-[10px] text-slate-500 font-mono pointer-events-none hidden sm:block">
        Interactive Orbit • Click node to inspect incident
      </div>

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-teal" />
            <span>Initializing spatial environment...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Timeline3DScene
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={onSelectIncident}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
            maxAzimuthAngle={Math.PI / 6}
            minAzimuthAngle={-Math.PI / 6}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};
