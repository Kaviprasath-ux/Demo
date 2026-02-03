"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/training-store";
import { getGunSystemById } from "@/lib/gun-systems";

// Ballistic trajectory calculation - SOW Section 8.4
interface TrajectoryParams {
  muzzleVelocity: number; // m/s
  elevation: number; // degrees
  gravity: number; // m/s^2
  airResistance: number; // coefficient
  isSmallArm: boolean; // different physics for small arms
  startPosition: [number, number, number]; // muzzle position
}

// Calculate ballistic trajectory points
function calculateTrajectory(params: TrajectoryParams, numPoints: number = 100): THREE.Vector3[] {
  const { muzzleVelocity, elevation, gravity, airResistance, isSmallArm, startPosition } = params;

  const elevationRad = (elevation * Math.PI) / 180;

  // Horizontal velocity component
  const horizontalVelocity = muzzleVelocity * Math.cos(elevationRad);
  // Vertical velocity component
  const vy0 = muzzleVelocity * Math.sin(elevationRad);

  // Time of flight (time until projectile returns to ground level)
  const timeOfFlight = (2 * vy0) / gravity;
  const dt = timeOfFlight / numPoints;

  const points: THREE.Vector3[] = [];

  // Scale factor for visualization (convert real-world to scene units)
  const scale = isSmallArm ? 0.005 : 0.0003;

  for (let i = 0; i <= numPoints; i++) {
    const t = i * dt;

    // Parabolic motion equations
    // X: stays constant (no sideways drift)
    const x = startPosition[0];
    // Y: vertical (up)
    const y = startPosition[1] + (vy0 * t - 0.5 * gravity * t * t) * scale;
    // Z: forward direction (where barrel points) - positive Z is forward
    // Apply simple air resistance effect (reduces range slightly)
    const dragEffect = Math.pow(1 - airResistance, i);
    const z = startPosition[2] + horizontalVelocity * t * scale * dragEffect;

    points.push(new THREE.Vector3(x, Math.max(0, y), z));

    // Stop if below starting height after apex
    if (y < 0 && i > numPoints / 2) break;
  }

  return points;
}

// Projectile moving along trajectory
function Projectile({
  trajectoryPoints,
  isActive,
  onComplete
}: {
  trajectoryPoints: THREE.Vector3[];
  isActive: boolean;
  onComplete: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  const trailRef = useRef<THREE.Vector3[]>([]);

  useFrame((state, delta) => {
    if (!isActive || !meshRef.current || trajectoryPoints.length < 2) return;

    const newProgress = progress + delta * 0.5; // Speed of animation
    setProgress(newProgress);

    if (newProgress >= 1) {
      onComplete();
      return;
    }

    // Find current position along trajectory
    const index = Math.min(
      Math.floor(newProgress * (trajectoryPoints.length - 1)),
      trajectoryPoints.length - 2
    );
    const t = (newProgress * (trajectoryPoints.length - 1)) - index;

    const currentPos = new THREE.Vector3().lerpVectors(
      trajectoryPoints[index],
      trajectoryPoints[index + 1],
      t
    );

    meshRef.current.position.copy(currentPos);

    // Add to trail
    trailRef.current.push(currentPos.clone());
    if (trailRef.current.length > 50) {
      trailRef.current.shift();
    }
  });

  // Reset on new trajectory
  useEffect(() => {
    if (isActive) {
      setProgress(0);
      trailRef.current = [];
    }
  }, [isActive, trajectoryPoints]);

  if (!isActive || trajectoryPoints.length < 2) return null;

  return (
    <>
      {/* Projectile */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff3300"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Trail glow */}
      {trailRef.current.length > 2 && (
        <Line
          points={trailRef.current}
          color="#ff6600"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      )}
    </>
  );
}

// Impact marker
function ImpactMarker({ position, visible }: { position: THREE.Vector3; visible: boolean }) {
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);

  useFrame((state, delta) => {
    if (!visible) return;

    // Expanding ring animation
    setScale((s) => Math.min(s + delta * 2, 2));
    setOpacity((o) => Math.max(o - delta * 0.5, 0));
  });

  useEffect(() => {
    if (visible) {
      setScale(0.1);
      setOpacity(1);
    }
  }, [visible, position]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Impact ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Impact point */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.5, 0]} center>
        <div className="px-2 py-1 bg-red-500/80 rounded text-white text-xs whitespace-nowrap">
          Impact Point
        </div>
      </Html>
    </group>
  );
}

