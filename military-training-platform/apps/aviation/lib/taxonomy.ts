// Content Taxonomy System for Aviation
// Comprehensive classification system for aviation training content

// =============================================================================
// COURSE STRUCTURES - Per Army Aviation Training curriculum
// =============================================================================

export type CourseType =
  | "basic_flight" // Basic Flight Training
  | "advanced_flight" // Advanced Flight Training
  | "instrument_rating" // Instrument Rating Course
  | "alh_conversion" // ALH Dhruv Conversion
  | "attack_conversion" // Attack Helicopter Conversion (Rudra/LCH/Apache)
  | "cas_training" // Close Air Support Training
  | "joint_fire" // Joint Fire Support Course
  | "instructor_pilot" // Instructor Pilot Course
  | "refresher"; // Refresher courses

export interface Course {
  id: string;
  code: CourseType;
  name: string;
  fullName: string;
  duration: string;
  description: string;
  eligibility: string[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  name: string;
  weeks: number;
  topics: string[];
  assessmentType: "theory" | "practical" | "simulator" | "flight_check";
}

export const courses: Course[] = [
  {
    id: "course-basic",
    code: "basic_flight",
    name: "Basic Flight",
    fullName: "Basic Flight Training Course",
    duration: "24 weeks",
    description: "Foundation helicopter flying training for ab-initio pilots covering basic flight maneuvers and procedures",
    eligibility: ["Commissioned Officers", "Post-Flying Training Selection"],
    modules: [
      {
        id: "basic-ground",
        name: "Ground School",
        weeks: 4,
        topics: ["Aerodynamics", "Meteorology", "Navigation", "Air regulations"],
        assessmentType: "theory",
      },
      {
        id: "basic-hover",
        name: "Hovering & Basic Maneuvers",
        weeks: 6,
        topics: ["Hover", "Hover taxi", "Takeoff", "Landing", "Basic turns"],
        assessmentType: "flight_check",
      },
      {
        id: "basic-nav",
        name: "Navigation Flying",
        weeks: 8,
        topics: ["Cross-country", "Map reading", "Radio navigation", "Night flying basics"],
        assessmentType: "flight_check",
      },
      {
        id: "basic-emergency",
        name: "Emergency Procedures",
        weeks: 6,
        topics: ["Autorotation", "Engine failure", "System failures", "Forced landing"],
        assessmentType: "simulator",
      },
    ],
  },
  {
    id: "course-advanced",
    code: "advanced_flight",
    name: "Advanced Flight",
    fullName: "Advanced Flight Training Course",
    duration: "16 weeks",
    description: "Advanced tactical flying including formation, NOE, and operational procedures",
    eligibility: ["Basic Flight qualified", "300+ hours"],
    modules: [
      {
        id: "adv-tactical",
        name: "Tactical Flying",
        weeks: 6,
        topics: ["NOE flying", "Terrain masking", "Tactical approach", "Confined areas"],
        assessmentType: "flight_check",
      },
      {
        id: "adv-formation",
        name: "Formation Flying",
        weeks: 4,
        topics: ["Two-ship", "Four-ship", "Formation procedures", "Trail formations"],
        assessmentType: "flight_check",
      },
      {
        id: "adv-night",
        name: "Advanced Night Operations",
        weeks: 3,
        topics: ["NVG operations", "Night tactical", "Night formation"],
        assessmentType: "flight_check",
      },
      {
        id: "adv-mission",
        name: "Mission Planning",
        weeks: 3,
        topics: ["Operational planning", "Threat assessment", "Route planning"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-ir",
    code: "instrument_rating",
    name: "IR Course",
    fullName: "Instrument Rating Course",
    duration: "8 weeks",
    description: "Instrument flying qualification for all-weather operations",
    eligibility: ["Basic Flight qualified", "200+ hours"],
    modules: [
      {
        id: "ir-basic",
        name: "Basic Instruments",
        weeks: 3,
        topics: ["Attitude flying", "Partial panel", "Unusual attitudes"],
        assessmentType: "simulator",
      },
      {
        id: "ir-procedures",
        name: "Instrument Procedures",
        weeks: 3,
        topics: ["ILS", "VOR", "NDB", "GPS approaches"],
        assessmentType: "flight_check",
      },
      {
        id: "ir-check",
        name: "Rating Check",
        weeks: 2,
        topics: ["Full instrument profile", "Emergency procedures"],
        assessmentType: "flight_check",
      },
    ],
  },
  {
    id: "course-alh",
    code: "alh_conversion",
    name: "ALH Conversion",
    fullName: "ALH Dhruv Conversion Course",
    duration: "12 weeks",
    description: "Type conversion training for ALH Dhruv helicopter",
    eligibility: ["Basic Flight qualified", "500+ hours"],
    modules: [
      {
        id: "alh-systems",
        name: "Aircraft Systems",
        weeks: 3,
        topics: ["Powerplant", "Flight controls", "Avionics", "Hydraulics"],
        assessmentType: "theory",
      },
      {
        id: "alh-normal",
        name: "Normal Operations",
        weeks: 5,
        topics: ["Startup/shutdown", "Hover", "En-route", "Approaches"],
        assessmentType: "flight_check",
      },
      {
        id: "alh-emergency",
        name: "Emergency Procedures",
        weeks: 4,
        topics: ["Engine failure", "Hydraulic failure", "Electrical failure"],
        assessmentType: "simulator",
      },
    ],
  },
  {
    id: "course-attack",
    code: "attack_conversion",
    name: "Attack Heli Conversion",
    fullName: "Attack Helicopter Conversion Course",
    duration: "20 weeks",
    description: "Conversion training for attack helicopters (Rudra/LCH/Apache)",
    eligibility: ["Advanced Flight qualified", "800+ hours", "Combat fit"],
    modules: [
      {
        id: "attack-systems",
        name: "Weapons Systems",
        weeks: 4,
        topics: ["ATGM", "Rockets", "Gun systems", "Targeting"],
        assessmentType: "theory",
      },
      {
        id: "attack-tactics",
        name: "Attack Tactics",
        weeks: 6,
        topics: ["Target acquisition", "Attack profiles", "Weapons delivery"],
        assessmentType: "simulator",
      },
      {
        id: "attack-live",
        name: "Live Fire Training",
        weeks: 6,
        topics: ["Range procedures", "Live weapons", "Night attack"],
        assessmentType: "practical",
      },
      {
        id: "attack-mission",
        name: "Mission Employment",
        weeks: 4,
        topics: ["CAS missions", "Armed recce", "Escort duties"],
        assessmentType: "flight_check",
      },
    ],
  },
  {
    id: "course-cas",
    code: "cas_training",
    name: "CAS Training",
    fullName: "Close Air Support Training Course",
    duration: "6 weeks",
    description: "Specialized training for close air support missions",
    eligibility: ["Attack conversion qualified"],
    modules: [
      {
        id: "cas-doctrine",
        name: "CAS Doctrine",
        weeks: 1,
        topics: ["CAS fundamentals", "ROE", "Coordination procedures"],
        assessmentType: "theory",
      },
      {
        id: "cas-coordination",
        name: "Air-Ground Coordination",
        weeks: 2,
        topics: ["JTAC procedures", "9-line brief", "Talk-on"],
        assessmentType: "simulator",
      },
      {
        id: "cas-execution",
        name: "CAS Execution",
        weeks: 3,
        topics: ["Type 1/2/3 controls", "Attack profiles", "Abort criteria"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-joint",
    code: "joint_fire",
    name: "Joint Fire Support",
    fullName: "Joint Fire Support Course",
    duration: "4 weeks",
    description: "Integration with artillery and naval fire support",
    eligibility: ["CAS qualified or Artillery FOO"],
    modules: [
      {
        id: "joint-basics",
        name: "Joint Fire Basics",
        weeks: 1,
        topics: ["Fire support coordination", "FSCC", "Airspace deconfliction"],
        assessmentType: "theory",
      },
      {
        id: "joint-exercise",
        name: "Joint Exercises",
        weeks: 3,
        topics: ["Combined arms", "Artillery-aviation coordination", "SEAD"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-ip",
    code: "instructor_pilot",
    name: "IP Course",
    fullName: "Instructor Pilot Course",
    duration: "12 weeks",
    description: "Training for qualified flying instructors",
    eligibility: ["1500+ hours", "Advanced qualified", "Recommended by CO"],
    modules: [
      {
        id: "ip-methods",
        name: "Instructional Methods",
        weeks: 3,
        topics: ["Adult learning", "Demonstration", "Error correction"],
        assessmentType: "theory",
      },
      {
        id: "ip-practice",
        name: "Instructional Practice",
        weeks: 9,
        topics: ["Dual instruction", "Student assessment", "Standards"],
        assessmentType: "flight_check",
      },
    ],
  },
];

// =============================================================================
// SECURITY CLASSIFICATION
// =============================================================================

export type SecurityLevel =
  | "unclassified"
  | "restricted"
  | "confidential"
  | "secret"
  | "top-secret";

export interface SecurityClassification {
  level: SecurityLevel;
  label: string;
  color: string;
  description: string;
  accessRequirement: string;
}

export const securityLevels: Record<SecurityLevel, SecurityClassification> = {
  unclassified: {
    level: "unclassified",
    label: "Unclassified",
    color: "green",
    description: "Public domain training material",
    accessRequirement: "None",
  },
  restricted: {
    level: "restricted",
    label: "Restricted",
    color: "blue",
    description: "Internal use only, not for public distribution",
    accessRequirement: "Authenticated user",
  },
  confidential: {
    level: "confidential",
    label: "Confidential",
    color: "yellow",
    description: "Sensitive tactical and technical information",
    accessRequirement: "Need-to-know basis",
  },
  secret: {
    level: "secret",
    label: "Secret",
    color: "orange",
    description: "Classified operational information",
    accessRequirement: "Security clearance required",
  },
  "top-secret": {
    level: "top-secret",
    label: "Top Secret",
    color: "red",
    description: "Highest classification - critical national security",
    accessRequirement: "Special compartmented access",
  },
};

// =============================================================================
// HELICOPTER PLATFORM TAGS
// =============================================================================

export type HelicopterPlatformTag =
  | "alh-dhruv"
  | "hal-rudra"
  | "lch-prachand"
  | "apache-ah64e"
  | "chetak"
  | "cheetah"
  | "chinook"
  | "all-utility"
  | "all-attack"
  | "all-transport"
  | "general";

export interface HelicopterPlatformTaxonomy {
  tag: HelicopterPlatformTag;
  name: string;
  description: string;
  role: "utility" | "attack" | "transport" | "trainer" | "multi-role";
  relatedPlatforms: HelicopterPlatformTag[];
}

export const helicopterPlatformTags: Record<HelicopterPlatformTag, HelicopterPlatformTaxonomy> = {
  "alh-dhruv": {
    tag: "alh-dhruv",
    name: "ALH Dhruv",
    description: "Advanced Light Helicopter - multi-role utility",
    role: "multi-role",
    relatedPlatforms: ["hal-rudra", "all-utility"],
  },
  "hal-rudra": {
    tag: "hal-rudra",
    name: "HAL Rudra",
    description: "Weaponized ALH variant for attack missions",
    role: "attack",
    relatedPlatforms: ["alh-dhruv", "lch-prachand", "all-attack"],
  },
  "lch-prachand": {
    tag: "lch-prachand",
    name: "LCH Prachand",
    description: "Light Combat Helicopter for high-altitude operations",
    role: "attack",
    relatedPlatforms: ["hal-rudra", "apache-ah64e", "all-attack"],
  },
  "apache-ah64e": {
    tag: "apache-ah64e",
    name: "Apache AH-64E",
    description: "Heavy attack helicopter with advanced sensors",
    role: "attack",
    relatedPlatforms: ["hal-rudra", "lch-prachand", "all-attack"],
  },
  chetak: {
    tag: "chetak",
    name: "Chetak",
    description: "Light utility helicopter for training and liaison",
    role: "trainer",
    relatedPlatforms: ["cheetah", "all-utility"],
  },
  cheetah: {
    tag: "cheetah",
    name: "Cheetah",
    description: "High-altitude light helicopter",
    role: "utility",
    relatedPlatforms: ["chetak", "all-utility"],
  },
  chinook: {
    tag: "chinook",
    name: "Chinook CH-47F",
    description: "Heavy-lift transport helicopter",
    role: "transport",
    relatedPlatforms: ["all-transport"],
  },
  "all-utility": {
    tag: "all-utility",
    name: "All Utility Helicopters",
    description: "Applicable to all utility helicopter types",
    role: "utility",
    relatedPlatforms: ["alh-dhruv", "chetak", "cheetah"],
  },
  "all-attack": {
    tag: "all-attack",
    name: "All Attack Helicopters",
    description: "Applicable to all attack helicopter types",
    role: "attack",
    relatedPlatforms: ["hal-rudra", "lch-prachand", "apache-ah64e"],
  },
  "all-transport": {
    tag: "all-transport",
    name: "All Transport Helicopters",
    description: "Applicable to all transport helicopter types",
    role: "transport",
    relatedPlatforms: ["chinook"],
  },
  general: {
    tag: "general",
    name: "General Aviation",
    description: "Applicable to all helicopter types",
    role: "multi-role",
    relatedPlatforms: ["all-utility", "all-attack", "all-transport"],
  },
};

// =============================================================================
// MISSION TYPE TAGS
// =============================================================================

export type MissionTypeTag =
  | "cas" // Close Air Support
  | "armed-recce" // Armed Reconnaissance
  | "escort" // Armed Escort
  | "troop-transport" // Troop Transport
  | "medevac" // Medical Evacuation
  | "sar" // Search and Rescue
  | "vip-transport" // VIP Transport
  | "logistics" // Logistics Support
  | "training"; // Training Missions

export interface MissionTypeTaxonomy {
  tag: MissionTypeTag;
  name: string;
  description: string;
  applicablePlatforms: HelicopterPlatformTag[];
}

export const missionTypeTags: Record<MissionTypeTag, MissionTypeTaxonomy> = {
  cas: {
    tag: "cas",
    name: "Close Air Support",
    description: "Direct fire support for ground troops in contact",
    applicablePlatforms: ["hal-rudra", "lch-prachand", "apache-ah64e", "all-attack"],
  },
  "armed-recce": {
    tag: "armed-recce",
    name: "Armed Reconnaissance",
    description: "Reconnaissance with weapons capability",
    applicablePlatforms: ["hal-rudra", "lch-prachand", "apache-ah64e", "all-attack"],
  },
  escort: {
    tag: "escort",
    name: "Armed Escort",
    description: "Protection for transport/utility helicopters",
    applicablePlatforms: ["hal-rudra", "lch-prachand", "apache-ah64e", "all-attack"],
  },
  "troop-transport": {
    tag: "troop-transport",
    name: "Troop Transport",
    description: "Movement of personnel",
    applicablePlatforms: ["alh-dhruv", "chinook", "all-utility", "all-transport"],
  },
  medevac: {
    tag: "medevac",
    name: "Medical Evacuation",
    description: "Casualty evacuation missions",
    applicablePlatforms: ["alh-dhruv", "chetak", "all-utility"],
  },
  sar: {
    tag: "sar",
    name: "Search and Rescue",
    description: "Personnel recovery operations",
    applicablePlatforms: ["alh-dhruv", "chetak", "chinook", "all-utility"],
  },
  "vip-transport": {
    tag: "vip-transport",
    name: "VIP Transport",
    description: "High-value personnel movement",
    applicablePlatforms: ["alh-dhruv", "chetak", "all-utility"],
  },
  logistics: {
    tag: "logistics",
    name: "Logistics Support",
    description: "Cargo and supply transport",
    applicablePlatforms: ["chinook", "alh-dhruv", "all-transport", "all-utility"],
  },
  training: {
    tag: "training",
    name: "Training Missions",
    description: "All training and proficiency flights",
    applicablePlatforms: ["general"],
  },
};

// =============================================================================
// CONTENT TYPES
// =============================================================================

export type ContentCategory =
  | "flight_manual"
  | "sop"
  | "doctrine"
  | "technical"
  | "training"
  | "checklist"
  | "weapons"
  | "emergency"
  | "safety"
  | "maintenance";

export interface ContentCategoryInfo {
  id: ContentCategory;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  examples: string[];
}

export const contentCategories: Record<ContentCategory, ContentCategoryInfo> = {
  flight_manual: {
    id: "flight_manual",
    name: "Flight Manual",
    description: "Official aircraft flight manuals and supplements",
    icon: "BookOpen",
    examples: ["ALH Flight Manual", "Apache Operator's Manual", "Performance Data"],
  },
  sop: {
    id: "sop",
    name: "Standard Operating Procedures",
    description: "Unit and formation SOPs",
    icon: "FileText",
    examples: ["Squadron SOP", "Flight Operations SOP", "Mission Planning SOP"],
  },
  doctrine: {
    id: "doctrine",
    name: "Doctrine",
    description: "Tactical doctrine and employment principles",
    icon: "Scale",
    examples: ["Aviation Tactics", "CAS Doctrine", "Joint Operations Doctrine"],
  },
  technical: {
    id: "technical",
    name: "Technical Manuals",
    description: "Systems and equipment technical documentation",
    icon: "Wrench",
    examples: ["Avionics Manual", "Weapons Technical Manual", "Sensor Systems"],
  },
  training: {
    id: "training",
    name: "Training Material",
    description: "Instructional content for courses",
    icon: "GraduationCap",
    examples: ["Lesson Plans", "Training Aids", "Syllabus"],
  },
  checklist: {
    id: "checklist",
    name: "Checklists",
    description: "Flight and ground checklists",
    icon: "CheckSquare",
    examples: ["Normal Checklist", "Emergency Checklist", "Pre-flight Checklist"],
  },
  weapons: {
    id: "weapons",
    name: "Weapons Employment",
    description: "Weapons systems and delivery procedures",
    icon: "Target",
    examples: ["Helina Employment", "Rocket Delivery", "Gun Employment"],
  },
  emergency: {
    id: "emergency",
    name: "Emergency Procedures",
    description: "Emergency and abnormal procedures",
    icon: "AlertTriangle",
    examples: ["Engine Failure", "Fire Procedures", "Ditching"],
  },
  safety: {
    id: "safety",
    name: "Safety Publications",
    description: "Safety notices and bulletins",
    icon: "Shield",
    examples: ["Safety Bulletins", "Incident Reports", "Risk Management"],
  },
  maintenance: {
    id: "maintenance",
    name: "Maintenance Guides",
    description: "Aircraft care and maintenance",
    icon: "Settings",
    examples: ["Servicing Schedule", "Troubleshooting", "Component Life"],
  },
};

// =============================================================================
// TOPIC HIERARCHY - Aviation specific
// =============================================================================

export interface Topic {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  keywords: string[];
}

export const topicHierarchy: Topic[] = [
  // Level 1: Major Areas
  { id: "flight-ops", name: "Flight Operations", keywords: ["flying", "flight", "operations", "mission"] },
  { id: "tactics", name: "Tactics", keywords: ["tactical", "employment", "combat"] },
  { id: "aircraft-systems", name: "Aircraft Systems", keywords: ["systems", "avionics", "engine"] },
  { id: "weapons", name: "Weapons", keywords: ["weapons", "ordnance", "munitions"] },

  // Level 2: Flight Operations subtopics
  { id: "normal-ops", name: "Normal Operations", parentId: "flight-ops", keywords: ["normal", "procedures", "standard"] },
  { id: "emergency-ops", name: "Emergency Operations", parentId: "flight-ops", keywords: ["emergency", "abnormal", "failure"] },
  { id: "instrument-flying", name: "Instrument Flying", parentId: "flight-ops", keywords: ["ifr", "instrument", "approach"] },
  { id: "night-ops", name: "Night Operations", parentId: "flight-ops", keywords: ["night", "nvg", "dark"] },

  // Level 2: Tactics subtopics
  { id: "cas-tactics", name: "CAS Tactics", parentId: "tactics", keywords: ["cas", "close air support", "ground support"] },
  { id: "noe-tactics", name: "NOE Flying", parentId: "tactics", keywords: ["noe", "low level", "terrain"] },
  { id: "formation", name: "Formation Flying", parentId: "tactics", keywords: ["formation", "section", "flight"] },
  { id: "air-assault", name: "Air Assault", parentId: "tactics", keywords: ["assault", "insertion", "extraction"] },

  // Level 2: Aircraft Systems subtopics
  { id: "powerplant", name: "Powerplant", parentId: "aircraft-systems", keywords: ["engine", "turbine", "power"] },
  { id: "flight-controls", name: "Flight Controls", parentId: "aircraft-systems", keywords: ["controls", "hydraulic", "rotor"] },
  { id: "avionics", name: "Avionics", parentId: "aircraft-systems", keywords: ["avionics", "navigation", "communication"] },
  { id: "sensors", name: "Sensors & Targeting", parentId: "aircraft-systems", keywords: ["sensor", "flir", "targeting"] },

  // Level 2: Weapons subtopics
  { id: "atgm", name: "Anti-Tank Missiles", parentId: "weapons", keywords: ["atgm", "helina", "hellfire", "missile"] },
  { id: "rockets", name: "Rockets", parentId: "weapons", keywords: ["rocket", "70mm", "hydra"] },
  { id: "guns", name: "Gun Systems", parentId: "weapons", keywords: ["gun", "cannon", "chain gun"] },
  { id: "air-to-air", name: "Air-to-Air", parentId: "weapons", keywords: ["air-to-air", "mistral", "aam"] },
];

// =============================================================================
// DIFFICULTY LEVELS
// =============================================================================

export type DifficultyLevel = "basic" | "intermediate" | "advanced" | "expert";

export interface DifficultyInfo {
  level: DifficultyLevel;
  name: string;
  description: string;
  applicableCourses: CourseType[];
  color: string;
}

export const difficultyLevels: Record<DifficultyLevel, DifficultyInfo> = {
  basic: {
    level: "basic",
    name: "Basic",
    description: "Foundational concepts for new pilots",
    applicableCourses: ["basic_flight"],
    color: "green",
  },
  intermediate: {
    level: "intermediate",
    name: "Intermediate",
    description: "Standard operational knowledge",
    applicableCourses: ["advanced_flight", "instrument_rating", "alh_conversion", "refresher"],
    color: "blue",
  },
  advanced: {
    level: "advanced",
    name: "Advanced",
    description: "Complex tactical scenarios",
    applicableCourses: ["attack_conversion", "cas_training", "joint_fire"],
    color: "orange",
  },
  expert: {
    level: "expert",
    name: "Expert",
    description: "Instructor-level knowledge",
    applicableCourses: ["instructor_pilot"],
    color: "red",
  },
};

// =============================================================================
// CONTENT METADATA TYPE
// =============================================================================

export interface ContentTaxonomy {
  // Primary classification
  category: ContentCategory;

  // Course applicability
  courses: CourseType[];

  // Security
  security: SecurityLevel;

  // Platforms
  helicopterPlatforms: HelicopterPlatformTag[];

  // Mission types
  missionTypes: MissionTypeTag[];

  // Topics
  topics: string[]; // Topic IDs from hierarchy

  // Difficulty
  difficulty: DifficultyLevel;

  // Additional metadata
  keywords: string[];
  version?: string;
  effectiveDate?: string;
  expiryDate?: string;
  author?: string;
  approvedBy?: string;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id || c.code === id);
}

export function getCoursesByType(type: CourseType): Course[] {
  return courses.filter((c) => c.code === type);
}

export function getTopicsByParent(parentId?: string): Topic[] {
  if (!parentId) {
    return topicHierarchy.filter((t) => !t.parentId);
  }
  return topicHierarchy.filter((t) => t.parentId === parentId);
}

export function getTopicPath(topicId: string): Topic[] {
  const path: Topic[] = [];
  let current = topicHierarchy.find((t) => t.id === topicId);

  while (current) {
    path.unshift(current);
    current = current.parentId
      ? topicHierarchy.find((t) => t.id === current!.parentId)
      : undefined;
  }

  return path;
}

export function getRelatedPlatforms(tag: HelicopterPlatformTag): HelicopterPlatformTag[] {
  return helicopterPlatformTags[tag]?.relatedPlatforms || [];
}

export function getApplicableCourses(difficulty: DifficultyLevel): CourseType[] {
  return difficultyLevels[difficulty]?.applicableCourses || [];
}

export function getPlatformsForMission(missionType: MissionTypeTag): HelicopterPlatformTag[] {
  return missionTypeTags[missionType]?.applicablePlatforms || [];
}

// Search content by taxonomy
export function matchesTaxonomy(
  content: ContentTaxonomy,
  filters: Partial<ContentTaxonomy>
): boolean {
  // Check category
  if (filters.category && content.category !== filters.category) {
    return false;
  }

  // Check courses (any match)
  if (filters.courses && filters.courses.length > 0) {
    if (!filters.courses.some((c) => content.courses.includes(c))) {
      return false;
    }
  }

  // Check security (at or below level)
  if (filters.security) {
    const levels: SecurityLevel[] = [
      "unclassified",
      "restricted",
      "confidential",
      "secret",
      "top-secret",
    ];
    const filterIndex = levels.indexOf(filters.security);
    const contentIndex = levels.indexOf(content.security);
    if (contentIndex > filterIndex) {
      return false;
    }
  }

  // Check helicopter platforms (any match)
  if (filters.helicopterPlatforms && filters.helicopterPlatforms.length > 0) {
    const expandedFilters = new Set<HelicopterPlatformTag>();
    filters.helicopterPlatforms.forEach((hp) => {
      expandedFilters.add(hp);
      getRelatedPlatforms(hp).forEach((r) => expandedFilters.add(r));
    });

    if (!content.helicopterPlatforms.some((hp) => expandedFilters.has(hp))) {
      return false;
    }
  }

  // Check mission types (any match)
  if (filters.missionTypes && filters.missionTypes.length > 0) {
    if (!filters.missionTypes.some((mt) => content.missionTypes.includes(mt))) {
      return false;
    }
  }

  // Check topics (any match)
  if (filters.topics && filters.topics.length > 0) {
    if (!filters.topics.some((t) => content.topics.includes(t))) {
      return false;
    }
  }

  // Check difficulty
  if (filters.difficulty && content.difficulty !== filters.difficulty) {
    return false;
  }

  return true;
}
