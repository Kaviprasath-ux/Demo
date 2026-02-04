"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { getHelicopterById, get3DConfig } from "@/lib/helicopter-systems";
import type { ViewMode } from "@/lib/stores/training-store";

interface HelicopterModelProps {
  helicopterId: string;
  viewMode: ViewMode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// ============================================================================
// ROTOR COMPONENT
// ============================================================================

function MainRotor({ radius, speed, blades = 4 }: { radius: number; speed: number; blades?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rotor hub */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rotor blades */}
      {Array.from({ length: blades }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (Math.PI * 2 * i) / blades, 0]}
        >
          <boxGeometry args={[radius * 2, 0.02, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function TailRotor({ radius, speed }: { radius: number; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Tail rotor hub */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Tail rotor blades */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, (Math.PI * i) / 2, 0]}>
          <boxGeometry args={[radius * 2, 0.01, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// FUSELAGE COMPONENTS
// ============================================================================

function AttackHelicopterFuselage({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  return (
    <group>
      {/* Main body - sleek attack profile */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.8, 3.5]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, -0.1, 2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Cockpit canopy */}
      <mesh position={[0, 0.4, 1]}>
        <boxGeometry args={[0.9, 0.4, 1.5]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Tail boom */}
      <mesh position={[0, 0.1, -2.5]}>
        <boxGeometry args={[0.4, 0.4, 3]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Tail fin */}
      <mesh position={[0, 0.5, -3.8]}>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.3, -3.8]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Engine nacelles */}
      <mesh position={[0.5, 0.5, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 16]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[-0.5, 0.5, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 16]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Stub wings for weapons */}
      <mesh position={[1, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-1, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Weapons pylons */}
      {[1.2, 1.6].map((x, i) => (
        <group key={`right-${i}`}>
          <mesh position={[x, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[-x, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Gun turret */}
      <mesh position={[0, -0.4, 1.8]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.4, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Landing skids */}
      <mesh position={[0.5, -0.6, 0]}>
        <boxGeometry args={[0.08, 0.08, 2.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, -0.6, 0]}>
        <boxGeometry args={[0.08, 0.08, 2.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Skid supports */}
      <mesh position={[0.5, -0.35, 0.8]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, -0.35, 0.8]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.5, -0.35, -0.8]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, -0.35, -0.8]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function UtilityHelicopterFuselage({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  return (
    <group>
      {/* Main body - larger utility profile */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.2, 4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Rounded nose */}
      <mesh position={[0, 0, 2.2]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Cockpit windows */}
      <mesh position={[0, 0.3, 1.8]}>
        <boxGeometry args={[1.2, 0.6, 1]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Cabin door areas */}
      <mesh position={[0.76, 0, 0]}>
        <boxGeometry args={[0.02, 0.9, 1.5]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.76, 0, 0]}>
        <boxGeometry args={[0.02, 0.9, 1.5]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>

      {/* Tail boom */}
      <mesh position={[0, 0.2, -3]}>
        <boxGeometry args={[0.5, 0.5, 4]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Tail fin */}
      <mesh position={[0, 0.7, -4.8]}>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Horizontal stabilizer */}
      <mesh position={[0, 0.4, -4.8]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Engine housing on top */}
      <mesh position={[0, 0.8, -0.5]}>
        <boxGeometry args={[1, 0.4, 1.5]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Landing skids */}
      <mesh position={[0.6, -0.8, 0]}>
        <boxGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.6, -0.8, 0]}>
        <boxGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Skid supports */}
      {[-0.8, 0.8].map((z) => (
        <group key={z}>
          <mesh position={[0.6, -0.45, z]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.06, 0.7, 0.06]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[-0.6, -0.45, z]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.06, 0.7, 0.06]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LightHelicopterFuselage({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  return (
    <group>
      {/* Main body - compact light helicopter */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.9, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Bubble cockpit */}
      <mesh position={[0, 0.2, 1]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Tail boom - lighter */}
      <mesh position={[0, 0.1, -2]}>
        <boxGeometry args={[0.3, 0.3, 2.5]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Tail fin */}
      <mesh position={[0, 0.5, -3.1]}>
        <boxGeometry args={[0.08, 0.7, 0.5]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Engine housing */}
      <mesh position={[0, 0.6, -0.3]}>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 16]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Skids */}
      <mesh position={[0.4, -0.6, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-0.4, -0.6, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ============================================================================
// MAIN HELICOPTER MODEL
// ============================================================================

export function HelicopterModel({
  helicopterId,
  viewMode,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: HelicopterModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const helicopter = getHelicopterById(helicopterId);
  const config = get3DConfig(helicopterId);

  const { color, secondaryColor, category, name } = useMemo(() => {
    return {
      color: helicopter?.primaryColor || "#4a5d23",
      secondaryColor: helicopter?.secondaryColor || "#2d3a16",
      category: helicopter?.category || "utility",
      name: helicopter?.name || "Unknown Helicopter",
    };
  }, [helicopter]);

  const scale = config?.scale || 1;
  const rotorSpeed = config?.rotorSpeed || 300;
  const tailRotorSpeed = config?.tailRotorSpeed || 1200;

  // Determine which fuselage to render
  const FuselageComponent = useMemo(() => {
    switch (category) {
      case "attack":
        return AttackHelicopterFuselage;
      case "light":
      case "trainer":
        return LightHelicopterFuselage;
      default:
        return UtilityHelicopterFuselage;
    }
  }, [category]);

  // Rotor positions based on category
  const mainRotorHeight = category === "attack" ? 0.8 : category === "light" ? 0.7 : 1;
  const mainRotorRadius = category === "light" ? 2.5 : 3;
  const tailRotorPosition: [number, number, number] =
    category === "attack" ? [0.25, 0.3, -3.9] :
    category === "light" ? [0.2, 0.3, -3.2] :
    [0.3, 0.5, -4.9];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* Fuselage */}
      <FuselageComponent color={color} secondaryColor={secondaryColor} />

      {/* Main Rotor */}
      <group position={[0, mainRotorHeight, 0]}>
        <MainRotor radius={mainRotorRadius} speed={rotorSpeed} blades={category === "attack" ? 4 : 5} />
      </group>

      {/* Tail Rotor */}
      <group position={tailRotorPosition}>
        <TailRotor radius={0.4} speed={tailRotorSpeed} />
      </group>

      {/* Label */}
      {viewMode !== "cockpit" && (
        <Html position={[0, mainRotorHeight + 1, 0]} center distanceFactor={15}>
          <div className="bg-background/90 px-2 py-1 rounded text-xs font-medium whitespace-nowrap border border-border">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default HelicopterModel;
