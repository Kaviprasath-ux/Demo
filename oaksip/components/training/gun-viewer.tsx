"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { GunModel } from "./gun-model";
import { useTrainingStore, cameraPresetPositions } from "@/lib/training-store";

// Camera controller for presets with smooth animation
function CameraController() {
  const { camera } = useThree();
  const { cameraPreset } = useTrainingStore();
  const controlsRef = useRef<{ target: THREE.Vector3 } | null>(null);
  const targetPosition = useRef(new THREE.Vector3(4, 3, 4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.3, 0));

  useEffect(() => {
    const preset = cameraPresetPositions[cameraPreset];
    targetPosition.current.set(...preset.position);
    targetLookAt.current.set(...preset.target);
  }, [cameraPreset]);

  // Smooth camera animation
  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as React.Ref<never>}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={15}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.1}
      target={[0, 0.3, 0]}
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
  return (
    <div className={`w-full h-full min-h-[400px] bg-background rounded-lg overflow-hidden ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
        <CameraController />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment preset="warehouse" />

        {/* Grid */}
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#3d4137"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#4a5243"
          fadeDistance={15}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Gun Model */}
        <Suspense fallback={<LoadingFallback />}>
          <GunModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
