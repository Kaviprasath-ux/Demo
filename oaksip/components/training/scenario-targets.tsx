"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ScenarioTargetProps {
  type: "static" | "popup" | "moving" | "hostile" | "civilian";
  position: [number, number, number];
  distance: number;
  isActive: boolean;
  isHit: boolean;
  size?: number;
}

// Individual target component
export function ScenarioTarget({
  type,
  position,
  distance,
  isActive,
  isHit,
  size = 0.5,
}: ScenarioTargetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [popupProgress, setPopupProgress] = useState(0);
  const [hitAnimation, setHitAnimation] = useState(0);

  // Popup animation
  useFrame((state, delta) => {
    if (type === "popup" && groupRef.current) {
      if (isActive && popupProgress < 1) {
        setPopupProgress((prev) => Math.min(prev + delta * 4, 1));
      } else if (!isActive && popupProgress > 0) {
        setPopupProgress((prev) => Math.max(prev - delta * 4, 0));
      }
      groupRef.current.scale.y = popupProgress;
    }

    // Hit animation
    if (isHit && hitAnimation < 1) {
      setHitAnimation((prev) => Math.min(prev + delta * 3, 1));
    }
  });

  // Reset on active change
  useEffect(() => {
    if (isActive) {
      setPopupProgress(type === "popup" ? 0 : 1);
    }
    if (!isHit) {
      setHitAnimation(0);
    }
  }, [isActive, isHit, type]);

  if (!isActive && type !== "popup") return null;
  if (type === "popup" && popupProgress === 0 && !isActive) return null;

  const isCivilian = type === "civilian";
  const isHostile = type === "hostile" || type === "moving";

  // Colors based on target type
  const primaryColor = isHit
    ? "#666666"
    : isCivilian
    ? "#3b82f6" // Blue for civilians
    : "#ef4444"; // Red for hostiles

  const secondaryColor = isHit
    ? "#444444"
    : isCivilian
    ? "#1d4ed8"
    : "#dc2626";

  return (
    <group ref={groupRef} position={position}>
      {/* Target silhouette */}
      <group rotation={[0, 0, 0]} position={[0, isHit ? -size * hitAnimation * 0.5 : 0, 0]}>
        {/* Body */}
        <mesh position={[0, size * 0.3, 0]}>
          <boxGeometry args={[size * 0.6, size * 0.8, 0.05]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={isHit ? 0.3 : 0.9}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, size * 0.85, 0]}>
          <sphereGeometry args={[size * 0.2, 16, 16]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={isHit ? 0.3 : 0.9}
          />
        </mesh>

        {/* Type indicator ring */}
        <mesh position={[0, size * 0.3, 0.03]} rotation={[0, 0, 0]}>
          <ringGeometry args={[size * 0.35, size * 0.4, 32]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={isHit ? 0.2 : 0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Civilian marker (if civilian) */}
        {isCivilian && !isHit && (
          <mesh position={[0, size * 1.1, 0.05]}>
            <planeGeometry args={[size * 0.3, size * 0.15]} />
            <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Hit marker */}
        {isHit && (
          <mesh position={[0, size * 0.3, 0.06]}>
            <ringGeometry args={[size * 0.1, size * 0.15, 16]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* Stand */}
      <mesh position={[0, -size * 0.3, 0]}>
        <boxGeometry args={[0.05, size * 0.6, 0.05]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>

      {/* Base */}
      <mesh position={[0, -size * 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[size * 0.3, 16]} />
        <meshStandardMaterial color="#3a2718" />
      </mesh>

      {/* Distance label */}
      {isActive && !isHit && (
        <Html position={[0, -size * 0.8, 0]} center>
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
              isCivilian
                ? "bg-blue-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {isCivilian ? "CIVILIAN" : "HOSTILE"} • {distance}m
          </div>
        </Html>
      )}

      {/* Hit feedback */}
      {isHit && (
        <Html position={[0, size * 0.5, 0]} center>
          <div className="px-2 py-1 bg-green-500/90 rounded text-white text-xs font-bold animate-bounce">
            HIT!
          </div>
        </Html>
      )}

      {/* Pulsing ring for active hostile targets */}
      {isActive && !isHit && isHostile && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.8, size * 0.9, 32]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.3 + Math.sin(Date.now() * 0.005) * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Moving target that follows a path
interface MovingTargetProps extends ScenarioTargetProps {
  id: string;
  moveSpeed?: number;
  startTime: number;
}

export function MovingTarget({
  id,
  position,
  distance,
  isActive,
  isHit,
  size = 0.5,
  moveSpeed = 1,
  startTime,
}: MovingTargetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPos, setCurrentPos] = useState<[number, number, number]>(position);

  useFrame(() => {
    if (!isActive || isHit || !groupRef.current) return;

    const elapsed = (Date.now() - startTime) / 1000;
    const movement = Math.sin(elapsed * moveSpeed) * 2;

    setCurrentPos([position[0] + movement, position[1], position[2]]);
    groupRef.current.position.x = position[0] + movement;
  });

  // Suppress unused id warning - used for key in parent
  void id;

  return (
    <group ref={groupRef}>
      <ScenarioTarget
        type="moving"
        position={currentPos}
        distance={distance}
        isActive={isActive}
        isHit={isHit}
        size={size}
      />
    </group>
  );
}

// Target array manager for scenarios
interface ScenarioTargetsManagerProps {
  targets: Array<{
    id: string;
    type: "static" | "popup" | "moving" | "hostile" | "civilian";
    position: [number, number, number];
    distance: number;
    appearTime?: number;
    disappearTime?: number;
    moveSpeed?: number;
  }>;
  activeTargetIds: string[];
  hitTargetIds: string[];
  scenarioStartTime: number;
}

export function ScenarioTargetsManager({
  targets,
  activeTargetIds,
  hitTargetIds,
  scenarioStartTime,
}: ScenarioTargetsManagerProps) {
  // Scale positions to fit scene
  const scaledTargets = useMemo(() => {
    return targets.map((t) => ({
      ...t,
      scaledPosition: [
        t.position[0],
        t.position[1],
        t.position[2] * 0.5, // Scale Z for scene fit
      ] as [number, number, number],
    }));
  }, [targets]);

  return (
    <group>
      {scaledTargets.map((target) => {
        const isActive = activeTargetIds.includes(target.id);
        const isHit = hitTargetIds.includes(target.id);

        if (target.type === "moving") {
          return (
            <MovingTarget
              key={target.id}
              id={target.id}
              type={target.type}
              position={target.scaledPosition}
              distance={target.distance}
              isActive={isActive}
              isHit={isHit}
              moveSpeed={target.moveSpeed}
              startTime={scenarioStartTime}
            />
          );
        }

        return (
          <ScenarioTarget
            key={target.id}
            type={target.type}
            position={target.scaledPosition}
            distance={target.distance}
            isActive={isActive}
            isHit={isHit}
          />
        );
      })}
    </group>
  );
}
