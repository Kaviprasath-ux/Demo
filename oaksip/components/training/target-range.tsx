"use client";

import { useRef, useState, useEffect } from "react";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";

// Target distances based on weapon type
const targetDistances = {
  pistol: [10, 15, 25], // meters
  "assault-rifle": [50, 100, 200], // meters
  "machine-gun": [100, 200, 400], // meters
  towed: [5000, 10000, 20000], // meters (artillery)
};

// Scale factors for 3D scene (real meters to scene units)
const scaleFactors = {
  pistol: 0.15,
  "assault-rifle": 0.08,
  "machine-gun": 0.05,
  towed: 0.0005,
};

interface TargetProps {
  position: [number, number, number];
  distance: number;
  size: number;
  isArtillery: boolean;
  onHit: (zone: "center" | "inner" | "outer" | "miss", distance: number) => void;
  lastShotPosition?: THREE.Vector3 | null;
  shotFired: boolean;
}

function Target({ position, distance, size, isArtillery, onHit, lastShotPosition, shotFired }: TargetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hitEffect, setHitEffect] = useState<{ zone: string; pos: THREE.Vector3 } | null>(null);
  const checkedRef = useRef(false);

  // Check for hits when shot is fired
  useEffect(() => {
    let mounted = true;

    if (shotFired && lastShotPosition && !checkedRef.current) {
      checkedRef.current = true;

      // Calculate distance from shot to target center
      const targetPos = new THREE.Vector3(...position);
      const dx = lastShotPosition.x - targetPos.x;
      const dy = lastShotPosition.y - targetPos.y;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Determine hit zone based on distance from center
      const centerRadius = size * 0.15;
      const innerRadius = size * 0.4;
      const outerRadius = size * 0.8;

      let zone: "center" | "inner" | "outer" | "miss";

      if (distanceFromCenter <= centerRadius) {
        zone = "center";
      } else if (distanceFromCenter <= innerRadius) {
        zone = "inner";
      } else if (distanceFromCenter <= outerRadius) {
        zone = "outer";
      } else {
        zone = "miss";
      }

      if (zone !== "miss" && mounted) {
        setHitEffect({ zone, pos: lastShotPosition.clone() });
        setTimeout(() => {
          if (mounted) setHitEffect(null);
        }, 2000);
      }

      onHit(zone, distance);
    }

    return () => {
      mounted = false;
    };
  }, [shotFired, lastShotPosition, position, size, onHit, distance]);

  // Reset checked state when new shot cycle begins
  useEffect(() => {
    if (!shotFired) {
      checkedRef.current = false;
    }
  }, [shotFired]);

  const ringColors = isArtillery
    ? ["#ff0000", "#ff6600", "#ffcc00", "#ffffff", "#000000"]
    : ["#ffcc00", "#ff0000", "#0066ff", "#000000", "#ffffff"];

  return (
    <group ref={groupRef} position={position}>
      {/* Billboard makes target always face camera */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Target backing */}
        <mesh>
          <circleGeometry args={[size, 32]} />
          <meshStandardMaterial color="#f5f5dc" side={THREE.DoubleSide} />
        </mesh>

        {/* Concentric rings */}
        {[0.8, 0.6, 0.4, 0.25, 0.1].map((scale, i) => (
          <mesh key={i} position={[0, 0, 0.01 + i * 0.005]}>
            <circleGeometry args={[size * scale, 32]} />
            <meshStandardMaterial color={ringColors[i]} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Center bullseye */}
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[size * 0.05, 16]} />
          <meshStandardMaterial color={isArtillery ? "#ffffff" : "#ffcc00"} side={THREE.DoubleSide} />
        </mesh>

        {/* Hit effect */}
        {hitEffect && (
          <group position={[0, 0, 0.1]}>
            <mesh>
              <circleGeometry args={[size * 0.08, 16]} />
              <meshBasicMaterial
                color={hitEffect.zone === "center" ? "#00ff00" : hitEffect.zone === "inner" ? "#ffff00" : "#ff6600"}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        )}
      </Billboard>

      {/* Distance label */}
      <Html position={[0, -size - 0.3, 0]} center>
        <div className="px-2 py-1 bg-black/80 rounded text-white text-xs font-bold whitespace-nowrap">
          {distance >= 1000 ? `${distance / 1000}km` : `${distance}m`}
        </div>
      </Html>

      {/* Hit feedback label */}
      {hitEffect && (
        <Html position={[0, size + 0.3, 0]} center>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            hitEffect.zone === "center" ? "bg-green-500 text-white" :
            hitEffect.zone === "inner" ? "bg-yellow-500 text-black" :
            "bg-orange-500 text-white"
          }`}>
            {hitEffect.zone === "center" ? "BULLSEYE!" : hitEffect.zone === "inner" ? "GOOD" : "HIT"}
          </div>
        </Html>
      )}

      {/* Target stand (for small arms) - fixed position, doesn't rotate */}
      {!isArtillery && (
        <>
          <mesh position={[0, -size - 0.5, 0]}>
            <boxGeometry args={[0.1, size, 0.05]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          <mesh position={[0, -size * 1.5 - 0.5, 0]}>
            <boxGeometry args={[size * 0.8, 0.1, 0.3]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        </>
      )}
    </group>
  );
}

// Artillery target (area target on ground)
function ArtilleryTarget({ position, distance, size, onHit, lastShotPosition, shotFired }: TargetProps) {
  const [hitEffect, setHitEffect] = useState<THREE.Vector3 | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    if (shotFired && lastShotPosition && !checkedRef.current) {
      checkedRef.current = true;

      const targetPos = new THREE.Vector3(position[0], 0, position[2]);
      const shotPos = new THREE.Vector3(lastShotPosition.x, 0, lastShotPosition.z);
      const distanceFromCenter = targetPos.distanceTo(shotPos);

      const centerRadius = size * 0.2;
      const innerRadius = size * 0.5;
      const outerRadius = size;

      let zone: "center" | "inner" | "outer" | "miss";

      if (distanceFromCenter <= centerRadius) {
        zone = "center";
      } else if (distanceFromCenter <= innerRadius) {
        zone = "inner";
      } else if (distanceFromCenter <= outerRadius) {
        zone = "outer";
      } else {
        zone = "miss";
      }

      if (zone !== "miss" && mounted) {
        setHitEffect(lastShotPosition.clone());
        setTimeout(() => {
          if (mounted) setHitEffect(null);
        }, 3000);
      }

      onHit(zone, distance);
    }

    return () => {
      mounted = false;
    };
  }, [shotFired, lastShotPosition, position, size, onHit, distance]);

  useEffect(() => {
    if (!shotFired) {
      checkedRef.current = false;
    }
  }, [shotFired]);

  return (
    <group position={position}>
      {/* Ground target rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[size * 0.9, size, 32]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[size * 0.4, size * 0.6, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[size * 0.2, 32]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Center marker */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Distance label */}
      <Html position={[0, 0.5, 0]} center>
        <div className="px-2 py-1 bg-red-600/90 rounded text-white text-xs font-bold whitespace-nowrap">
          TARGET: {distance >= 1000 ? `${distance / 1000}km` : `${distance}m`}
        </div>
      </Html>

      {/* Impact marker */}
      {hitEffect && (
        <group position={[hitEffect.x - position[0], 0.1, hitEffect.z - position[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.5, 16]} />
            <meshBasicMaterial color="#ff3300" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          <Html center position={[0, 0.5, 0]}>
            <div className="px-2 py-1 bg-green-600 rounded text-white text-xs font-bold">
              IMPACT!
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

export function TargetRange() {
  const {
    currentAnimation,
    getGunSystemInfo,
    recordShot,
  } = useTrainingStore();

  const gunSystem = getGunSystemInfo();
  const category = gunSystem?.category || "assault-rifle";
  const isArtillery = category === "towed";

  const [lastShotPosition, setLastShotPosition] = useState<THREE.Vector3 | null>(null);
  const [shotFired, setShotFired] = useState(false);

  // Get distances and scale for current weapon
  const distances = targetDistances[category] || targetDistances["assault-rifle"];
  const scale = scaleFactors[category] || scaleFactors["assault-rifle"];

  // Simulate shot landing position (with some randomness for realism)
  useEffect(() => {
    if (currentAnimation === "firing") {
      setShotFired(true);

      // Calculate where shot lands (center target with some spread)
      const targetDistance = distances[1]; // Middle target
      const spread = isArtillery ? targetDistance * 0.05 : 0.3; // Artillery has larger spread

      const x = (Math.random() - 0.5) * spread;
      const y = isArtillery ? 0 : 1 + (Math.random() - 0.5) * spread;
      const z = targetDistance * scale + (Math.random() - 0.5) * spread * 0.5;

      // Delay to simulate projectile travel
      const delay = isArtillery ? 2000 : 100;
      setTimeout(() => {
        setLastShotPosition(new THREE.Vector3(x, y, z));
      }, delay);
    } else if (currentAnimation === "none") {
      // Reset after animation completes
      setTimeout(() => {
        setShotFired(false);
        setLastShotPosition(null);
      }, 3000);
    }
  }, [currentAnimation, distances, scale, isArtillery]);

  const handleHit = (zone: "center" | "inner" | "outer" | "miss", distance: number) => {
    const points = zone === "center" ? 100 : zone === "inner" ? 75 : zone === "outer" ? 50 : 0;
    recordShot(zone !== "miss", points, distance);
  };

  // Target size based on weapon type
  const targetSize = isArtillery ? 2 : category === "pistol" ? 0.5 : 0.8;

  return (
    <group>
      {distances.map((distance, index) => {
        const zPos = distance * scale;
        const xOffset = (index - 1) * (isArtillery ? 3 : targetSize * 3);

        if (isArtillery) {
          return (
            <ArtilleryTarget
              key={distance}
              position={[xOffset, 0, zPos]}
              distance={distance}
              size={targetSize}
              isArtillery={true}
              onHit={handleHit}
              lastShotPosition={lastShotPosition}
              shotFired={shotFired}
            />
          );
        }

        return (
          <Target
            key={distance}
            position={[xOffset, 1, zPos]}
            distance={distance}
            size={targetSize}
            isArtillery={false}
            onHit={handleHit}
            lastShotPosition={lastShotPosition}
            shotFired={shotFired}
          />
        );
      })}

      {/* Range floor markings */}
      {!isArtillery && distances.map((distance) => {
        const zPos = distance * scale;
        return (
          <group key={`marker-${distance}`} position={[0, 0.01, zPos]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4, 0.1]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
