import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Incident } from '../../types';

interface Timeline3DSceneProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

export const Timeline3DScene: React.FC<Timeline3DSceneProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Rotate scene subtly on mouse move / frame
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 16,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 24,
        0.05
      );
    }
  });

  // Calculate coordinates for incidents along a 3D medical timeline curve
  // Earlier incidents (2024) are farther back (-Z), recent (2026) closer (+Z)
  const nodePositions = incidents.map((inc, i) => {
    const total = incidents.length;
    const t = i / Math.max(total - 1, 1); // 0 (2026 newest) to 1 (2024 oldest)
    const x = (t - 0.5) * 6;
    const y = Math.sin(t * Math.PI) * 0.8 - 0.2;
    const z = (0.5 - t) * 4;
    return { inc, pos: [x, y, z] as [number, number, number] };
  });

  // Line curve points connecting incidents
  const curvePoints = nodePositions.map(n => new THREE.Vector3(...n.pos));

  return (
    <group ref={groupRef}>
      {/* Ambient Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#0ea5e9" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#10b981" />

      {/* Connecting Medical Trajectory Rail */}
      {curvePoints.length > 1 && (
        <Line
          points={curvePoints}
          color="#0284c7"
          lineWidth={2.5}
          dashed={false}
          transparent
          opacity={0.6}
        />
      )}

      {/* Incident Nodes */}
      {nodePositions.map(({ inc, pos }) => {
        const isSelected = selectedIncidentId === inc.id;
        const isHovered = hoveredId === inc.id;
        const isCurrent = inc.id === 'INC-004';

        const nodeColor = isCurrent ? '#06b6d4' : inc.severity === 'CRITICAL' ? '#f43f5e' : '#10b981';

        return (
          <Float key={inc.id} speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={pos}>
              {/* Central Glowing Sphere */}
              <Sphere
                args={[isSelected ? 0.32 : isHovered ? 0.28 : 0.22, 32, 32]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIncident(inc.id);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredId(inc.id);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredId(null);
                  document.body.style.cursor = 'auto';
                }}
              >
                <meshStandardMaterial
                  color={nodeColor}
                  emissive={nodeColor}
                  emissiveIntensity={isSelected || isHovered ? 0.9 : 0.4}
                  roughness={0.2}
                  metalness={0.8}
                />
              </Sphere>

              {/* Pulsing Outer Ring for Current/Active Incident */}
              {isCurrent && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.38, 0.42, 32]} />
                  <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} side={THREE.DoubleSide} />
                </mesh>
              )}

              {/* 3D Label */}
              <Text
                position={[0, 0.45, 0]}
                fontSize={0.2}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
              >
                {`${inc.year} • ${inc.id}`}
              </Text>

              <Text
                position={[0, -0.38, 0]}
                fontSize={0.14}
                color="#94a3b8"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.2}
                textAlign="center"
              >
                {inc.title.length > 25 ? `${inc.title.substring(0, 22)}...` : inc.title}
              </Text>
            </group>
          </Float>
        );
      })}
    </group>
  );
};
