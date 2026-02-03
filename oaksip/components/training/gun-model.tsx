"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";
import { getComponentById } from "@/lib/gun-data";
import { soundEffects } from "@/lib/sound-effects";

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

  // Recoil offset for barrel animation
  const [recoilOffset, setRecoilOffset] = useState(0);

  // Handle recoil animation
  useEffect(() => {
    if (animateRecoil && currentAnimation === "firing") {
      // Quick backward movement
      setRecoilOffset(-0.8);
    } else if (animateRecoil && currentAnimation === "recoil") {
      // Slow return
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

  // Calculate target position based on view mode and recoil
  const targetPosition = useMemo(() => {
    let basePos = position;
    if (viewMode === "exploded") {
      basePos = [
        position[0] + explodedOffset[0],
        position[1] + explodedOffset[1],
        position[2] + explodedOffset[2],
      ] as [number, number, number];
    }
    // Add recoil offset to z position
    if (animateRecoil) {
      return [basePos[0], basePos[1], basePos[2] + recoilOffset] as [number, number, number];
    }
    return basePos;
  }, [viewMode, position, explodedOffset, animateRecoil, recoilOffset]);

  // Animate position smoothly
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(...targetPosition), 0.15);
    }
  });

  // X-ray mode detection
  const isXray = viewMode === "xray";

  // Material with highlight effect and x-ray support
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

      {/* Label */}
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

      // Play firing sound
      if (soundEnabled) {
        soundEffects.playFiring();
      }

      // Animate flash
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
      {/* Main flash */}
      <mesh ref={flashRef} scale={[scale, scale, scale * 2]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
      </mesh>
      {/* Inner bright core */}
      <mesh scale={[scale * 0.5, scale * 0.5, scale]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      {/* Outer glow */}
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
      // Create smoke particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 0.3,
        y: 0.5 + Math.random() * 0.2,
        z: 2.8 + Math.random() * 0.3,
        scale: 0.1 + Math.random() * 0.1,
        opacity: 0.6,
      }));
      setParticles(newParticles);

      // Animate particles
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

// Fire Button Trigger (for manual testing)
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentDrill, currentStepIndex, currentAnimation } = useTrainingStore();

  // Create geometries for gun parts
  const geometries = useMemo(() => {
    return {
      barrel: new THREE.CylinderGeometry(0.08, 0.1, 3, 32),
      breech: new THREE.BoxGeometry(0.4, 0.4, 0.5),
      recoil: new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16),
      carriage: new THREE.BoxGeometry(0.8, 0.3, 1.2),
      elevation: new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16),
      traverse: new THREE.CylinderGeometry(0.2, 0.2, 0.08, 32),
      sights: new THREE.BoxGeometry(0.1, 0.15, 0.2),
      wheel: new THREE.TorusGeometry(0.25, 0.08, 16, 32),
      trail: new THREE.BoxGeometry(0.1, 0.08, 2.5),
      spade: new THREE.BoxGeometry(0.25, 0.02, 0.3),
    };
  }, []);

  // Rotate geometries
  useMemo(() => {
    geometries.barrel.rotateX(Math.PI / 2);
    geometries.recoil.rotateX(Math.PI / 2);
    geometries.elevation.rotateX(Math.PI / 2);
    geometries.wheel.rotateY(Math.PI / 2);
  }, [geometries]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const highlightComponent = useMemo(() => {
    if (currentDrill && currentDrill.steps[currentStepIndex]) {
      return currentDrill.steps[currentStepIndex].component;
    }
    return null;
  }, [currentDrill, currentStepIndex]);

  const colors = {
    barrel: "#4a5243",
    breech: "#3d4137",
    recoil: "#555b4e",
    carriage: "#4a5243",
    elevation: "#3d4137",
    traverse: "#555b4e",
    sights: "#2d302a",
    wheels: "#1a1c18",
    trails: "#4a5243",
    spade: "#3d4137",
  };

  return (
    <group ref={groupRef}>
      {/* Muzzle Flash Effect */}
      <MuzzleFlash />

      {/* Smoke Particles */}
      <SmokeParticles />

      {/* Barrel - with recoil animation */}
      <GunPart
        id="barrel"
        geometry={geometries.barrel}
        position={[0, 0.5, 1]}
        color={colors.barrel}
        explodedOffset={[0, 1, 1]}
        animateRecoil={true}
      />

      {/* Breech Block - with recoil animation */}
      <GunPart
        id="breech"
        geometry={geometries.breech}
        position={[0, 0.5, -0.5]}
        color={colors.breech}
        explodedOffset={[0, 0.8, -0.8]}
        animateRecoil={true}
      />

      {/* Recoil System */}
      <GunPart
        id="recoil"
        geometry={geometries.recoil}
        position={[0.25, 0.35, -0.2]}
        color={colors.recoil}
        explodedOffset={[0.8, 0, 0]}
      />

      {/* Carriage */}
      <GunPart
        id="carriage"
        geometry={geometries.carriage}
        position={[0, 0.15, -0.3]}
        color={colors.carriage}
        explodedOffset={[0, -0.5, 0]}
      />

      {/* Elevation Mechanism */}
      <GunPart
        id="elevation"
        geometry={geometries.elevation}
        position={[-0.3, 0.4, -0.5]}
        color={colors.elevation}
        explodedOffset={[-0.6, 0.3, 0]}
      />

      {/* Traverse Mechanism */}
      <GunPart
        id="traverse"
        geometry={geometries.traverse}
        position={[0, 0, -0.3]}
        color={colors.traverse}
        explodedOffset={[0, -0.8, 0]}
      />

      {/* Sighting System */}
      <GunPart
        id="sights"
        geometry={geometries.sights}
        position={[-0.35, 0.65, -0.3]}
        color={colors.sights}
        explodedOffset={[-1, 0.5, 0]}
      />

      {/* Left Wheel */}
      <GunPart
        id="wheels"
        geometry={geometries.wheel}
        position={[-0.5, 0, 0]}
        color={colors.wheels}
        explodedOffset={[-0.8, 0, 0]}
      />

      {/* Right Wheel */}
      <mesh geometry={geometries.wheel} position={[0.5, 0, 0]}>
        <meshStandardMaterial color={colors.wheels} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Trail */}
      <GunPart
        id="trails"
        geometry={geometries.trail}
        position={[-0.3, 0.04, -1.8]}
        rotation={[0, 0.4, 0]}
        color={colors.trails}
        explodedOffset={[-0.5, 0, -0.5]}
      />

      {/* Right Trail */}
      <mesh geometry={geometries.trail} position={[0.3, 0.04, -1.8]} rotation={[0, -0.4, 0]}>
        <meshStandardMaterial color={colors.trails} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Spade */}
      <GunPart
        id="spade"
        geometry={geometries.spade}
        position={[-0.6, 0, -2.9]}
        rotation={[0.3, 0.4, 0]}
        color={colors.spade}
        explodedOffset={[-0.3, -0.3, -0.5]}
      />

      {/* Right Spade */}
      <mesh geometry={geometries.spade} position={[0.6, 0, -2.9]} rotation={[0.3, -0.4, 0]}>
        <meshStandardMaterial color={colors.spade} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1c18" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
