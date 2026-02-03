"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";
import { getComponentById } from "@/lib/gun-data";
import { soundEffects } from "@/lib/sound-effects";
import { getGunSystemById } from "@/lib/gun-systems";

interface GunPartProps {
  id: string;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  explodedOffset?: [number, number, number];
  animateRecoil?: boolean;
}

function GunPart({
  id,
  geometry,
  position,
  rotation = [0, 0, 0],
  color,
  explodedOffset = [0, 0, 0],
  animateRecoil = false,
}: GunPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const {
    selectedComponent,
    setSelectedComponent,
    viewMode,
    showLabels,
    isAnimating,
    currentAnimation,
  } = useTrainingStore();

  const isSelected = selectedComponent === id;
  const component = getComponentById(id);

  const [recoilOffset, setRecoilOffset] = useState(0);

  useEffect(() => {
    if (animateRecoil && currentAnimation === "firing") {
      setRecoilOffset(-0.8);
    } else if (animateRecoil && currentAnimation === "recoil") {
      const returnInterval = setInterval(() => {
        setRecoilOffset((prev) => {
          if (prev >= 0) {
            clearInterval(returnInterval);
            return 0;
          }
          return prev + 0.04;
        });
      }, 50);
      return () => clearInterval(returnInterval);
    } else if (currentAnimation === "none") {
      setRecoilOffset(0);
    }
  }, [animateRecoil, currentAnimation]);

  const targetPosition = useMemo(() => {
    let basePos = position;
    if (viewMode === "exploded") {
      basePos = [
        position[0] + explodedOffset[0],
        position[1] + explodedOffset[1],
        position[2] + explodedOffset[2],
      ] as [number, number, number];
    }
    if (animateRecoil) {
      return [basePos[0], basePos[1], basePos[2] + recoilOffset] as [number, number, number];
    }
    return basePos;
  }, [viewMode, position, explodedOffset, animateRecoil, recoilOffset]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(...targetPosition), 0.15);
    }
  });

  const isXray = viewMode === "xray";

  const materialProps = useMemo(() => {
    const baseOpacity = isXray ? 0.4 : 1;
    const baseTransparent = isXray;

    if (isSelected) {
      return {
        color: "#22c55e",
        emissive: "#22c55e",
        emissiveIntensity: 0.3,
        transparent: baseTransparent,
        opacity: isXray ? 0.7 : 1,
      };
    }
    if (hovered) {
      return {
        color: color,
        emissive: "#ffffff",
        emissiveIntensity: 0.15,
        transparent: baseTransparent,
        opacity: isXray ? 0.6 : 1,
      };
    }
    return {
      color: isXray ? "#4a9eff" : color,
      emissive: isXray ? "#1a5aff" : "#000000",
      emissiveIntensity: isXray ? 0.1 : 0,
      transparent: baseTransparent,
      opacity: baseOpacity,
    };
  }, [isSelected, hovered, color, isXray]);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={position}
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation();
          if (!isAnimating) {
            setSelectedComponent(isSelected ? null : id);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshStandardMaterial
          {...materialProps}
          metalness={isXray ? 0.8 : 0.6}
          roughness={isXray ? 0.2 : 0.4}
          side={isXray ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>

      {showLabels && (hovered || isSelected) && component && (
        <Html
          position={[targetPosition[0], targetPosition[1] + 0.5, targetPosition[2]]}
          center
          distanceFactor={10}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded px-2 py-1 whitespace-nowrap pointer-events-none">
            <span className="text-xs font-medium text-foreground">{component.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Muzzle Flash Effect
function MuzzleFlash() {
  const { currentAnimation, soundEnabled } = useTrainingStore();
  const flashRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (currentAnimation === "firing") {
      setVisible(true);
      setScale(1.5);

      if (soundEnabled) {
        soundEffects.playFiring();
      }

      const flashInterval = setInterval(() => {
        setScale((prev) => prev * 0.85);
      }, 30);

      setTimeout(() => {
        clearInterval(flashInterval);
        setVisible(false);
        setScale(1);
      }, 300);

      return () => clearInterval(flashInterval);
    }
  }, [currentAnimation, soundEnabled]);

  if (!visible) return null;

  return (
    <group position={[0, 0.5, 2.6]}>
      <mesh ref={flashRef} scale={[scale, scale, scale * 2]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
      </mesh>
      <mesh scale={[scale * 0.5, scale * 0.5, scale]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      <pointLight color="#ff6600" intensity={10 * scale} distance={5} />
    </group>
  );
}

// Smoke Particles
function SmokeParticles() {
  const { currentAnimation } = useTrainingStore();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; z: number; scale: number; opacity: number }>
  >([]);

  useEffect(() => {
    if (currentAnimation === "firing" || currentAnimation === "recoil") {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 0.3,
        y: 0.5 + Math.random() * 0.2,
        z: 2.8 + Math.random() * 0.3,
        scale: 0.1 + Math.random() * 0.1,
        opacity: 0.6,
      }));
      setParticles(newParticles);

      const animInterval = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              y: p.y + 0.02,
              z: p.z + 0.01,
              x: p.x + (Math.random() - 0.5) * 0.02,
              scale: p.scale + 0.015,
              opacity: p.opacity - 0.02,
            }))
            .filter((p) => p.opacity > 0)
        );
      }, 50);

      return () => clearInterval(animInterval);
    } else {
      setParticles([]);
    }
  }, [currentAnimation]);

  return (
    <group>
      {particles.map((p) => (
        <mesh key={p.id} position={[p.x, p.y, p.z]} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#888888" transparent opacity={p.opacity} />
        </mesh>
      ))}
    </group>
  );
}

