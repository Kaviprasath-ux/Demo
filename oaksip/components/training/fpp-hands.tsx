"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";

// Realistic skin tones
const SKIN_TONES = {
  light: "#e8beac",
  medium: "#d4a574",
  tan: "#c19a6b",
};

// Single finger component
function Finger({
  position,
  rotation,
  length = 0.08,
  radius = 0.012,
  segments = 3,
  bent = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length?: number;
  radius?: number;
  segments?: number;
  bent?: number;
}) {
  const segmentLength = length / segments;

  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: segments }).map((_, i) => {
        const bendAngle = bent * (i + 1) * 0.3;
        const yOffset = i * segmentLength * 0.95;

        return (
          <group key={i} position={[0, yOffset, 0]} rotation={[bendAngle, 0, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[radius * (1 - i * 0.1), segmentLength, 4, 8]} />
              <meshStandardMaterial
                color={SKIN_TONES.medium}
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
            {/* Knuckle joint */}
            {i < segments - 1 && (
              <mesh position={[0, segmentLength * 0.5, 0]} castShadow>
                <sphereGeometry args={[radius * 1.1, 8, 8]} />
                <meshStandardMaterial color={SKIN_TONES.medium} roughness={0.7} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Complete hand with all fingers
function Hand({
  position,
  rotation,
  isLeft = false,
  gripStrength = 0.8, // How bent the fingers are (0-1)
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isLeft?: boolean;
  gripStrength?: number;
  scale?: number;
}) {
  const mirror = isLeft ? -1 : 1;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Palm */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.1, 0.03]} />
        <meshStandardMaterial color={SKIN_TONES.medium} roughness={0.7} />
      </mesh>

      {/* Palm back (more rounded) */}
      <mesh position={[0, 0, -0.01]} castShadow>
        <boxGeometry args={[0.075, 0.09, 0.025]} />
        <meshStandardMaterial color={SKIN_TONES.medium} roughness={0.7} />
      </mesh>

      {/* Wrist */}
      <mesh position={[0, -0.07, 0]} castShadow>
        <capsuleGeometry args={[0.025, 0.06, 4, 8]} />
        <meshStandardMaterial color={SKIN_TONES.medium} roughness={0.7} />
      </mesh>

      {/* Thumb */}
      <group position={[0.04 * mirror, 0, 0.01]} rotation={[0.3, 0.5 * mirror, 0.8 * mirror]}>
        <Finger
          position={[0, 0, 0]}
          rotation={[gripStrength * 0.5, 0, 0]}
          length={0.055}
          radius={0.014}
          segments={2}
          bent={gripStrength * 0.6}
        />
      </group>

      {/* Index finger */}
      <Finger
        position={[0.028 * mirror, 0.05, 0.01]}
        rotation={[gripStrength * 1.2, 0, 0.05 * mirror]}
        length={0.075}
        radius={0.011}
        bent={gripStrength}
      />

      {/* Middle finger */}
      <Finger
        position={[0.01 * mirror, 0.055, 0.01]}
        rotation={[gripStrength * 1.3, 0, 0]}
        length={0.08}
        radius={0.011}
        bent={gripStrength}
      />

      {/* Ring finger */}
      <Finger
        position={[-0.01 * mirror, 0.052, 0.01]}
        rotation={[gripStrength * 1.3, 0, -0.05 * mirror]}
        length={0.073}
        radius={0.01}
        bent={gripStrength}
      />

      {/* Pinky */}
      <Finger
        position={[-0.028 * mirror, 0.045, 0.01]}
        rotation={[gripStrength * 1.4, 0, -0.1 * mirror]}
        length={0.058}
        radius={0.009}
        bent={gripStrength}
      />
    </group>
  );
}

// Forearm sleeve (military uniform)
function Forearm({
  position,
  rotation,
  isLeft = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isLeft?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Forearm - uniform sleeve */}
      <mesh castShadow>
        <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
        <meshStandardMaterial color="#4a5243" roughness={0.9} /> {/* OD Green */}
      </mesh>

      {/* Sleeve cuff */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.036, 0.03, 16]} />
        <meshStandardMaterial color="#3d4636" roughness={0.9} />
      </mesh>

      {/* Wrist area (skin showing) */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <capsuleGeometry args={[0.028, 0.03, 4, 8]} />
        <meshStandardMaterial color={SKIN_TONES.medium} roughness={0.7} />
      </mesh>
    </group>
  );
}

// FPP Hands for weapons - positioned to grip the gun
export function FPPHands() {
  const { getGunSystemInfo, currentAnimation } = useTrainingStore();
  const gunSystem = getGunSystemInfo();
  const groupRef = useRef<THREE.Group>(null);
  const recoilRef = useRef(0);

  const category = gunSystem?.category;

  // Animation for recoil
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (currentAnimation === "firing") {
      recoilRef.current = Math.min(recoilRef.current + delta * 15, 0.05);
    } else {
      recoilRef.current = Math.max(recoilRef.current - delta * 8, 0);
    }

    // Apply recoil to hands
    groupRef.current.position.z = -recoilRef.current;
    groupRef.current.rotation.x = recoilRef.current * 2;
  });

  // Only show for small arms (not artillery)
  if (category === "towed") return null;

  // Different hand positions based on weapon type
  const getHandPositions = () => {
    switch (category) {
      case "pistol":
        return {
          rightHand: { pos: [0.02, -0.05, -0.08] as [number, number, number], rot: [-0.3, 0, 0.1] as [number, number, number] },
          leftHand: { pos: [-0.03, -0.06, -0.05] as [number, number, number], rot: [-0.4, 0.3, -0.2] as [number, number, number] },
          rightArm: { pos: [0.08, -0.2, -0.15] as [number, number, number], rot: [-0.8, 0, 0.3] as [number, number, number] },
          leftArm: { pos: [-0.1, -0.22, -0.1] as [number, number, number], rot: [-0.7, 0, -0.4] as [number, number, number] },
          grip: 0.9,
        };
      case "machine-gun":
        return {
          rightHand: { pos: [0.05, 0.02, -0.3] as [number, number, number], rot: [-0.2, 0, 0.1] as [number, number, number] },
          leftHand: { pos: [-0.08, 0.05, 0.15] as [number, number, number], rot: [-0.5, 0.2, -0.3] as [number, number, number] },
          rightArm: { pos: [0.12, -0.12, -0.4] as [number, number, number], rot: [-0.5, 0, 0.2] as [number, number, number] },
          leftArm: { pos: [-0.15, -0.1, 0.05] as [number, number, number], rot: [-0.3, 0.1, -0.3] as [number, number, number] },
          grip: 0.75,
        };
      default: // assault-rifle
        return {
          rightHand: { pos: [0.04, -0.02, -0.15] as [number, number, number], rot: [-0.3, 0, 0.15] as [number, number, number] },
          leftHand: { pos: [-0.04, 0.02, 0.2] as [number, number, number], rot: [-0.6, 0.2, -0.2] as [number, number, number] },
          rightArm: { pos: [0.1, -0.18, -0.25] as [number, number, number], rot: [-0.6, 0, 0.25] as [number, number, number] },
          leftArm: { pos: [-0.12, -0.15, 0.1] as [number, number, number], rot: [-0.4, 0.1, -0.25] as [number, number, number] },
          grip: 0.85,
        };
    }
  };

  const positions = getHandPositions();

  return (
    <group ref={groupRef}>
      {/* Right hand (trigger hand) */}
      <Hand
        position={positions.rightHand.pos}
        rotation={positions.rightHand.rot}
        isLeft={false}
        gripStrength={positions.grip}
        scale={1.1}
      />

      {/* Left hand (support hand) */}
      <Hand
        position={positions.leftHand.pos}
        rotation={positions.leftHand.rot}
        isLeft={true}
        gripStrength={positions.grip * 0.9}
        scale={1.1}
      />

      {/* Right forearm */}
      <Forearm
        position={positions.rightArm.pos}
        rotation={positions.rightArm.rot}
        isLeft={false}
      />

      {/* Left forearm */}
      <Forearm
        position={positions.leftArm.pos}
        rotation={positions.leftArm.rot}
        isLeft={true}
      />
    </group>
  );
}
