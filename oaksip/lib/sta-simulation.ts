// STA (Surveillance & Target Acquisition) Simulation
// SOW Section 8.4: ISR Integration with UAV, radar, and sensor feeds

export type SensorType = "uav" | "radar" | "forward_observer" | "acoustic" | "thermal";
export type TargetType = "armor" | "infantry" | "artillery" | "vehicle" | "structure" | "unknown";
export type TargetPriority = "high" | "medium" | "low";
export type TargetStatus = "detected" | "tracking" | "engaged" | "destroyed" | "lost";

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number; // meters
  gridReference?: string; // Military grid reference
}

export interface Target {
  id: string;
  type: TargetType;
  priority: TargetPriority;
  status: TargetStatus;
  position: Coordinates;
  velocity?: { x: number; y: number; z: number }; // m/s
  heading?: number; // degrees
  detectedBy: SensorType[];
  firstDetected: number;
  lastUpdated: number;
  confidence: number; // 0-100
  signature?: {
    thermal?: number;
    radar?: number;
    acoustic?: number;
  };
  estimatedStrength?: string; // e.g., "platoon", "company"
  notes?: string;
}

export interface UAVFeed {
  id: string;
  name: string;
  type: "reconnaissance" | "surveillance" | "armed";
  status: "active" | "loitering" | "returning" | "offline";
  position: Coordinates;
  altitude: number;
  speed: number; // km/h
  heading: number;
  battery: number; // percentage
  fuelTime: number; // minutes remaining
  cameraMode: "wide" | "zoom" | "thermal" | "night";
  detectedTargets: string[]; // target IDs
  sensorRange: number; // km
  videoFeed?: string; // mock video feed URL
}

export interface RadarStation {
  id: string;
  name: string;
  type: "ground_surveillance" | "counter_battery" | "air_defense";
  status: "active" | "standby" | "maintenance";
  position: Coordinates;
  range: number; // km
  bearing: { min: number; max: number }; // sector coverage
  detectedTargets: string[];
  lastSweep: number;
  sweepInterval: number; // seconds
}

export interface ForwardObserver {
  id: string;
  callsign: string;
  position: Coordinates;
  status: "active" | "moving" | "compromised" | "offline";
  assignedSector: { bearing: number; width: number };
  detectedTargets: string[];
  lastReport: number;
  equipmentStatus: {
    radio: "operational" | "degraded" | "failed";
    laser: "operational" | "degraded" | "failed";
    optics: "operational" | "degraded" | "failed";
  };
}

export interface STANetwork {
  id: string;
  name: string;
  uavs: UAVFeed[];
  radars: RadarStation[];
  forwardObservers: ForwardObserver[];
  targets: Target[];
  gridZone: string;
  lastUpdate: number;
}

