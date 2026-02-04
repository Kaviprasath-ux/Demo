"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import type { ArtilleryPosition, NoFlyZone } from "@/lib/stores/training-store";

interface ArtilleryOverlayProps {
  positions: ArtilleryPosition[];
  noFlyZones: NoFlyZone[];
  showNFZs?: boolean;
  showLabels?: boolean;
}

// Scale factor to convert coordinates to scene units
const SCALE = 0.001;
const BASE_LAT = 34.0;
const BASE_LNG = 74.7;

function coordToScene(lat: number, lng: number, altitude: number = 0): [number, number, number] {
  const x = (lng - BASE_LNG) * 10000 * SCALE;
  const z = -(lat - BASE_LAT) * 10000 * SCALE;
  const y = altitude * SCALE;
  return [x, y, z];
}

// ============================================================================
// ARTILLERY POSITION MARKER
// ============================================================================

function ArtilleryPositionMarker({
  position,
  showLabel,
}: {
  position: ArtilleryPosition;
  showLabel: boolean;
}) {
  const scenePosition = coordToScene(position.coordinates.lat, position.coordinates.lng, 0);

  // Create firing arc visualization
  const arcPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    const range = position.maxRange * SCALE;
    const startAngle = (position.firingArcMin * Math.PI) / 180;
    const endAngle = (position.firingArcMax * Math.PI) / 180;
    const steps = 32;

    // Start at gun position
    points.push([0, 0.1, 0]);

    // Arc at max range
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + ((endAngle - startAngle) * i) / steps;
      const x = Math.sin(angle) * range;
      const z = Math.cos(angle) * range;
      points.push([x, 0.1, z]);
    }

    // Back to gun position
    points.push([0, 0.1, 0]);

    return points;
  }, [position]);

  // Create max ordinate arc (shell trajectory height)
  const maxOrdinateArc = useMemo(() => {
    const points: [number, number, number][] = [];
    const range = position.maxRange * SCALE * 0.5;
    const maxHeight = range * 0.3; // Approximate max ordinate
    const startAngle = (position.firingArcMin * Math.PI) / 180;
    const endAngle = (position.firingArcMax * Math.PI) / 180;
    const midAngle = (startAngle + endAngle) / 2;

    // Create a parabolic arc showing shell trajectory envelope
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = range * t;
      const h = 4 * maxHeight * t * (1 - t); // Parabolic arc
      const x = Math.sin(midAngle) * r;
      const z = Math.cos(midAngle) * r;
      points.push([x, h, z]);
    }

    return points;
  }, [position]);

  if (!position.active) return null;

  return (
    <group position={scenePosition}>
      {/* Gun position marker */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>

      {/* Gun barrel indicator */}
      <mesh
        rotation={[0, ((position.firingArcMin + position.firingArcMax) / 2 * Math.PI) / 180, 0]}
        position={[0, 0.1, 0]}
      >
        <boxGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      {/* Firing arc on ground */}
      <Line
        points={arcPoints}
        color="#f59e0b"
        lineWidth={2}
        transparent
        opacity={0.6}
      />

      {/* Filled arc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry
          args={[
            0,
            position.maxRange * SCALE,
            32,
            1,
            (position.firingArcMin * Math.PI) / 180,
            ((position.firingArcMax - position.firingArcMin) * Math.PI) / 180,
          ]}
        />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Max ordinate trajectory arc */}
      <Line
        points={maxOrdinateArc}
        color="#f59e0b"
        lineWidth={1}
        dashed
        dashSize={0.2}
        dashScale={5}
        transparent
        opacity={0.4}
      />

      {/* Label */}
      {showLabel && (
        <Html position={[0, 0.5, 0]} center distanceFactor={20}>
          <div className="bg-background/90 border border-amber-500/50 px-2 py-1 rounded text-xs whitespace-nowrap">
            <div className="font-medium text-amber-500">{position.unit}</div>
            <div className="text-muted-foreground text-[10px]">
              {position.weaponSystem}
            </div>
            <div className="text-muted-foreground text-[10px]">
              Range: {(position.maxRange / 1000).toFixed(0)}km
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// NO-FLY ZONE MARKER
// ============================================================================

function NoFlyZoneMarker({
  zone,
  showLabel,
}: {
  zone: NoFlyZone;
  showLabel: boolean;
}) {
  // Convert NFZ coordinates to scene positions
  const zonePoints = useMemo(() => {
    return zone.coordinates.map((coord) => coordToScene(coord.lat, coord.lng, 0));
  }, [zone.coordinates]);

  // Create vertical walls
  const wallPoints = useMemo(() => {
    const walls: [number, number, number][][] = [];
    const minAlt = zone.altitudeMin * SCALE;
    const maxAlt = zone.altitudeMax * SCALE;

    for (let i = 0; i < zonePoints.length; i++) {
      const current = zonePoints[i];
      const next = zonePoints[(i + 1) % zonePoints.length];

      walls.push([
        [current[0], minAlt, current[2]],
        [current[0], maxAlt, current[2]],
        [next[0], maxAlt, next[2]],
        [next[0], minAlt, next[2]],
        [current[0], minAlt, current[2]],
      ]);
    }

    return walls;
  }, [zonePoints, zone.altitudeMin, zone.altitudeMax]);

  // Calculate center for label
  const center = useMemo(() => {
    const sum = zonePoints.reduce(
      (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
      [0, 0, 0]
    );
    return [
      sum[0] / zonePoints.length,
      (zone.altitudeMin + zone.altitudeMax) * SCALE * 0.5,
      sum[2] / zonePoints.length,
    ] as [number, number, number];
  }, [zonePoints, zone.altitudeMin, zone.altitudeMax]);

  if (!zone.active) return null;

  return (
    <group>
      {/* Ground outline */}
      <Line
        points={[...zonePoints, zonePoints[0]]}
        color="#ef4444"
        lineWidth={3}
      />

      {/* Top outline */}
      <Line
        points={[...zonePoints.map((p) => [p[0], zone.altitudeMax * SCALE, p[2]] as [number, number, number]), [zonePoints[0][0], zone.altitudeMax * SCALE, zonePoints[0][2]]]}
        color="#ef4444"
        lineWidth={2}
        dashed
        dashSize={0.2}
        dashScale={10}
      />

      {/* Vertical edges */}
      {zonePoints.map((point, i) => (
        <Line
          key={i}
          points={[
            [point[0], zone.altitudeMin * SCALE, point[2]],
            [point[0], zone.altitudeMax * SCALE, point[2]],
          ]}
          color="#ef4444"
          lineWidth={1}
          dashed
          dashSize={0.1}
          dashScale={20}
        />
      ))}

      {/* Semi-transparent fill */}
      {zonePoints.length >= 3 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <shapeGeometry
            args={[
              new THREE.Shape(
                zonePoints.map((p) => new THREE.Vector2(p[0], -p[2]))
              ),
            ]}
          />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Label */}
      {showLabel && (
        <Html position={center} center distanceFactor={20}>
          <div className="bg-background/90 border border-red-500/50 px-2 py-1 rounded text-xs whitespace-nowrap">
            <div className="font-medium text-red-500">NFZ: {zone.name}</div>
            <div className="text-muted-foreground text-[10px]">
              {zone.altitudeMin}m - {zone.altitudeMax}m
            </div>
            <div className="text-red-400 text-[10px]">{zone.reason}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ArtilleryOverlay({
  positions,
  noFlyZones,
  showNFZs = true,
  showLabels = true,
}: ArtilleryOverlayProps) {
  return (
    <group>
      {/* Artillery positions */}
      {positions.map((position) => (
        <ArtilleryPositionMarker
          key={position.id}
          position={position}
          showLabel={showLabels}
        />
      ))}

      {/* No-fly zones */}
      {showNFZs &&
        noFlyZones.map((zone) => (
          <NoFlyZoneMarker key={zone.id} zone={zone} showLabel={showLabels} />
        ))}
    </group>
  );
}

export default ArtilleryOverlay;
