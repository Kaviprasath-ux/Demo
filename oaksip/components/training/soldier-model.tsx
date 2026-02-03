"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";

// Create a smooth soldier silhouette shape
function createSoldierShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Start at bottom center
  shape.moveTo(0, 0);

  // Right leg
  shape.lineTo(0.15, 0);
  shape.lineTo(0.18, 0.35);

  // Hip to torso right
  shape.lineTo(0.22, 0.45);
  shape.lineTo(0.25, 0.55);

  // Right arm (down)
  shape.lineTo(0.35, 0.52);
  shape.lineTo(0.38, 0.38);
  shape.lineTo(0.32, 0.35);
  shape.lineTo(0.28, 0.48);

  // Shoulder to neck right
  shape.lineTo(0.25, 0.7);
  shape.lineTo(0.18, 0.75);

  // Head right side
  shape.quadraticCurveTo(0.2, 0.85, 0.15, 0.92);

  // Head top (helmet)
  shape.quadraticCurveTo(0.1, 1.0, 0, 1.02);
  shape.quadraticCurveTo(-0.1, 1.0, -0.15, 0.92);

  // Head left side
  shape.quadraticCurveTo(-0.2, 0.85, -0.18, 0.75);

  // Neck to shoulder left
  shape.lineTo(-0.25, 0.7);

  // Left arm
  shape.lineTo(-0.28, 0.48);
  shape.lineTo(-0.32, 0.35);
  shape.lineTo(-0.38, 0.38);
  shape.lineTo(-0.35, 0.52);

  // Torso left
  shape.lineTo(-0.25, 0.55);
  shape.lineTo(-0.22, 0.45);

  // Left leg
  shape.lineTo(-0.18, 0.35);
  shape.lineTo(-0.15, 0);

  shape.lineTo(0, 0);

  return shape;
}

// Create shooting stance silhouette
function createShootingShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Feet spread stance
  shape.moveTo(-0.2, 0);
  shape.lineTo(-0.12, 0);
  shape.lineTo(-0.08, 0.32);

  // Body leaning forward slightly
  shape.lineTo(-0.05, 0.42);
  shape.lineTo(0.05, 0.45);
  shape.lineTo(0.12, 0.55);

  // Arms extended forward (holding weapon)
  shape.lineTo(0.45, 0.62);
  shape.lineTo(0.48, 0.58);
  shape.lineTo(0.15, 0.5);

  // Shoulder
  shape.lineTo(0.18, 0.68);

  // Neck and head
  shape.lineTo(0.12, 0.72);
  shape.quadraticCurveTo(0.15, 0.82, 0.1, 0.9);
  shape.quadraticCurveTo(0.05, 0.95, -0.02, 0.95);
  shape.quadraticCurveTo(-0.1, 0.93, -0.12, 0.85);
  shape.quadraticCurveTo(-0.14, 0.78, -0.1, 0.72);

  // Back
  shape.lineTo(-0.15, 0.65);
  shape.lineTo(-0.18, 0.5);
  shape.lineTo(-0.15, 0.4);
  shape.lineTo(-0.12, 0.32);

  // Back leg
  shape.lineTo(-0.25, 0.25);
  shape.lineTo(-0.28, 0);
  shape.lineTo(-0.2, 0);

  return shape;
}

interface SoldierSilhouetteProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  isShootingStance?: boolean;
  showRecoil?: boolean;
  label?: string;
}