// Mock STA Network Data
export const mockSTANetwork: STANetwork = {
  id: "sta-net-001",
  name: "Sector Alpha STA Network",
  gridZone: "43Q",
  lastUpdate: Date.now(),
  uavs: [
    {
      id: "uav-001",
      name: "Eagle Eye 1",
      type: "reconnaissance",
      status: "active",
      position: { latitude: 19.9456, longitude: 73.8234, altitude: 3500 },
      altitude: 3500,
      speed: 120,
      heading: 45,
      battery: 78,
      fuelTime: 180,
      cameraMode: "wide",
      detectedTargets: ["tgt-001", "tgt-003"],
      sensorRange: 15,
    },
    {
      id: "uav-002",
      name: "Shadow 2",
      type: "surveillance",
      status: "loitering",
      position: { latitude: 19.9234, longitude: 73.8567, altitude: 2800 },
      altitude: 2800,
      speed: 80,
      heading: 180,
      battery: 45,
      fuelTime: 90,
      cameraMode: "thermal",
      detectedTargets: ["tgt-002"],
      sensorRange: 12,
    },
    {
      id: "uav-003",
      name: "Hawk 1",
      type: "armed",
      status: "active",
      position: { latitude: 19.9678, longitude: 73.8012, altitude: 4000 },
      altitude: 4000,
      speed: 150,
      heading: 270,
      battery: 62,
      fuelTime: 120,
      cameraMode: "zoom",
      detectedTargets: ["tgt-004"],
      sensorRange: 20,
    },
  ],
  radars: [
    {
      id: "radar-001",
      name: "Ground Surveillance Radar 1",
      type: "ground_surveillance",
      status: "active",
      position: { latitude: 19.9123, longitude: 73.8345 },
      range: 30,
      bearing: { min: 0, max: 180 },
      detectedTargets: ["tgt-001", "tgt-002", "tgt-005"],
      lastSweep: Date.now() - 5000,
      sweepInterval: 10,
    },
    {
      id: "radar-002",
      name: "Counter Battery Radar",
      type: "counter_battery",
      status: "active",
      position: { latitude: 19.9456, longitude: 73.8123 },
      range: 40,
      bearing: { min: 270, max: 90 },
      detectedTargets: ["tgt-006"],
      lastSweep: Date.now() - 3000,
      sweepInterval: 5,
    },
  ],
  forwardObservers: [
    {
      id: "fo-001",
      callsign: "Alpha 1-1",
      position: { latitude: 19.9345, longitude: 73.8456 },
      status: "active",
      assignedSector: { bearing: 45, width: 30 },
      detectedTargets: ["tgt-001", "tgt-003"],
      lastReport: Date.now() - 60000,
      equipmentStatus: { radio: "operational", laser: "operational", optics: "operational" },
    },
    {
      id: "fo-002",
      callsign: "Bravo 2-1",
      position: { latitude: 19.9567, longitude: 73.8234 },
      status: "active",
      assignedSector: { bearing: 90, width: 45 },
      detectedTargets: ["tgt-002"],
      lastReport: Date.now() - 120000,
      equipmentStatus: { radio: "operational", laser: "degraded", optics: "operational" },
    },
    {
      id: "fo-003",
      callsign: "Charlie 3-1",
      position: { latitude: 19.9234, longitude: 73.8678 },
      status: "moving",
      assignedSector: { bearing: 135, width: 30 },
      detectedTargets: [],
      lastReport: Date.now() - 300000,
      equipmentStatus: { radio: "operational", laser: "operational", optics: "operational" },
    },
  ],
  targets: [
    {
      id: "tgt-001",
      type: "armor",
      priority: "high",
      status: "tracking",
      position: { latitude: 19.9567, longitude: 73.8901, gridReference: "43Q 5678 9012" },
      velocity: { x: 5, y: 3, z: 0 },
      heading: 225,
      detectedBy: ["uav", "radar", "forward_observer"],
      firstDetected: Date.now() - 600000,
      lastUpdated: Date.now() - 30000,
      confidence: 95,
      signature: { thermal: 85, radar: 90 },
      estimatedStrength: "platoon (3-4 tanks)",
      notes: "Moving towards defensive position",
    },
    {
      id: "tgt-002",
      type: "artillery",
      priority: "high",
      status: "detected",
      position: { latitude: 19.9234, longitude: 73.9123, gridReference: "43Q 5234 9123" },
      detectedBy: ["radar", "forward_observer"],
      firstDetected: Date.now() - 300000,
      lastUpdated: Date.now() - 60000,
      confidence: 82,
      signature: { radar: 75, acoustic: 60 },
      estimatedStrength: "battery (4-6 guns)",
      notes: "Stationary, possible firing position",
    },
    {
      id: "tgt-003",
      type: "vehicle",
      priority: "medium",
      status: "tracking",
      position: { latitude: 19.9456, longitude: 73.8789, gridReference: "43Q 5456 8789" },
      velocity: { x: 8, y: -2, z: 0 },
      heading: 315,
      detectedBy: ["uav", "forward_observer"],
      firstDetected: Date.now() - 450000,
      lastUpdated: Date.now() - 15000,
      confidence: 88,
      signature: { thermal: 65 },
      estimatedStrength: "convoy (5-8 vehicles)",
      notes: "Supply convoy, moving north",
    },
    {
      id: "tgt-004",
      type: "infantry",
      priority: "medium",
      status: "detected",
      position: { latitude: 19.9678, longitude: 73.8567, gridReference: "43Q 5678 8567" },
      detectedBy: ["uav"],
      firstDetected: Date.now() - 180000,
      lastUpdated: Date.now() - 90000,
      confidence: 72,
      signature: { thermal: 45 },
      estimatedStrength: "company (80-120 personnel)",
      notes: "Dismounted, possible staging area",
    },
    {
      id: "tgt-005",
      type: "structure",
      priority: "low",
      status: "detected",
      position: { latitude: 19.9345, longitude: 73.9234, gridReference: "43Q 5345 9234" },
      detectedBy: ["radar"],
      firstDetected: Date.now() - 900000,
      lastUpdated: Date.now() - 300000,
      confidence: 65,
      signature: { radar: 55 },
      notes: "Building complex, possible command post",
    },
    {
      id: "tgt-006",
      type: "artillery",
      priority: "high",
      status: "engaged",
      position: { latitude: 19.9012, longitude: 73.9012, gridReference: "43Q 5012 9012" },
      detectedBy: ["radar"],
      firstDetected: Date.now() - 120000,
      lastUpdated: Date.now() - 10000,
      confidence: 91,
      signature: { radar: 88, acoustic: 75 },
      estimatedStrength: "single gun",
      notes: "Counter-battery target, fire mission in progress",
    },
  ],
};