// Fire Button Trigger
export function FireButton() {
  const { triggerFiring, isAnimating } = useTrainingStore();

  return (
    <Html position={[0, 2, 0]} center>
      <button
        onClick={() => !isAnimating && triggerFiring()}
        disabled={isAnimating}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white rounded-lg font-bold text-sm shadow-lg transition-colors"
      >
        {isAnimating ? "FIRING..." : "FIRE!"}
      </button>
    </Html>
  );
}

export function GunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { currentDrill, currentStepIndex, selectedGunSystem } = useTrainingStore();

  // Get gun system configuration
  const gunSystem = getGunSystemById(selectedGunSystem);
  const modelScale = gunSystem?.modelScale || 1.0;
  const primaryColor = gunSystem?.modelColor || "#4a5243";
  const secondaryColor = gunSystem?.modelSecondaryColor || "#3d4339";
  const isAssaultRifle = gunSystem?.category === "assault-rifle";
  const isPistol = gunSystem?.category === "pistol";
  const isMachineGun = gunSystem?.category === "machine-gun";
  const isTowed = gunSystem?.category === "towed";

  // Create geometries for gun parts
  const geometries = useMemo(() => {
    if (isPistol) {
      return {
        barrel: new THREE.BoxGeometry(0.15, 0.12, 0.8),
        breech: new THREE.BoxGeometry(0.12, 0.18, 0.5),
        recoil: new THREE.BoxGeometry(0.08, 0.06, 0.6),
        carriage: new THREE.BoxGeometry(0.1, 0.22, 0.12),
        elevation: new THREE.BoxGeometry(0.04, 0.04, 0.15),
        traverse: new THREE.BoxGeometry(0.02, 0.06, 0.08),
        sights: new THREE.BoxGeometry(0.02, 0.025, 0.02),
        wheel: new THREE.BoxGeometry(0.02, 0.03, 0.04),
        trail: new THREE.BoxGeometry(0.08, 0.02, 0.1),
        spade: new THREE.CylinderGeometry(0.015, 0.015, 0.65, 12),
        muzzleBrake: new THREE.CylinderGeometry(0.03, 0.03, 0.05, 16),
        barrelRing: new THREE.BoxGeometry(0.13, 0.1, 0.02),
        handle: new THREE.BoxGeometry(0.1, 0.04, 0.4),
        barrelSupport: new THREE.BoxGeometry(0.06, 0.08, 0.08),
      };
    }
    if (isAssaultRifle) {
      return {
        barrel: new THREE.CylinderGeometry(0.012, 0.014, 2.0, 16),
        breech: new THREE.BoxGeometry(0.12, 0.14, 0.6),
        recoil: new THREE.BoxGeometry(0.08, 0.1, 0.35),
        carriage: new THREE.BoxGeometry(0.06, 0.08, 0.8),
        elevation: new THREE.BoxGeometry(0.04, 0.025, 0.5),
        traverse: new THREE.BoxGeometry(0.025, 0.06, 0.06),
        sights: new THREE.BoxGeometry(0.025, 0.04, 0.03),
        wheel: new THREE.BoxGeometry(0.04, 0.04, 0.06),
        trail: new THREE.BoxGeometry(0.06, 0.06, 0.5),
        spade: new THREE.BoxGeometry(0.04, 0.04, 0.15),
        muzzleBrake: new THREE.CylinderGeometry(0.018, 0.02, 0.08, 16),
        barrelRing: new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12),
        handle: new THREE.BoxGeometry(0.035, 0.08, 0.04),
        barrelSupport: new THREE.BoxGeometry(0.05, 0.05, 0.08),
      };
    }
    if (isMachineGun) {
      return {
        barrel: new THREE.CylinderGeometry(0.015, 0.018, 2.8, 20),
        breech: new THREE.BoxGeometry(0.14, 0.16, 0.8),
        recoil: new THREE.BoxGeometry(0.25, 0.08, 0.15),
        carriage: new THREE.BoxGeometry(0.06, 0.1, 0.9),
        elevation: new THREE.CylinderGeometry(0.008, 0.008, 0.6, 12),
        traverse: new THREE.BoxGeometry(0.025, 0.07, 0.06),
        sights: new THREE.BoxGeometry(0.03, 0.05, 0.03),
        wheel: new THREE.BoxGeometry(0.05, 0.06, 0.08),
        trail: new THREE.BoxGeometry(0.08, 0.08, 0.6),
        spade: new THREE.BoxGeometry(0.045, 0.05, 0.18),
        muzzleBrake: new THREE.CylinderGeometry(0.022, 0.025, 0.1, 16),
        barrelRing: new THREE.CylinderGeometry(0.02, 0.02, 0.03, 12),
        handle: new THREE.BoxGeometry(0.06, 0.03, 0.12),
        barrelSupport: new THREE.BoxGeometry(0.06, 0.06, 0.1),
        feedCover: new THREE.BoxGeometry(0.12, 0.04, 0.2),
        beltLink: new THREE.BoxGeometry(0.015, 0.025, 0.04),
      };
    }
    // Default: Towed howitzer (Dhanush)
    return {
      barrel: new THREE.CylinderGeometry(0.09, 0.12, 4, 32),
      breech: new THREE.BoxGeometry(0.5, 0.5, 0.7),
      recoil: new THREE.CylinderGeometry(0.07, 0.07, 1.2, 24),
      carriage: new THREE.BoxGeometry(1.0, 0.35, 1.5),
      elevation: new THREE.CylinderGeometry(0.12, 0.12, 0.2, 24),
      traverse: new THREE.CylinderGeometry(0.28, 0.28, 0.12, 32),
      sights: new THREE.BoxGeometry(0.12, 0.2, 0.25),
      wheel: new THREE.TorusGeometry(0.38, 0.1, 24, 48),
      trail: new THREE.BoxGeometry(0.12, 0.1, 3.2),
      spade: new THREE.BoxGeometry(0.35, 0.04, 0.45),
      muzzleBrake: new THREE.CylinderGeometry(0.13, 0.14, 0.25, 24),
      barrelRing: new THREE.TorusGeometry(0.11, 0.02, 12, 32),
      barrelSupport: new THREE.BoxGeometry(0.25, 0.08, 0.15),
      handle: new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12),
      equilibrator: new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16),
      shield: new THREE.BoxGeometry(0.8, 0.6, 0.04),
      axle: new THREE.CylinderGeometry(0.06, 0.06, 1.3, 16),
      wheelHub: new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24),
      trailHinge: new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16),
      sightMount: new THREE.BoxGeometry(0.08, 0.1, 0.15),
      loadingTray: new THREE.BoxGeometry(0.3, 0.05, 0.5),
      breechHandle: new THREE.TorusGeometry(0.08, 0.015, 8, 24),
    };
  }, [isPistol, isAssaultRifle, isMachineGun]);

  // Rotate geometries for towed guns
  useMemo(() => {
    if (isTowed) {
      geometries.barrel.rotateX(Math.PI / 2);
      geometries.recoil.rotateX(Math.PI / 2);
      geometries.elevation.rotateX(Math.PI / 2);
      geometries.wheel.rotateY(Math.PI / 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometries, isTowed]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const highlightComponent = useMemo(() => {
    if (currentDrill && currentDrill.steps[currentStepIndex]) {
      return currentDrill.steps[currentStepIndex].component;
    }
    return null;
  }, [currentDrill, currentStepIndex]);

  const colors = {
    barrel: primaryColor,
    breech: secondaryColor,
    recoil: primaryColor,
    carriage: primaryColor,
    elevation: secondaryColor,
    traverse: primaryColor,
    sights: "#2d302a",
    wheels: "#1a1c18",
    trails: primaryColor,
    spade: secondaryColor,
  };

  // ==================== PISTOL LAYOUT (Glock style) ====================
  if (isPistol) {
    return (
      <group ref={groupRef} position={[0, 1, 0]} rotation={[0, 0, 0]}>
        <MuzzleFlash />
        <SmokeParticles />

        {/* Slide */}
        <mesh position={[0, 0.15, 0.3]}>
          <boxGeometry args={[0.25, 0.18, 1.0]} />
          <meshStandardMaterial color={primaryColor} metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Barrel */}
        <mesh position={[0, 0.12, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Frame */}
        <mesh position={[0, 0.02, 0.15]}>
          <boxGeometry args={[0.22, 0.12, 0.7]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Grip */}
        <mesh position={[0, -0.25, -0.1]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.45, 0.28]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Trigger Guard */}
        <mesh position={[0, -0.08, 0.25]}>
          <boxGeometry args={[0.18, 0.08, 0.2]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Trigger */}
        <mesh position={[0, -0.05, 0.22]}>
          <boxGeometry args={[0.04, 0.12, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Magazine */}
        <mesh position={[0, -0.3, -0.08]}>
          <boxGeometry args={[0.14, 0.35, 0.2]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Front Sight */}
        <mesh position={[0, 0.28, 0.7]}>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Rear Sight */}
        <mesh position={[0, 0.27, -0.1]}>
          <boxGeometry args={[0.12, 0.06, 0.05]} />
          <meshStandardMaterial color={primaryColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // ==================== ASSAULT RIFLE LAYOUT (AK-47) ====================
  if (isAssaultRifle) {
    const woodColor = "#6b4423";
    const metalColor = primaryColor;

    return (
      <group ref={groupRef} position={[0, 1, 0]} rotation={[0, 0, 0]}>
        <MuzzleFlash />
        <SmokeParticles />

        {/* Barrel */}
        <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.045, 1.8, 20]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Muzzle */}
        <mesh position={[0, 0, 2.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Handguard */}
        <mesh position={[0, 0, 1.0]}>
          <boxGeometry args={[0.18, 0.18, 0.9]} />
          <meshStandardMaterial color={woodColor} metalness={0.2} roughness={0.7} />
        </mesh>

        {/* Upper Receiver */}
        <mesh position={[0, 0.05, 0.2]}>
          <boxGeometry args={[0.2, 0.18, 0.8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Lower Receiver */}
        <mesh position={[0, -0.06, 0.15]}>
          <boxGeometry args={[0.18, 0.12, 0.6]} />
          <meshStandardMaterial color={metalColor} metalness={0.75} roughness={0.25} />
        </mesh>

        {/* Magazine */}
        <mesh position={[0, -0.35, 0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.12, 0.45, 0.2]} />
          <meshStandardMaterial color="#4a3020" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Pistol Grip */}
        <mesh position={[0, -0.25, -0.1]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.35, 0.18]} />
          <meshStandardMaterial color={woodColor} metalness={0.2} roughness={0.7} />
        </mesh>

        {/* Stock */}
        <mesh position={[0, 0.02, -0.65]}>
          <boxGeometry args={[0.12, 0.2, 0.9]} />
          <meshStandardMaterial color={woodColor} metalness={0.2} roughness={0.7} />
        </mesh>

        {/* Stock Butt */}
        <mesh position={[0, -0.02, -1.15]}>
          <boxGeometry args={[0.1, 0.25, 0.12]} />
          <meshStandardMaterial color="#3a2015" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Trigger Guard */}
        <mesh position={[0, -0.15, 0.1]}>
          <boxGeometry args={[0.14, 0.08, 0.18]} />
          <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Front Sight */}
        <mesh position={[0, 0.18, 1.8]}>
          <boxGeometry args={[0.06, 0.12, 0.06]} />
          <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Rear Sight */}
        <mesh position={[0, 0.18, 0.1]}>
          <boxGeometry args={[0.08, 0.1, 0.12]} />
          <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Charging Handle */}
        <mesh position={[0.12, 0.08, 0.35]}>
          <boxGeometry args={[0.06, 0.06, 0.15]} />
          <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // ==================== MACHINE GUN LAYOUT (PKM/M249) ====================
  if (isMachineGun) {
    return (
      <group ref={groupRef} position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        <MuzzleFlash />
        <SmokeParticles />

        {/* Heavy Barrel */}
        <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 2.4, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Barrel Jacket */}
        <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.4, 24]} />
          <meshStandardMaterial color={primaryColor} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Flash Hider */}
        <mesh position={[0, 0, 3.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.075, 0.2, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Receiver */}
        <mesh position={[0, 0.03, 0.15]}>
          <boxGeometry args={[0.22, 0.22, 0.8]} />
          <meshStandardMaterial color={primaryColor} metalness={0.75} roughness={0.25} />
        </mesh>

        {/* Feed Cover */}
        <mesh position={[0, 0.16, 0.2]}>
          <boxGeometry args={[0.2, 0.06, 0.35]} />
          <meshStandardMaterial color={primaryColor} metalness={0.65} roughness={0.35} />
        </mesh>

        {/* Carry Handle */}
        <mesh position={[0, 0.22, 0.1]}>
          <boxGeometry args={[0.1, 0.06, 0.2]} />
          <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Ammo Box */}
        <mesh position={[0.25, -0.1, 0.15]}>
          <boxGeometry args={[0.3, 0.18, 0.25]} />
          <meshStandardMaterial color="#4a4a3a" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Pistol Grip */}
        <mesh position={[0, -0.28, -0.12]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.16]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Stock */}
        <mesh position={[0, 0, -0.6]}>
          <boxGeometry args={[0.12, 0.18, 0.9]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Bipod Legs */}
        <mesh position={[-0.12, -0.4, 0.8]} rotation={[0.5, 0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.7, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, -0.4, 0.8]} rotation={[0.5, -0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.7, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Front Sight */}
        <mesh position={[0, 0.14, 2.5]}>
          <boxGeometry args={[0.08, 0.16, 0.08]} />
          <meshStandardMaterial color={primaryColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // ==================== TOWED HOWITZER LAYOUT (Dhanush) ====================
  return (
    <group ref={groupRef} scale={[modelScale, modelScale, modelScale]}>
      <MuzzleFlash />
      <SmokeParticles />

      {/* Main Barrel */}
      <GunPart
        id="barrel"
        geometry={geometries.barrel}
        position={[0, 0.55, 1.5]}
        color={colors.barrel}
        explodedOffset={[0, 1, 1.5]}
        animateRecoil={true}
      />

      {/* Muzzle Brake */}
      <mesh geometry={geometries.muzzleBrake} position={[0, 0.55, 3.6]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2a2d28" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Barrel Rings */}
      {[0.5, 1.2, 2.0, 2.8].map((z, i) => (
        <mesh key={`ring-${i}`} geometry={geometries.barrelRing} position={[0, 0.55, z]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#3a3d38" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Breech Block */}
      <GunPart
        id="breech"
        geometry={geometries.breech}
        position={[0, 0.55, -0.6]}
        color={colors.breech}
        explodedOffset={[0, 0.8, -1]}
        animateRecoil={true}
      />

      {/* Recoil Cylinders */}
      <GunPart
        id="recoil"
        geometry={geometries.recoil}
        position={[0.28, 0.45, 0]}
        color={colors.recoil}
        explodedOffset={[0.9, 0, 0]}
      />
      <mesh geometry={geometries.recoil} position={[-0.28, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={primaryColor} metalness={0.65} roughness={0.35} />
      </mesh>

      {/* Main Carriage */}
      <GunPart
        id="carriage"
        geometry={geometries.carriage}
        position={[0, 0.18, -0.3]}
        color={colors.carriage}
        explodedOffset={[0, -0.6, 0]}
      />

      {/* Gun Shield */}
      <mesh geometry={geometries.shield} position={[0, 0.6, 0.1]}>
        <meshStandardMaterial color={primaryColor} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Elevation Mechanism */}
      <GunPart
        id="elevation"
        geometry={geometries.elevation}
        position={[-0.38, 0.35, -0.5]}
        color={colors.elevation}
        explodedOffset={[-0.7, 0.4, 0]}
      />

      {/* Traverse Ring */}
      <GunPart
        id="traverse"
        geometry={geometries.traverse}
        position={[0, 0.02, -0.3]}
        color={colors.traverse}
        explodedOffset={[0, -0.9, 0]}
      />

      {/* Panoramic Sight */}
      <GunPart
        id="sights"
        geometry={geometries.sights}
        position={[-0.4, 0.82, -0.35]}
        color={colors.sights}
        explodedOffset={[-1.2, 0.6, 0]}
      />

      {/* Axle */}
      <mesh geometry={geometries.axle} position={[0, 0.1, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1c18" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Wheels */}
      <GunPart
        id="wheels"
        geometry={geometries.wheel}
        position={[-0.65, 0.1, 0.05]}
        color={colors.wheels}
        explodedOffset={[-1, 0, 0]}
      />
      <mesh geometry={geometries.wheel} position={[0.65, 0.1, 0.05]}>
        <meshStandardMaterial color={colors.wheels} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Trails */}
      <GunPart
        id="trails"
        geometry={geometries.trail}
        position={[-0.35, 0.05, -2.2]}
        rotation={[0, 0.25, 0]}
        color={colors.trails}
        explodedOffset={[-0.6, 0, -0.6]}
      />
      <mesh geometry={geometries.trail} position={[0.35, 0.05, -2.2]} rotation={[0, -0.25, 0]}>
        <meshStandardMaterial color={colors.trails} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Spades */}
      <GunPart
        id="spade"
        geometry={geometries.spade}
        position={[-0.65, 0.02, -3.5]}
        rotation={[0.35, 0.25, 0]}
        color={colors.spade}
        explodedOffset={[-0.4, -0.4, -0.6]}
      />
      <mesh geometry={geometries.spade} position={[0.65, 0.02, -3.5]} rotation={[0.35, -0.25, 0]}>
        <meshStandardMaterial color={colors.spade} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
