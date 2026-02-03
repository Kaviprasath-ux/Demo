"use client";

import { useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Html, Clone } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";

// Free soldier model from three.js examples (CC0)
const SOLDIER_MODEL_URL = "https://threejs.org/examples/models/gltf/Soldier.glb";

// Preload the model
useGLTF.preload(SOLDIER_MODEL_URL);

interface RealSoldierProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: "Idle" | "Walk" | "Run";
  label?: string;
}

// Real 3D Soldier using GLB model
function RealSoldier({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = "Idle",
  label,
}: RealSoldierProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(SOLDIER_MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  // Play animation
  useEffect(() => {
    if (actions && actions[animation]) {
      // Stop all animations first
      Object.values(actions).forEach((action) => action?.stop());
      // Play the selected animation
      actions[animation]?.reset().fadeIn(0.2).play();
    }
  }, [actions, animation]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <Clone object={scene} castShadow receiveShadow />

      {/* Role label */}
      {label && (
        <Html position={[0, 2.2, 0]} center>
          <div className="px-2 py-1 bg-slate-900/95 rounded-md text-white text-[10px] font-semibold whitespace-nowrap border border-slate-600/50 shadow-lg">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Loading placeholder while model loads
function SoldierPlaceholder({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial color="#2d4a2d" transparent opacity={0.5} />
      </mesh>
      <Html position={[0, 2.2, 0]} center>
        <div className="px-2 py-1 bg-slate-700/80 rounded text-white text-[10px]">
          Loading...
        </div>
      </Html>
    </group>
  );
}

// Small arms shooter - soldier with weapon
export function SmallArmsShooter() {
  const { getGunSystemInfo, currentAnimation } = useTrainingStore();
  const gunSystem = getGunSystemInfo();
  const groupRef = useRef<THREE.Group>(null);
  const recoilRef = useRef(0);

  const category = gunSystem?.category;

  // Only show for small arms
  if (category === "towed") return null;

  // Recoil animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (currentAnimation === "firing") {
      recoilRef.current = Math.min(recoilRef.current + delta * 10, 0.08);
    } else {
      recoilRef.current = Math.max(recoilRef.current - delta * 5, 0);
    }

    groupRef.current.position.z = -0.5 - recoilRef.current;
  });

  // Position based on weapon type
  const scale = category === "pistol" ? 0.8 : 0.9;

  return (
    <group ref={groupRef}>
      <Suspense fallback={<SoldierPlaceholder position={[0, 0, -0.5]} />}>
        <RealSoldier
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={scale}
          animation="Idle"
        />
      </Suspense>
    </group>
  );
}

// Artillery crew positions around the gun
const CREW_POSITIONS: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
  role: string;
  scale: number;
  animation: "Idle" | "Walk" | "Run";
}> = [
  // Gunner - at sight
  { position: [1.2, 0, 2.0], rotation: [0, -Math.PI / 2, 0], role: "Gunner", scale: 0.85, animation: "Idle" },
  // Assistant Gunner
  { position: [-1.2, 0, 2.2], rotation: [0, Math.PI / 2, 0], role: "Asst Gunner", scale: 0.85, animation: "Idle" },
  // Loader
  { position: [0.3, 0, -0.3], rotation: [0, Math.PI, 0], role: "Loader", scale: 0.9, animation: "Idle" },
  // Ammo Handler 1
  { position: [-2.2, 0, 0.8], rotation: [0, Math.PI / 4, 0], role: "Ammo #1", scale: 0.8, animation: "Walk" },
  // Ammo Handler 2
  { position: [-2.5, 0, -0.5], rotation: [0, Math.PI / 3, 0], role: "Ammo #2", scale: 0.8, animation: "Idle" },
  // Section Chief
  { position: [2.5, 0, -0.3], rotation: [0, -Math.PI / 3, 0], role: "Section Chief", scale: 0.9, animation: "Idle" },
];

// Artillery crew with real soldier models
export function ArtilleryCrew() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  // Only show for artillery
  if (gunSystem?.category !== "towed") return null;

  return (
    <group>
      {CREW_POSITIONS.map((crew) => (
        <Suspense key={crew.role} fallback={<SoldierPlaceholder position={crew.position} />}>
          <RealSoldier
            position={crew.position}
            rotation={crew.rotation}
            scale={crew.scale}
            animation={crew.animation}
            label={crew.role}
          />
        </Suspense>
      ))}

      {/* Ground position markers */}
      {CREW_POSITIONS.map((crew) => (
        <mesh
          key={`marker-${crew.role}`}
          position={[crew.position[0], 0.01, crew.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color="#4a6741" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