// Utility functions
export function getTargetsByPriority(targets: Target[], priority: TargetPriority): Target[] {
  return targets.filter((t) => t.priority === priority);
}

export function getTargetsBySensor(targets: Target[], sensor: SensorType): Target[] {
  return targets.filter((t) => t.detectedBy.includes(sensor));
}

export function getTargetsByStatus(targets: Target[], status: TargetStatus): Target[] {
  return targets.filter((t) => t.status === status);
}

export function calculateDistance(pos1: Coordinates, pos2: Coordinates): number {
  // Haversine formula for distance in km
  const R = 6371;
  const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
  const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.latitude * Math.PI) / 180) *
      Math.cos((pos2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatGridReference(lat: number, lon: number): string {
  // Simplified grid reference format
  const northing = Math.floor((lat - 19) * 10000);
  const easting = Math.floor((lon - 73) * 10000);
  return `43Q ${easting.toString().padStart(4, "0")} ${northing.toString().padStart(4, "0")}`;
}

export function getTargetIcon(type: TargetType): string {
  const icons: Record<TargetType, string> = {
    armor: "🛡️",
    infantry: "👥",
    artillery: "🎯",
    vehicle: "🚛",
    structure: "🏢",
    unknown: "❓",
  };
  return icons[type];
}

export function getSensorStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-green-500",
    loitering: "text-blue-500",
    returning: "text-yellow-500",
    offline: "text-red-500",
    standby: "text-yellow-500",
    maintenance: "text-orange-500",
    moving: "text-blue-500",
    compromised: "text-red-500",
    operational: "text-green-500",
    degraded: "text-yellow-500",
    failed: "text-red-500",
  };
  return colors[status] || "text-gray-500";
}

// Fire mission request from STA data
export interface FireMissionRequest {
  id: string;
  targetId: string;
  requestedBy: string; // FO callsign or sensor ID
  priority: TargetPriority;
  targetPosition: Coordinates;
  targetDescription: string;
  requestTime: number;
  status: "pending" | "approved" | "firing" | "completed" | "cancelled";
  ammunitionType?: string;
  roundsRequested?: number;
  effectDesired?: "destruction" | "neutralization" | "suppression" | "illumination";
}

export function createFireMissionRequest(
  target: Target,
  requestedBy: string,
  effectDesired: FireMissionRequest["effectDesired"] = "neutralization"
): FireMissionRequest {
  return {
    id: `fm-${Date.now()}`,
    targetId: target.id,
    requestedBy,
    priority: target.priority,
    targetPosition: target.position,
    targetDescription: `${target.type} - ${target.estimatedStrength || "unknown strength"}`,
    requestTime: Date.now(),
    status: "pending",
    effectDesired,
    roundsRequested: target.type === "armor" ? 6 : target.type === "artillery" ? 4 : 3,
  };
}
