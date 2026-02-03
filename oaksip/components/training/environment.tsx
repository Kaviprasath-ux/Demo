"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  useTrainingStore,
  terrainConfigs,
  weatherConfigs,
} from "@/lib/training-store";

// Ground plane with terrain texture
export function TerrainGround() {
  const { terrain } = useTrainingStore();
  const config = terrainConfigs[terrain];

  // Create procedural ground texture pattern
  const groundTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base color
    const baseColor = new THREE.Color(config.groundColor);
    ctx.fillStyle = `rgb(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255})`;
    ctx.fillRect(0, 0, 512, 512);

    // Add noise/variation based on terrain type
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    return texture;
  }, [config.groundColor]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        map={groundTexture}
        roughness={terrain === "desert" ? 0.9 : 0.8}
        metalness={0}
      />
    </mesh>
  );
}

// Sky environment based on terrain and weather
export function EnvironmentSky() {
  const { terrain, weather } = useTrainingStore();

  if (weather === "night") {
    return (
      <>
        <color attach="background" args={["#0a0a1a"]} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        <ambientLight intensity={0.1} color="#4466aa" />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={0.2}
          color="#aabbff"
        />
      </>
    );
  }

  // Determine sun position based on terrain
  const sunPosition: [number, number, number] =
    terrain === "desert"
      ? [100, 50, 20]
      : terrain === "high-altitude"
      ? [50, 80, 50]
      : [50, 30, 50];

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        inclination={terrain === "desert" ? 0.5 : 0.49}
        azimuth={0.25}
        mieCoefficient={weather === "fog" ? 0.1 : 0.005}
        mieDirectionalG={0.7}
        rayleigh={weather === "fog" ? 0.5 : terrain === "high-altitude" ? 0.5 : 1}
        turbidity={weather === "fog" ? 20 : terrain === "desert" ? 15 : 8}
      />
    </>
  );
}

// Fog effect
export function EnvironmentFog() {
  const { terrain, weather } = useTrainingStore();
  const terrainConfig = terrainConfigs[terrain];
  const weatherConfig = weatherConfigs[weather];

  const fogColor = new THREE.Color(terrainConfig.fogColor);
  const farDistance = 80 / weatherConfig.fogMultiplier;

  // Adjust fog for night
  if (weather === "night") {
    fogColor.setHex(0x0a0a1a);
  }

  return <fog attach="fog" args={[fogColor, 5, farDistance]} />;
}

// Rain particle system
export function RainEffect() {
  const { weather } = useTrainingStore();
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = weatherConfigs[weather].particleCount;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      velocities[i] = 0.3 + Math.random() * 0.2;
    }

    return { positions, velocities };
  }, [particleCount]);

  useFrame(() => {
    if (!particlesRef.current || weather !== "rain") return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= particles.velocities[i];

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 30;
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (weather !== "rain" || particleCount === 0) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#aaccff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Dynamic lighting based on weather
export function EnvironmentLighting() {
  const { terrain, weather } = useTrainingStore();
  const terrainConfig = terrainConfigs[terrain];
  const weatherConfig = weatherConfigs[weather];

  const intensity = terrainConfig.ambientIntensity * weatherConfig.lightIntensity;

  // Sun/moon position
  const lightPosition: [number, number, number] =
    weather === "night" ? [-5, 10, 5] : [5, 10, 5];

  const lightColor =
    weather === "night"
      ? "#4466aa"
      : terrain === "desert"
      ? "#fff5e6"
      : "#ffffff";

  return (
    <>
      <ambientLight intensity={intensity * 0.6} />
      <directionalLight
        position={lightPosition}
        intensity={weatherConfig.lightIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={intensity * 0.3}
        color={lightColor}
      />
      {/* Fill light */}
      <pointLight
        position={[0, 5, 0]}
        intensity={intensity * 0.5}
        color={lightColor}
      />
    </>
  );
}

// Combined environment component
export function TrainingEnvironment() {
  return (
    <>
      <EnvironmentSky />
      <EnvironmentFog />
      <EnvironmentLighting />
      <TerrainGround />
      <RainEffect />
    </>
  );
}
