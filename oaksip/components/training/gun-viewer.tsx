"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { GunModel } from "./gun-model";
import { TrainingEnvironment } from "./environment";
import { TrajectoryVisualization } from "./trajectory-visualization";
import { CrewPositionOverlay } from "./crew-position-overlay";
import { TargetRange } from "./target-range";
import { AimingOverlay, SimpleCrosshair } from "./aiming-overlay";
import { ScoreDisplay } from "./scoring-panel";
import { ArtilleryCrew } from "./soldier-model";
import { useTrainingStore, cameraPresetPositions } from "@/lib/training-store";
import { getGunSystemById } from "@/lib/gun-systems";

// Camera controller for presets with smooth animation
function CameraController() {
  const { camera } = useThree();
  const { cameraPreset, selectedGunSystem } = useTrainingStore();
  const controlsRef = useRef<{ target: THREE.Vector3; update: () => void } | null>(null);
  const targetPosition = useRef(new THREE.Vector3(4, 3, 4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.3, 0));
  const isAnimating = useRef(false);

  // Check if current weapon is a small arm
  const gunSystem = getGunSystemById(selectedGunSystem);
  const isSmallArm = gunSystem?.category === "assault-rifle" ||
                     gunSystem?.category === "pistol" ||
                     gunSystem?.category === "machine-gun";

  // Trigger animation only when preset or weapon changes
  useEffect(() => {
    if (isSmallArm) {
      // Shooting range view: behind gun, looking at targets
      targetPosition.current.set(0, 2, -3);  // Behind and above gun
      targetLookAt.current.set(0, 1, 5);     // Looking at target area
    } else {
      // Artillery - use preset positions for overview
      const preset = cameraPresetPositions[cameraPreset];
      targetPosition.current.set(...preset.position);
      targetLookAt.current.set(...preset.target);
    }
    isAnimating.current = true;
  }, [cameraPreset, isSmallArm, selectedGunSystem]);

  // Smooth camera animation - only when transitioning
  useFrame(() => {
    if (!isAnimating.current) return;

    const positionDistance = camera.position.distanceTo(targetPosition.current);

    if (positionDistance > 0.05) {
      camera.position.lerp(targetPosition.current, 0.08);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.08);
        controlsRef.current.update();
      }
    } else {
      // Stop animating once we're close enough
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as React.Ref<never>}
      enablePan={!isSmallArm}
      enableZoom={true}
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.05}
      minDistance={isSmallArm ? 2 : 2}
      maxDistance={isSmallArm ? 10 : 15}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      target={isSmallArm ? [0, 1, 5] : [0, 0.3, 0]}
    />
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4a5243" wireframe />
    </mesh>
  );
}

interface GunViewerProps {
  className?: string;
}

export function GunViewer({ className }: GunViewerProps) {
  const { aimingMode } = useTrainingStore();

  return (
    <div className={`relative w-full h-full min-h-[400px] bg-background rounded-lg overflow-hidden ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
        <CameraController />

        {/* Dynamic Environment - Terrain, Weather, Lighting */}
        <TrainingEnvironment />

        {/* Gun Model */}
        <Suspense fallback={<LoadingFallback />}>
          <GunModel />
        </Suspense>

        {/* Artillery Crew - Only for towed artillery */}
        <ArtilleryCrew />

        {/* Crew Position Overlay - SOW Section 8.4 */}
        <CrewPositionOverlay />

        {/* Target Range - Layer 2 Marksmanship Training */}
        <TargetRange />

        {/* Trajectory Visualization - SOW Section 8.4 */}
        <TrajectoryVisualization />
      </Canvas>

      {/* Aiming Overlay - Layer 2 Marksmanship Training */}
      {aimingMode ? <AimingOverlay /> : <SimpleCrosshair />}

      {/* Score Display - Layer 2 Marksmanship Training */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <ScoreDisplay />
      </div>
    </div>
  );
}