// Distance marker along trajectory
function DistanceMarkers({ trajectoryPoints, startPosition }: { trajectoryPoints: THREE.Vector3[], startPosition: THREE.Vector3 }) {
  const markers = useMemo(() => {
    if (trajectoryPoints.length < 10) return [];

    const result = [];
    const step = Math.floor(trajectoryPoints.length / 4);

    for (let i = step; i < trajectoryPoints.length; i += step) {
      const point = trajectoryPoints[i];
      // Calculate distance from start position
      const dx = point.x - startPosition.x;
      const dy = point.y - startPosition.y;
      const dz = point.z - startPosition.z;
      // Scale back to real-world distance (rough approximation)
      const distance = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz) * 3000);
      result.push({ point, distance });
    }

    return result;
  }, [trajectoryPoints, startPosition]);

  return (
    <>
      {markers.map((marker, idx) => (
        <Html key={idx} position={marker.point} center>
          <div className="px-1 py-0.5 bg-blue-500/70 rounded text-white text-[10px]">
            {marker.distance}m
          </div>
        </Html>
      ))}
    </>
  );
}

// Main trajectory visualization component
export function TrajectoryVisualization() {
  const { currentAnimation, selectedGunSystem } = useTrainingStore();
  const [trajectoryPoints, setTrajectoryPoints] = useState<THREE.Vector3[]>([]);
  const [showProjectile, setShowProjectile] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [startPos, setStartPos] = useState<THREE.Vector3>(new THREE.Vector3());

  // Get gun system info
  const gunSystem = getGunSystemById(selectedGunSystem);
  const isSmallArm = gunSystem?.category === "assault-rifle" ||
                     gunSystem?.category === "pistol" ||
                     gunSystem?.category === "machine-gun";

  // Generate trajectory when firing
  useEffect(() => {
    if (currentAnimation === "firing") {
      // Different parameters based on weapon type
      let muzzleVelocity: number;
      let elevation: number;
      let startPosition: [number, number, number];

      if (isSmallArm) {
        // Small arms: flatter trajectory, starts from muzzle
        muzzleVelocity = 900; // ~900 m/s for rifles
        elevation = 1 + Math.random() * 2; // Very flat, 1-3 degrees
        startPosition = [0, 0.8, 0]; // Near muzzle
      } else {
        // Artillery: high arc trajectory
        muzzleVelocity = 827; // Standard 155mm muzzle velocity
        elevation = 30 + Math.random() * 15; // 30-45 degrees for howitzers
        startPosition = [0, 0.6, 3.6]; // At muzzle brake of howitzer
      }

      setStartPos(new THREE.Vector3(...startPosition));

      const points = calculateTrajectory({
        muzzleVelocity,
        elevation,
        gravity: 9.81,
        airResistance: isSmallArm ? 0.001 : 0.002,
        isSmallArm,
        startPosition,
      });

      setTrajectoryPoints(points);
      setShowProjectile(true);
      setShowTrajectory(true);
      setShowImpact(false);
    }
  }, [currentAnimation, isSmallArm]);

  const handleProjectileComplete = () => {
    setShowProjectile(false);
    setShowImpact(true);

    // Hide trajectory after a delay
    setTimeout(() => {
      setShowTrajectory(false);
      setShowImpact(false);
    }, 5000);
  };

  const impactPoint = trajectoryPoints.length > 0
    ? trajectoryPoints[trajectoryPoints.length - 1]
    : new THREE.Vector3();

  return (
    <>
      {/* Trajectory arc */}
      {showTrajectory && trajectoryPoints.length > 2 && (
        <>
          {/* Main trajectory line */}
          <Line
            points={trajectoryPoints}
            color="#4488ff"
            lineWidth={2}
            dashed
            dashScale={5}
            dashSize={0.1}
            gapSize={0.05}
          />

          {/* Trajectory glow */}
          <Line
            points={trajectoryPoints}
            color="#4488ff"
            lineWidth={4}
            transparent
            opacity={0.2}
          />

          {/* Apex marker */}
          {trajectoryPoints.length > 10 && (
            <Html
              position={trajectoryPoints[Math.floor(trajectoryPoints.length / 2)]}
              center
            >
              <div className="px-1 py-0.5 bg-green-500/70 rounded text-white text-[10px]">
                Apex
              </div>
            </Html>
          )}

          {/* Distance markers */}
          <DistanceMarkers trajectoryPoints={trajectoryPoints} startPosition={startPos} />
        </>
      )}

      {/* Animated projectile */}
      <Projectile
        trajectoryPoints={trajectoryPoints}
        isActive={showProjectile}
        onComplete={handleProjectileComplete}
      />

      {/* Impact marker */}
      <ImpactMarker position={impactPoint} visible={showImpact} />
    </>
  );
}
