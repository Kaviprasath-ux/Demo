"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sky } from "@react-three/drei";
import type { TerrainType, WeatherType, DayNight } from "@/lib/stores/training-store";

interface FlightEnvironmentProps {
  terrain: TerrainType;
  weather: WeatherType;
  dayNight: DayNight;
}

// ============================================================================
// TERRAIN GROUND
// ============================================================================

function TerrainGround({ terrain }: { terrain: TerrainType }) {
  const colors = useMemo(() => {
    switch (terrain) {
      case "desert":
        return { main: "#c4a574", secondary: "#a88b5a" };
      case "mountains":
        return { main: "#5a6b4a", secondary: "#4a5b3a" };
      case "jungle":
        return { main: "#2d4a2d", secondary: "#1e3a1e" };
      case "urban":
        return { main: "#6a6a6a", secondary: "#5a5a5a" };
      case "maritime":
        return { main: "#2a4a6a", secondary: "#1a3a5a" };
      case "high_altitude":
        return { main: "#8a8a8a", secondary: "#7a7a7a" };
      default: // plains
        return { main: "#4a6a3a", secondary: "#3a5a2a" };
    }
  }, [terrain]);

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 32, 32]} />
        <meshStandardMaterial color={colors.main} roughness={0.9} />
      </mesh>

      {/* Terrain features based on type */}
      {terrain === "mountains" && <MountainFeatures />}
      {terrain === "urban" && <UrbanFeatures />}
      {terrain === "desert" && <DesertFeatures />}
      {terrain === "jungle" && <JungleFeatures />}
    </group>
  );
}

function MountainFeatures() {
  const mountains = useMemo(() => {
    const features = [];
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      const height = 5 + Math.random() * 15;
      const radius = 5 + Math.random() * 10;
      features.push({ x, z, height, radius });
    }
    return features;
  }, []);

  return (
    <group>
      {mountains.map((m, i) => (
        <mesh key={i} position={[m.x, m.height / 2 - 0.5, m.z]}>
          <coneGeometry args={[m.radius, m.height, 6]} />
          <meshStandardMaterial color="#5a6b5a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function UrbanFeatures() {
  const buildings = useMemo(() => {
    const features = [];
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      // Keep center area clear
      if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
      const height = 1 + Math.random() * 8;
      const width = 1 + Math.random() * 3;
      const depth = 1 + Math.random() * 3;
      features.push({ x, z, height, width, depth });
    }
    return features;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]} castShadow>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DesertFeatures() {
  const dunes = useMemo(() => {
    const features = [];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      const height = 1 + Math.random() * 3;
      const radius = 3 + Math.random() * 8;
      features.push({ x, z, height, radius });
    }
    return features;
  }, []);

  return (
    <group>
      {dunes.map((d, i) => (
        <mesh key={i} position={[d.x, d.height / 2 - 0.5, d.z]}>
          <sphereGeometry args={[d.radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d4b896" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function JungleFeatures() {
  const trees = useMemo(() => {
    const features = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      // Keep center area clear
      if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
      const height = 3 + Math.random() * 6;
      features.push({ x, z, height });
    }
    return features;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          {/* Trunk */}
          <mesh position={[0, t.height / 2, 0]}>
            <cylinderGeometry args={[0.2, 0.3, t.height, 8]} />
            <meshStandardMaterial color="#4a3a2a" roughness={0.9} />
          </mesh>
          {/* Canopy */}
          <mesh position={[0, t.height, 0]}>
            <sphereGeometry args={[1.5 + Math.random(), 8, 8]} />
            <meshStandardMaterial color="#1a4a1a" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// WEATHER EFFECTS
// ============================================================================

function RainEffect() {
  const rainRef = useRef<THREE.Points>(null);
  const count = 5000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= delta * 30;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 50;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#8899aa" size={0.1} transparent opacity={0.6} />
    </points>
  );
}

function FogEffect({ density }: { density: number }) {
  return <fog attach="fog" args={["#aabbcc", 10, 100 / density]} />;
}

function DustEffect() {
  const dustRef = useRef<THREE.Points>(null);
  const count = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#c4a574" size={0.2} transparent opacity={0.4} />
    </points>
  );
}

// ============================================================================
// SKY COMPONENT
// ============================================================================

function EnvironmentSky({ dayNight }: { dayNight: DayNight }) {
  const sunPosition = useMemo(() => {
    switch (dayNight) {
      case "night":
        return [0, -1, 0] as [number, number, number];
      case "dusk":
        return [100, 5, 0] as [number, number, number];
      default:
        return [100, 50, 100] as [number, number, number];
    }
  }, [dayNight]);

  if (dayNight === "night") {
    return (
      <>
        <color attach="background" args={["#0a0a15"]} />
        {/* Stars */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={500}
              array={useMemo(() => {
                const pos = new Float32Array(500 * 3);
                for (let i = 0; i < 500; i++) {
                  const theta = Math.random() * Math.PI * 2;
                  const phi = Math.acos(Math.random() * 2 - 1);
                  const r = 200;
                  pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                  pos[i * 3 + 1] = Math.abs(r * Math.cos(phi));
                  pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
                }
                return pos;
              }, [])}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#ffffff" size={0.5} />
        </points>
      </>
    );
  }

  return <Sky sunPosition={sunPosition} />;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FlightEnvironment({ terrain, weather, dayNight }: FlightEnvironmentProps) {
  return (
    <group>
      {/* Sky */}
      <EnvironmentSky dayNight={dayNight} />

      {/* Terrain */}
      <TerrainGround terrain={terrain} />

      {/* Weather effects */}
      {weather === "rain" && <RainEffect />}
      {weather === "fog" && <FogEffect density={1.5} />}
      {weather === "dust" && <DustEffect />}
      {weather === "snow" && <RainEffect />} {/* Reuse rain with different speed */}
    </group>
  );
}

export default FlightEnvironment;