// Clean silhouette soldier
export function SoldierSilhouette({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#1a2e1a",
  isShootingStance = false,
  showRecoil = false,
  label,
}: SoldierSilhouetteProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { currentAnimation } = useTrainingStore();
  const recoilOffset = useRef(0);

  // Create extruded geometry from shape
  const geometry = useMemo(() => {
    const shape = isShootingStance ? createShootingShape() : createSoldierShape();
    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [isShootingStance]);

  // Recoil animation
  useFrame((_, delta) => {
    if (!groupRef.current || !showRecoil) return;

    if (currentAnimation === "firing") {
      recoilOffset.current = Math.min(recoilOffset.current + delta * 8, 0.1);
    } else {
      recoilOffset.current = Math.max(recoilOffset.current - delta * 4, 0);
    }

    groupRef.current.position.z = position[2] - recoilOffset.current;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main silhouette body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle edge glow for visibility */}
      <mesh geometry={geometry} scale={1.02}>
        <meshBasicMaterial
          color="#2d4a2d"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Role label */}
      {label && (
        <Html position={[0, 1.15 * scale, 0]} center>
          <div className="px-2 py-1 bg-slate-900/95 rounded-md text-white text-[10px] font-semibold whitespace-nowrap border border-slate-600/50 shadow-lg">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Prone soldier for machine guns
function ProneSoldier({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
  showRecoil = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  showRecoil?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { currentAnimation } = useTrainingStore();
  const recoilOffset = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || !showRecoil) return;

    if (currentAnimation === "firing") {
      recoilOffset.current = Math.min(recoilOffset.current + delta * 8, 0.05);
    } else {
      recoilOffset.current = Math.max(recoilOffset.current - delta * 4, 0);
    }

    groupRef.current.position.z = position[2] - recoilOffset.current;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Prone body - lying flat */}
      <mesh position={[0, 0.08, -0.3]} rotation={[-Math.PI / 2 + 0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.15, 0.05]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 0.18, 0.03]} castShadow>
        <sphereGeometry args={[0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1f3a1f" roughness={0.7} />
      </mesh>

      {/* Arms extended forward */}
      <mesh position={[-0.12, 0.1, 0.2]} rotation={[0.2, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.2]} rotation={[0.2, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.06, -0.6]} rotation={[-Math.PI / 2, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.06, -0.6]} rotation={[-Math.PI / 2, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Small arms shooter - soldier with weapon
export function SmallArmsShooter() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  const category = gunSystem?.category;
  if (category === "towed") return null;

  if (category === "machine-gun") {
    return (
      <ProneSoldier
        position={[0, 0, -0.6]}
        scale={1.2}
        showRecoil={true}
      />
    );
  }

  // Standing shooting stance for rifles and pistols
  const scale = category === "pistol" ? 0.9 : 1.0;
  const zOffset = category === "pistol" ? -0.25 : -0.4;

  return (
    <SoldierSilhouette
      position={[0, 0, zOffset]}
      rotation={[0, 0, 0]}
      scale={scale}
      isShootingStance={true}
      showRecoil={true}
      color="#1a2e1a"
    />
  );
}

// Artillery crew positions
const CREW_POSITIONS: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
  role: string;
  scale: number;
}> = [
  // Gunner - operating the sight
  { position: [1.0, 0, 1.8], rotation: [0, -Math.PI / 2, 0], role: "Gunner", scale: 0.9 },
  // Assistant Gunner - at breech
  { position: [-1.0, 0, 2.0], rotation: [0, Math.PI / 2, 0], role: "Asst Gunner", scale: 0.9 },
  // Loader - loading shells
  { position: [0, 0, 0], rotation: [0, Math.PI, 0], role: "Loader", scale: 0.95 },
  // Ammo bearer 1
  { position: [-2.0, 0, 0.5], rotation: [0, Math.PI / 4, 0], role: "Ammo #1", scale: 0.85 },
  // Ammo bearer 2
  { position: [-2.2, 0, -0.8], rotation: [0, Math.PI / 3, 0], role: "Ammo #2", scale: 0.85 },
  // Section Chief - commanding
  { position: [2.2, 0, 0], rotation: [0, -Math.PI / 3, 0], role: "Section Chief", scale: 0.95 },
];

// Artillery crew - multiple soldiers at stations
export function ArtilleryCrew() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  if (gunSystem?.category !== "towed") return null;

  return (
    <group>
      {CREW_POSITIONS.map((crew, index) => (
        <SoldierSilhouette
          key={crew.role}
          position={crew.position}
          rotation={crew.rotation}
          scale={crew.scale}
          label={crew.role}
          showRecoil={index < 3}
          color="#1a2e1a"
        />
      ))}

      {/* Ground markers for crew positions */}
      {CREW_POSITIONS.map((crew) => (
        <mesh
          key={`marker-${crew.role}`}
          position={[crew.position[0], 0.01, crew.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.25, 0.3, 32]} />
          <meshBasicMaterial color="#3b5a3b" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
