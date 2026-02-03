// Content Taxonomy System - SOW Section 8.5
// Comprehensive classification system for artillery training content

// =============================================================================
// COURSE STRUCTURES - Per School of Artillery curriculum
// =============================================================================

export type CourseType =
  | "yo" // Young Officers Course
  | "lgsc" // Long Gunnery Staff Course
  | "sta" // Survey and Target Acquisition
  | "jco" // Junior Commissioned Officers
  | "or" // Other Ranks
  | "refresher" // Refresher courses
  | "specialized"; // Specialized weapon courses

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
  assessmentType: "theory" | "practical" | "both";
}

export const courses: Course[] = [
  {
    id: "course-yo",
    code: "yo",
    name: "YO",
    fullName: "Young Officers Course",
    duration: "44 weeks",
    description:
      "Comprehensive training for newly commissioned artillery officers covering all aspects of regimental duties",
    eligibility: ["Commissioned Officers", "Post-IMA/OTA/NDA"],
    modules: [
      {
        id: "yo-basic",
        name: "Basic Gunnery",
        weeks: 8,
        topics: ["Gun drill", "Safety procedures", "Ammunition handling", "Basic fire control"],
        assessmentType: "both",
      },
      {
        id: "yo-tactical",
        name: "Tactical Employment",
        weeks: 12,
        topics: ["Battery operations", "Fire planning", "Tactical appreciation", "Map reading"],
        assessmentType: "both",
      },
      {
        id: "yo-technical",
        name: "Technical Gunnery",
        weeks: 10,
        topics: ["Ballistics", "Survey", "Meteor corrections", "Fire direction"],
        assessmentType: "theory",
      },
      {
        id: "yo-leadership",
        name: "Leadership & Management",
        weeks: 6,
        topics: ["Troop leadership", "Administration", "Maintenance management"],
        assessmentType: "both",
      },
      {
        id: "yo-simulation",
        name: "Simulation Training",
        weeks: 8,
        topics: ["3D simulator", "Fire control trainer", "Battle simulation"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-lgsc",
    code: "lgsc",
    name: "LGSC",
    fullName: "Long Gunnery Staff Course",
    duration: "10 months",
    description:
      "Advanced course for officers preparing for staff and instructional appointments",
    eligibility: ["Captains/Majors", "5+ years service", "YO qualified"],
    modules: [
      {
        id: "lgsc-advanced",
        name: "Advanced Gunnery",
        weeks: 16,
        topics: ["Complex fire missions", "Observed fire", "Unobserved fire", "Counter-battery"],
        assessmentType: "both",
      },
      {
        id: "lgsc-doctrine",
        name: "Doctrine & Tactics",
        weeks: 12,
        topics: ["Artillery doctrine", "Combined arms", "Joint operations"],
        assessmentType: "theory",
      },
      {
        id: "lgsc-instruction",
        name: "Instructional Techniques",
        weeks: 8,
        topics: ["Teaching methodology", "Training design", "Assessment methods"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-sta",
    code: "sta",
    name: "STA",
    fullName: "Survey and Target Acquisition Course",
    duration: "16 weeks",
    description: "Specialized training in survey, observation, and target acquisition",
    eligibility: ["Officers/JCOs", "Basic gunnery qualified"],
    modules: [
      {
        id: "sta-survey",
        name: "Artillery Survey",
        weeks: 6,
        topics: ["Triangulation", "GPS integration", "Survey computing"],
        assessmentType: "both",
      },
      {
        id: "sta-observation",
        name: "Observation & Adjustment",
        weeks: 5,
        topics: ["OP procedures", "Adjustment of fire", "Forward observation"],
        assessmentType: "both",
      },
      {
        id: "sta-sensors",
        name: "Sensors & Systems",
        weeks: 5,
        topics: ["Radar operation", "UAV integration", "Sound ranging"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-jco",
    code: "jco",
    name: "JCO",
    fullName: "Junior Commissioned Officers Course",
    duration: "12 weeks",
    description: "Leadership and technical training for JCOs",
    eligibility: ["Havildars promoted to JCO"],
    modules: [
      {
        id: "jco-leadership",
        name: "Leadership",
        weeks: 4,
        topics: ["Troop management", "Drill supervision", "Administrative duties"],
        assessmentType: "both",
      },
      {
        id: "jco-technical",
        name: "Technical Skills",
        weeks: 8,
        topics: ["Gun maintenance", "Safety supervision", "Equipment care"],
        assessmentType: "practical",
      },
    ],
  },
  {
    id: "course-or",
    code: "or",
    name: "OR Basic",
    fullName: "Other Ranks Basic Course",
    duration: "8 weeks",
    description: "Foundational training for enlisted personnel",
    eligibility: ["New recruits"],
    modules: [
      {
        id: "or-drill",
        name: "Gun Drill",
        weeks: 4,
        topics: ["Crew duties", "Loading drill", "Safety procedures"],
        assessmentType: "practical",
      },
      {
        id: "or-equipment",
        name: "Equipment Handling",
        weeks: 4,
        topics: ["Ammunition handling", "Equipment maintenance", "Field operations"],
        assessmentType: "practical",
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
// WEAPON SYSTEM TAGS
// =============================================================================

export type WeaponSystemTag =
  | "dhanush"
  | "bofors"
  | "k9-vajra"
  | "atags"
  | "pinaka"
  | "all-towed"
  | "all-sp"
  | "all-mbrl"
  | "general";

export interface WeaponSystemTaxonomy {
  tag: WeaponSystemTag;
  name: string;
  description: string;
  relatedSystems: WeaponSystemTag[];
}

export const weaponSystemTags: Record<WeaponSystemTag, WeaponSystemTaxonomy> = {
  dhanush: {
    tag: "dhanush",
    name: "Dhanush 155mm",
    description: "Indigenous 155mm/45 caliber towed howitzer",
    relatedSystems: ["bofors", "atags", "all-towed"],
  },
  bofors: {
    tag: "bofors",
    name: "Bofors FH-77B",
    description: "Swedish 155mm/39 caliber towed howitzer",
    relatedSystems: ["dhanush", "all-towed"],
  },
  "k9-vajra": {
    tag: "k9-vajra",
    name: "K9 Vajra-T",
    description: "155mm/52 caliber self-propelled howitzer",
    relatedSystems: ["all-sp"],
  },
  atags: {
    tag: "atags",
    name: "ATAGS",
    description: "Advanced Towed Artillery Gun System 155mm/52",
    relatedSystems: ["dhanush", "bofors", "all-towed"],
  },
  pinaka: {
    tag: "pinaka",
    name: "Pinaka MBRL",
    description: "Multi-Barrel Rocket Launcher system",
    relatedSystems: ["all-mbrl"],
  },
  "all-towed": {
    tag: "all-towed",
    name: "All Towed Systems",
    description: "Applicable to all towed artillery systems",
    relatedSystems: ["dhanush", "bofors", "atags"],
  },
  "all-sp": {
    tag: "all-sp",
    name: "All Self-Propelled",
    description: "Applicable to all self-propelled artillery",
    relatedSystems: ["k9-vajra"],
  },
  "all-mbrl": {
    tag: "all-mbrl",
    name: "All MBRL Systems",
    description: "Applicable to all multi-barrel rocket launchers",
    relatedSystems: ["pinaka"],
  },
  general: {
    tag: "general",
    name: "General Artillery",
    description: "Applicable to all artillery systems",
    relatedSystems: ["all-towed", "all-sp", "all-mbrl"],
  },
};

// =============================================================================
// CONTENT TYPES
// =============================================================================

export type ContentCategory =
  | "doctrine"
  | "sop"
  | "technical"
  | "reference"
  | "training"
  | "assessment"
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
  doctrine: {
    id: "doctrine",
    name: "Doctrine",
    description: "Official artillery doctrine and tactical principles",
    icon: "BookOpen",
    examples: ["Artillery Tactics", "Fire Support Doctrine", "Combined Arms Operations"],
  },
  sop: {
    id: "sop",
    name: "Standard Operating Procedures",
    description: "Step-by-step procedures for operations",
    icon: "FileText",
    examples: ["Battery SOP", "Fire Mission SOP", "Emergency Procedures"],
  },
  technical: {
    id: "technical",
    name: "Technical Manuals",
    description: "Equipment specifications and technical details",
    icon: "Wrench",
    examples: ["Gun Specifications", "Ammunition Data", "Fire Control Systems"],
  },
  reference: {
    id: "reference",
    name: "Reference Material",
    description: "Tables, charts, and quick reference guides",
    icon: "Table",
    examples: ["Firing Tables", "Conversion Charts", "Quick Reference Cards"],
  },
  training: {
    id: "training",
    name: "Training Material",
    description: "Instructional content for courses and drills",
    icon: "GraduationCap",
    examples: ["Lesson Plans", "Drill Scripts", "Training Aids"],
  },
  assessment: {
    id: "assessment",
    name: "Assessment Material",
    description: "Tests, quizzes, and evaluation criteria",
    icon: "ClipboardCheck",
    examples: ["Question Banks", "Rubrics", "Evaluation Forms"],
  },
  safety: {
    id: "safety",
    name: "Safety Publications",
    description: "Safety procedures and warnings",
    icon: "AlertTriangle",
    examples: ["Safety Regulations", "Incident Reports", "Safety Bulletins"],
  },
  maintenance: {
    id: "maintenance",
    name: "Maintenance Guides",
    description: "Equipment care and maintenance procedures",
    icon: "Settings",
    examples: ["Preventive Maintenance", "Troubleshooting Guides", "Parts Lists"],
  },
};

// =============================================================================
// TOPIC HIERARCHY
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
  { id: "gunnery", name: "Gunnery", keywords: ["gun", "firing", "ballistics", "trajectory"] },
  { id: "tactics", name: "Tactics", keywords: ["tactical", "employment", "operations"] },
  { id: "equipment", name: "Equipment", keywords: ["hardware", "system", "weapon"] },
  { id: "operations", name: "Operations", keywords: ["mission", "fire support", "deployment"] },

  // Level 2: Gunnery subtopics
  { id: "gun-drill", name: "Gun Drill", parentId: "gunnery", keywords: ["drill", "crew", "loading"] },
  { id: "fire-control", name: "Fire Control", parentId: "gunnery", keywords: ["fdc", "computation", "data"] },
  { id: "ballistics", name: "Ballistics", parentId: "gunnery", keywords: ["trajectory", "velocity", "range"] },
  { id: "ammunition", name: "Ammunition", parentId: "gunnery", keywords: ["ammo", "fuze", "propellant"] },

  // Level 2: Tactics subtopics
  { id: "fire-planning", name: "Fire Planning", parentId: "tactics", keywords: ["fire plan", "target", "priority"] },
  { id: "observation", name: "Observation", parentId: "tactics", keywords: ["op", "forward", "adjustment"] },
  { id: "movement", name: "Movement & Position", parentId: "tactics", keywords: ["position", "displace", "march"] },

  // Level 2: Equipment subtopics
  { id: "towed-guns", name: "Towed Guns", parentId: "equipment", keywords: ["towed", "howitzer", "155mm"] },
  { id: "sp-guns", name: "Self-Propelled Guns", parentId: "equipment", keywords: ["self-propelled", "track", "k9"] },
  { id: "mbrl", name: "MBRL Systems", parentId: "equipment", keywords: ["rocket", "pinaka", "mbrl"] },
  { id: "fire-direction", name: "Fire Direction Equipment", parentId: "equipment", keywords: ["computer", "fdc"] },

  // Level 2: Operations subtopics
  { id: "direct-support", name: "Direct Support", parentId: "operations", keywords: ["ds", "infantry", "close"] },
  { id: "general-support", name: "General Support", parentId: "operations", keywords: ["gs", "reinforcing"] },
  { id: "counter-battery", name: "Counter Battery", parentId: "operations", keywords: ["cb", "hostile", "radar"] },
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
    description: "Foundational concepts and procedures",
    applicableCourses: ["or", "jco"],
    color: "green",
  },
  intermediate: {
    level: "intermediate",
    name: "Intermediate",
    description: "Standard operational knowledge",
    applicableCourses: ["yo", "jco", "refresher"],
    color: "blue",
  },
  advanced: {
    level: "advanced",
    name: "Advanced",
    description: "Complex scenarios and advanced techniques",
    applicableCourses: ["yo", "lgsc", "sta"],
    color: "orange",
  },
  expert: {
    level: "expert",
    name: "Expert",
    description: "Instructor-level and specialized knowledge",
    applicableCourses: ["lgsc", "specialized"],
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

  // Weapon systems
  weaponSystems: WeaponSystemTag[];

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

export function getRelatedWeaponSystems(tag: WeaponSystemTag): WeaponSystemTag[] {
  return weaponSystemTags[tag]?.relatedSystems || [];
}

export function getApplicableCourses(difficulty: DifficultyLevel): CourseType[] {
  return difficultyLevels[difficulty]?.applicableCourses || [];
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

  // Check weapon systems (any match)
  if (filters.weaponSystems && filters.weaponSystems.length > 0) {
    // Include related systems
    const expandedFilters = new Set<WeaponSystemTag>();
    filters.weaponSystems.forEach((ws) => {
      expandedFilters.add(ws);
      getRelatedWeaponSystems(ws).forEach((r) => expandedFilters.add(r));
    });

    if (!content.weaponSystems.some((ws) => expandedFilters.has(ws))) {
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
