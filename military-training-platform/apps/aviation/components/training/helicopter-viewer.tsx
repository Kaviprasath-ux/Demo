"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky, Grid, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTrainingStore } from "@/lib/stores/training-store";
import { HelicopterModel } from "./helicopter-model";
import { FlightEnvironment } from "./flight-environment";
import { FlightPathVisualization } from "./flight-path-visualization";
import { ArtilleryOverlay } from "./artillery-overlay";

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================

function CameraController() {
  const { camera } = useThree();
  const { cameraPosition, cameraTarget, viewMode } = useTrainingStore();

  useEffect(() => {
    if (viewMode === "cockpit") {
      camera.position.set(0, 2, 0.5);
      camera.lookAt(0, 2, 10);
    } else {
      camera.position.set(...cameraPosition);
      camera.lookAt(...cameraTarget);
    }
  }, [camera, cameraPosition, cameraTarget, viewMode]);

  return null;
}

// ============================================================================
// LOADING SPINNER
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading 3D Scene...</span>
      </div>
    </Html>
  );
}

// ============================================================================
// SCENE CONTENT
// ============================================================================

function SceneContent() {
  const {
    selectedHelicopter,
    viewMode,
    terrain,
    weather,
    dayNight,
    showArtilleryOverlay,
    showFlightPath,
    showNFZs,
    showLabels,
    getSelectedScenario,
  } = useTrainingStore();

  const scenario = getSelectedScenario();

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={50} />
      <CameraController />

      {/* Controls */}
      {viewMode !== "cockpit" && (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1}
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={dayNight === "night" ? 0.1 : 0.4} />
      <directionalLight
        position={dayNight === "night" ? [0, 10, 0] : [10, 20, 10]}
        intensity={dayNight === "night" ? 0.2 : 1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {dayNight !== "night" && (
        <hemisphereLight intensity={0.3} groundColor="#3d4f1f" />
      )}

      {/* Environment */}
      <FlightEnvironment terrain={terrain} weather={weather} dayNight={dayNight} />

      {/* Helicopter */}
      <HelicopterModel helicopterId={selectedHelicopter} viewMode={viewMode} />

      {/* Flight Path */}
      {showFlightPath && scenario && (
        <FlightPathVisualization waypoints={scenario.flightPath} showLabels={showLabels} />
      )}

      {/* Artillery Overlay */}
      {showArtilleryOverlay && scenario && (
        <ArtilleryOverlay
          positions={scenario.artilleryPositions}
          noFlyZones={scenario.noFlyZones}
          showNFZs={showNFZs}
          showLabels={showLabels}
        />
      )}

      {/* Ground Grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#4a5d23"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#6b7f3a"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
      />
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HelicopterViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-background rounded-lg overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="touch-none"
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HelicopterViewer;
