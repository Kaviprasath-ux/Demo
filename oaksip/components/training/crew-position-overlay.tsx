"use client";

import { useMemo } from "react";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";
import { type GunCategory } from "@/lib/gun-systems";

// Connection line component using drei's Line
function ConnectionLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const points = useMemo(
    () => [
      [start[0], 0.1, start[2]] as [number, number, number],
      [end[0], 0.1, end[2]] as [number, number, number],
    ],
    [start, end]
  );

  return (
    <Line
      points={points}
      color="#888888"
      lineWidth={1}
      transparent
      opacity={0.2}
    />
  );
}

// Position coordinates for crew members based on gun category
// These map crew position IDs to 3D coordinates around the gun model
const towedCrewPositions: Record<string, [number, number, number]> = {
  no1: [1.5, 0.2, -0.3], // Gun Commander - Right side of breech
  no2: [0, 0.2, -1.2], // Breech Operator - Behind breech
  no3: [-1.5, 0.2, -0.3], // Layer - Left side at laying controls
  no4: [-1.2, 0.2, -0.8], // Loader - Left rear of breech
  no5: [-2, 0.2, -2.5], // Ammunition Handler - 5-10m away at ammo point
  no6: [3, 0.2, -3], // Driver - At prime mover
};

// Small arms positions (for individual operators)
const smallArmsPositions: Record<string, [number, number, number]> = {
  shooter: [0, 0.2, -1], // Individual shooter position
  gunner: [0, 0.2, -0.5], // Machine gunner
  assistant: [1, 0.2, -0.5], // Assistant gunner
};

function getCrewPositionCoords(
  category: GunCategory,
  positionId: string
): [number, number, number] {
  switch (category) {
    case "towed":
      return towedCrewPositions[positionId] || [0, 0.5, 0];
    case "assault-rifle":
    case "pistol":
    case "machine-gun":
      return smallArmsPositions[positionId] || [0, 0.2, -1];
    default:
      return towedCrewPositions[positionId] || [0, 0.5, 0];
  }
}

// Role colors for crew position markers
const roleColors: Record<string, string> = {
  Command: "#9333ea", // Purple
  Firing: "#ef4444", // Red
  Laying: "#3b82f6", // Blue
  Loading: "#f59e0b", // Amber
  Ammunition: "#f97316", // Orange
  Support: "#6b7280", // Gray
  Mobility: "#22c55e", // Green
  Primary: "#ef4444", // Red - for small arms operators
};

interface CrewMarkerProps {
  position: [number, number, number];
  label: string;
  role: string;
  isSelected: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

function CrewMarker({
  position,
  label,
  role,
  isSelected,
  isHighlighted = false,
  onClick,
}: CrewMarkerProps) {
  const color = roleColors[role] || "#888888";

  // Create pulsing ring geometry
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(0.2, 0.25, 32);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, []);

  // Create cone geometry for marker
  const coneGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.08, 0.2, 8);
    return geometry;
  }, []);

  return (
    <group position={position}>
      {/* Ground ring indicator */}
      <mesh geometry={ringGeometry} position={[0, 0.01, 0]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical pole */}
      {(isSelected || isHighlighted) && (
        <>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>

          {/* Top marker cone */}
          <mesh geometry={coneGeometry} position={[0, 1.1, 0]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color={color} />
          </mesh>
        </>
      )}

      {/* Clickable area */}
      <mesh
        position={[0, 0.3, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Label */}
      {(isSelected || isHighlighted) && (
        <Html
          position={[0, 1.4, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-background/90 backdrop-blur-sm border border-border text-foreground"
            }`}
            style={{ borderColor: isSelected ? color : undefined }}
          >
            {label}
          </div>
        </Html>
      )}

      {/* Pulsing effect for selected */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Responsibility highlight zone
function ResponsibilityZone({
  position,
  color,
  radius = 0.5,
}: {
  position: [number, number, number];
  color: string;
  radius?: number;
}) {
  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function CrewPositionOverlay() {
  const {
    selectedCrewStation,
    setCrewStation,
    getCrewPositions,
    getGunSystemInfo,
  } = useTrainingStore();

  const crewPositions = getCrewPositions();
  const gunSystem = getGunSystemInfo();
  const category = gunSystem?.category || "towed";

  // Only show crew positions for artillery (towed) - not for small arms
  // Small arms are operated by individuals, crew stations don't apply
  if (category !== "towed") return null;

  if (crewPositions.length === 0) return null;

  return (
    <group>
      {/* Render all crew position markers */}
      {crewPositions.map((crewPos) => {
        const coords = getCrewPositionCoords(category, crewPos.id);
        const isSelected = selectedCrewStation === crewPos.id;
        const color = roleColors[crewPos.role] || "#888888";

        return (
          <group key={crewPos.id}>
            <CrewMarker
              position={coords}
              label={crewPos.title}
              role={crewPos.role}
              isSelected={isSelected}
              isHighlighted={!selectedCrewStation}
              onClick={() =>
                setCrewStation(isSelected ? null : crewPos.id)
              }
            />
            {/* Responsibility zone for selected crew member */}
            {isSelected && (
              <ResponsibilityZone
                position={coords}
                color={color}
                radius={crewPos.role === "Ammunition" ? 1.0 : 0.6}
              />
            )}
          </group>
        );
      })}

      {/* Connection lines between crew members when none selected */}
      {!selectedCrewStation && crewPositions.length > 1 && (
        <group>
          {/* Draw lines from commander to other positions */}
          {crewPositions.slice(1).map((pos) => {
            const commanderPos = getCrewPositionCoords(
              category,
              crewPositions[0].id
            );
            const memberPos = getCrewPositionCoords(category, pos.id);

            return (
              <ConnectionLine
                key={`line-${pos.id}`}
                start={commanderPos}
                end={memberPos}
              />
            );
          })}
        </group>
      )}
    </group>
  );
}

// Compact overlay showing just the selected crew member
export function SelectedCrewIndicator() {
  const { getCrewPositionInfo, getGunSystemInfo } = useTrainingStore();
  const position = getCrewPositionInfo();
  const gunSystem = getGunSystemInfo();

  // Only show for artillery - small arms don't have crew positions
  if (gunSystem?.category !== "towed") return null;

  if (!position) return null;

  const category = gunSystem?.category || "towed";
  const coords = getCrewPositionCoords(category, position.id);
  const color = roleColors[position.role] || "#888888";

  return (
    <group position={coords}>
      {/* Animated highlight */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Direction indicator arrow */}
      <group position={[0, 0.3, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}
