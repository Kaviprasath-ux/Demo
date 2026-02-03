"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";

interface SoldierProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  stance?: "standing" | "kneeling" | "prone" | "crew";
  role?: string;
  animateRecoil?: boolean;
  uniformColor?: string;
}

// Individual soldier figure using primitives
export function Soldier({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  stance = "standing",
  animateRecoil = false,
  uniformColor = "#4a5243", // OD Green
}: SoldierProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { currentAnimation } = useTrainingStore();
  const recoilRef = useRef(0);

  // Animate recoil when firing
  useFrame((_, delta) => {
    if (!groupRef.current || !animateRecoil) return;

    if (currentAnimation === "firing") {
      recoilRef.current = Math.min(recoilRef.current + delta * 15, 0.15);
    } else {
      recoilRef.current = Math.max(recoilRef.current - delta * 5, 0);
    }

    // Apply subtle body recoil
    groupRef.current.position.z = position[2] - recoilRef.current * 0.3;
  });

  const skinColor = "#d4a574";
  const bootColor = "#2a2a2a";
  const helmetColor = "#3d4a3a";

  // Adjust heights based on stance
  const stanceOffsets = {
    standing: { bodyY: 0.65, headY: 1.35, legY: 0.2 },
    kneeling: { bodyY: 0.4, headY: 1.0, legY: 0.1 },
    prone: { bodyY: 0.15, headY: 0.25, legY: 0.1 },
    crew: { bodyY: 0.65, headY: 1.35, legY: 0.2 },
  };

  const offsets = stanceOffsets[stance];

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Helmet */}
      <mesh position={[0, offsets.headY + 0.15, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={helmetColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0, offsets.headY, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Body/Torso */}
      <mesh position={[0, offsets.bodyY, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.2]} />
        <meshStandardMaterial color={uniformColor} />
      </mesh>

      {/* Tactical vest */}
      <mesh position={[0, offsets.bodyY + 0.05, 0.05]}>
        <boxGeometry args={[0.38, 0.4, 0.15]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {stance === "standing" || stance === "crew" ? (
        <>
          {/* Standing legs */}
          <mesh position={[-0.08, offsets.legY, 0]}>
            <boxGeometry args={[0.12, 0.4, 0.12]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          <mesh position={[0.08, offsets.legY, 0]}>
            <boxGeometry args={[0.12, 0.4, 0.12]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          {/* Boots */}
          <mesh position={[-0.08, 0.02, 0.02]}>
            <boxGeometry args={[0.1, 0.08, 0.18]} />
            <meshStandardMaterial color={bootColor} />
          </mesh>
          <mesh position={[0.08, 0.02, 0.02]}>
            <boxGeometry args={[0.1, 0.08, 0.18]} />
            <meshStandardMaterial color={bootColor} />
          </mesh>
        </>
      ) : stance === "kneeling" ? (
        <>
          {/* Kneeling - one leg forward, one back */}
          <mesh position={[-0.1, 0.15, 0.1]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.12]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          <mesh position={[0.1, 0.08, -0.1]} rotation={[-1.2, 0, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.12]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
        </>
      ) : (
        <>
          {/* Prone - legs stretched back */}
          <mesh position={[0, 0.08, -0.4]} rotation={[-1.5, 0, 0]}>
            <boxGeometry args={[0.25, 0.5, 0.12]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
        </>
      )}

      {/* Arms - positioned for holding weapon */}
      {stance !== "prone" ? (
        <>
          {/* Left arm (forward, supporting weapon) */}
          <mesh position={[-0.22, offsets.bodyY + 0.1, 0.15]} rotation={[0.8, 0, 0.3]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          {/* Left hand */}
          <mesh position={[-0.2, offsets.bodyY - 0.05, 0.3]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>

          {/* Right arm (back, on trigger) */}
          <mesh position={[0.22, offsets.bodyY + 0.05, 0.1]} rotation={[0.5, 0, -0.3]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          {/* Right hand */}
          <mesh position={[0.18, offsets.bodyY - 0.1, 0.2]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </>
      ) : (
        <>
          {/* Prone arms - extended forward */}
          <mesh position={[-0.12, 0.12, 0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.25, 0.08]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
          <mesh position={[0.12, 0.12, 0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.25, 0.08]} />
            <meshStandardMaterial color={uniformColor} />
          </mesh>
        </>
      )}

    </group>
  );
}

// Small arms shooter - soldier holding rifle/pistol
export function SmallArmsShooter() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  // Only show for small arms
  const category = gunSystem?.category;
  if (category === "towed") return null;

  // Determine stance based on weapon
  let stance: "standing" | "kneeling" | "prone" = "standing";
  let position: [number, number, number] = [0, 0, -0.3];

  if (category === "machine-gun") {
    stance = "prone";
    position = [0, 0, -0.5];
  } else if (category === "assault-rifle") {
    stance = "standing";
    position = [0, 0, -0.35];
  } else if (category === "pistol") {
    stance = "standing";
    position = [0, 0, -0.25];
  }

  return (
    <group>
      <Soldier
        position={position}
        stance={stance}
        animateRecoil={true}
      />
    </group>
  );
}

// Artillery crew - multiple soldiers at their stations
export function ArtilleryCrew() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  // Only show for artillery (towed)
  if (gunSystem?.category !== "towed") return null;

  // Crew positions around the artillery piece
  const crewPositions: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    role: string;
  }> = [
    // Gunner - at the sight/controls (right side)
    { position: [1.2, 0, 1.5], rotation: [0, -Math.PI / 2, 0], role: "Gunner" },
    // Assistant Gunner - left side of breech
    { position: [-1.2, 0, 1.8], rotation: [0, Math.PI / 2, 0], role: "Asst Gunner" },
    // Loader - behind the breech
    { position: [0, 0, -0.5], rotation: [0, 0, 0], role: "Loader" },
    // Ammo Handler 1 - bringing shells
    { position: [-2, 0, 0], rotation: [0, Math.PI / 4, 0], role: "Ammo #1" },
    // Ammo Handler 2
    { position: [-2.5, 0, -1], rotation: [0, Math.PI / 3, 0], role: "Ammo #2" },
    // Section Chief - overseeing operation (stands back)
    { position: [2.5, 0, -0.5], rotation: [0, -Math.PI / 4, 0], role: "Chief" },
  ];

  return (
    <group>
      {crewPositions.map((crew, index) => (
        <group key={index} position={crew.position} rotation={crew.rotation}>
          <Soldier
            stance="crew"
            role={crew.role}
            animateRecoil={index < 3} // Only front crew react to recoil
          />
          {/* Role label */}
          <RoleLabel role={crew.role} />
        </group>
      ))}
    </group>
  );
}

// Role label component with Html text
function RoleLabel({ role }: { role: string }) {
  return (
    <Html position={[0, 1.8, 0]} center>
      <div className="px-2 py-1 bg-blue-900/90 rounded text-white text-[10px] font-bold whitespace-nowrap border border-blue-500/50">
        {role}
      </div>
    </Html>
  );
}
