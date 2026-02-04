"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import type { FlightWaypoint } from "@/lib/stores/training-store";

interface FlightPathVisualizationProps {
  waypoints: FlightWaypoint[];
  showLabels?: boolean;
  animated?: boolean;
}

// Scale factor to convert coordinates to scene units
const SCALE = 0.001;
const BASE_LAT = 34.0;
const BASE_LNG = 74.7;

function coordToScene(lat: number, lng: number, altitude: number): [number, number, number] {
  const x = (lng - BASE_LNG) * 10000 * SCALE;
  const z = -(lat - BASE_LAT) * 10000 * SCALE;
  const y = altitude * SCALE;
  return [x, y, z];
}

// ============================================================================
// WAYPOINT MARKER
// ============================================================================

function WaypointMarker({
  waypoint,
  showLabel,
  index,
}: {
  waypoint: FlightWaypoint;
  showLabel: boolean;
  index: number;
}) {
  const position = coordToScene(
    waypoint.coordinates.lat,
    waypoint.coordinates.lng,
    waypoint.altitude
  );

  const color = useMemo(() => {
    switch (waypoint.type) {
      case "ingress":
        return "#22c55e"; // green
      case "egress":
        return "#10b981"; // emerald
      case "holding":
        return "#f59e0b"; // amber
      case "target":
        return "#ef4444"; // red
      case "ip":
        return "#10b981"; // emerald (IP)
      default:
        return "#6b7280"; // gray
    }
  }, [waypoint.type]);

  return (
    <group position={position}>
      {/* Waypoint sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Vertical line to ground */}
      <Line
        points={[
          [0, 0, 0],
          [0, -position[1], 0],
        ]}
        color={color}
        lineWidth={1}
        dashed
        dashSize={0.1}
        dashScale={10}
      />

      {/* Ground marker */}
      <mesh position={[0, -position[1], 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.2, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html position={[0.3, 0.3, 0]} center distanceFactor={20}>
          <div className="bg-background/90 border border-border px-2 py-1 rounded text-xs whitespace-nowrap">
            <div className="font-medium" style={{ color }}>
              {index + 1}. {waypoint.name}
            </div>
            <div className="text-muted-foreground text-[10px]">
              ALT: {waypoint.altitude}m | {waypoint.type.toUpperCase()}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// ANIMATED AIRCRAFT MARKER
// ============================================================================

function AnimatedAircraft({
  waypoints,
  speed = 0.5,
}: {
  waypoints: FlightWaypoint[];
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const segmentRef = useRef(0);

  const pathPoints = useMemo(() => {
    return waypoints.map((wp) =>
      new THREE.Vector3(...coordToScene(wp.coordinates.lat, wp.coordinates.lng, wp.altitude))
    );
  }, [waypoints]);

  useFrame((_, delta) => {
    if (!meshRef.current || pathPoints.length < 2) return;

    progressRef.current += delta * speed * 0.1;

    if (progressRef.current >= 1) {
      progressRef.current = 0;
      segmentRef.current = (segmentRef.current + 1) % (pathPoints.length - 1);
    }

    const start = pathPoints[segmentRef.current];
    const end = pathPoints[segmentRef.current + 1];

    if (start && end) {
      meshRef.current.position.lerpVectors(start, end, progressRef.current);

      // Point towards next waypoint
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = angle;
    }
  });

  if (pathPoints.length < 2) return null;

  return (
    <mesh ref={meshRef} position={pathPoints[0]}>
      {/* Simple aircraft shape */}
      <group rotation={[0, 0, 0]}>
        {/* Body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
        {/* Wings */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.02, 0.1]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>
    </mesh>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FlightPathVisualization({
  waypoints,
  showLabels = true,
  animated = true,
}: FlightPathVisualizationProps) {
  // Create path points for the line
  const pathPoints = useMemo(() => {
    return waypoints.map((wp) =>
      coordToScene(wp.coordinates.lat, wp.coordinates.lng, wp.altitude)
    );
  }, [waypoints]);

  if (waypoints.length === 0) return null;

  return (
    <group>
      {/* Flight path line */}
      {pathPoints.length >= 2 && (
        <Line
          points={pathPoints}
          color="#22c55e"
          lineWidth={2}
          dashed
          dashSize={0.2}
          dashScale={5}
        />
      )}

      {/* Waypoint markers */}
      {waypoints.map((waypoint, index) => (
        <WaypointMarker
          key={waypoint.id}
          waypoint={waypoint}
          showLabel={showLabels}
          index={index}
        />
      ))}

      {/* Animated aircraft */}
      {animated && waypoints.length >= 2 && (
        <AnimatedAircraft waypoints={waypoints} />
      )}
    </group>
  );
}

export default FlightPathVisualization;
