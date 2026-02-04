// Content Versioning System for Aviation
// SOW Section 8.5: Content Management with version control and audit trail

export type ContentStatus = "draft" | "pending_review" | "approved" | "published" | "archived" | "superseded";
export type ChangeType = "created" | "edited" | "status_changed" | "metadata_updated" | "restored";

export interface ContentVersion {
  versionId: string;
  versionNumber: string; // e.g., "1.0", "1.1", "2.0"
  contentId: string;
  title: string;
  content: string;
  metadata: ContentMetadata;
  status: ContentStatus;
  createdAt: number;
  createdBy: string;
  changeDescription: string;
  changeType: ChangeType;
  previousVersionId?: string;
  approvedBy?: string;
  approvedAt?: number;
  hash: string; // Content hash for integrity verification
}

export interface ContentMetadata {
  category: string;
  subcategory?: string;
  helicopterPlatform?: string;
  missionType?: string;
  courseTypes: string[];
  securityLevel: "unclassified" | "restricted" | "confidential" | "secret";
  tags: string[];
  validFrom?: number;
  validUntil?: number;
  sourceDocument?: string;
  lastReviewDate?: number;
  nextReviewDate?: number;
}

export interface ContentItem {
  id: string;
  currentVersionId: string;
  currentVersion: ContentVersion;
  versions: ContentVersion[];
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: number;
  createdAt: number;
  createdBy: string;
}

export interface VersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
  metadataChanges: { field: string; oldValue: string; newValue: string }[];
}

// Generate simple hash for content integrity
function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// Generate version number
function generateVersionNumber(previousVersion?: string, isMinor: boolean = true): string {
  if (!previousVersion) return "1.0";

  const [major, minor] = previousVersion.split(".").map(Number);
  if (isMinor) {
    return `${major}.${minor + 1}`;
  }
  return `${major + 1}.0`;
}

// Create a new version
export function createVersion(
  contentId: string,
  title: string,
  content: string,
  metadata: ContentMetadata,
  createdBy: string,
  changeDescription: string,
  previousVersion?: ContentVersion,
  isMinorChange: boolean = true
): ContentVersion {
  const versionNumber = generateVersionNumber(previousVersion?.versionNumber, isMinorChange);

  return {
    versionId: `ver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    versionNumber,
    contentId,
    title,
    content,
    metadata,
    status: previousVersion ? "draft" : "draft",
    createdAt: Date.now(),
    createdBy,
    changeDescription,
    changeType: previousVersion ? "edited" : "created",
    previousVersionId: previousVersion?.versionId,
    hash: generateHash(content + JSON.stringify(metadata)),
  };
}

// Compare two versions
export function compareVersions(oldVersion: ContentVersion, newVersion: ContentVersion): VersionDiff {
  const oldLines = oldVersion.content.split("\n");
  const newLines = newVersion.content.split("\n");

  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  // Simple line-by-line comparison
  const maxLines = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLines; i++) {
    if (i >= oldLines.length) {
      added.push(newLines[i]);
    } else if (i >= newLines.length) {
      removed.push(oldLines[i]);
    } else if (oldLines[i] !== newLines[i]) {
      modified.push(`Line ${i + 1}: "${oldLines[i]}" → "${newLines[i]}"`);
    }
  }

  // Compare metadata
  const metadataChanges: { field: string; oldValue: string; newValue: string }[] = [];
  const allFields = new Set([
    ...Object.keys(oldVersion.metadata),
    ...Object.keys(newVersion.metadata),
  ]);

  allFields.forEach((field) => {
    const oldMeta = oldVersion.metadata as unknown as Record<string, unknown>;
    const newMeta = newVersion.metadata as unknown as Record<string, unknown>;
    const oldVal = JSON.stringify(oldMeta[field] || "");
    const newVal = JSON.stringify(newMeta[field] || "");
    if (oldVal !== newVal) {
      metadataChanges.push({ field, oldValue: oldVal, newValue: newVal });
    }
  });

  return { added, removed, modified, metadataChanges };
}

// Mock versioned content data - Aviation specific
export const mockVersionedContent: ContentItem[] = [
  {
    id: "doc-av-ver-001",
    currentVersionId: "ver-av-001-3",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    createdBy: "Wg Cdr Mehta",
    isLocked: false,
    currentVersion: {
      versionId: "ver-av-001-3",
      versionNumber: "2.1",
      contentId: "doc-av-ver-001",
      title: "ALH Dhruv Normal Procedures",
      content: `1. PRE-FLIGHT INSPECTION
1.1 Walk around inspection per checklist
1.2 Check fuel quantity and quality
1.3 Verify all panels secured
1.4 Check rotor head and blades

2. ENGINE START SEQUENCE
2.1 Battery switch ON
2.2 Fuel boost pump ON
2.3 Engage starter (N1 > 15%)
2.4 Introduce fuel (N1 > 25%)
2.5 Monitor for light-up (30 seconds max)
2.6 Stabilize at ground idle

3. HOVER CHECK
3.1 Lift to 3-foot hover
3.2 Check pedal response
3.3 Verify cyclic control
3.4 Note power required
3.5 Check instruments

4. TAKEOFF PROCEDURE
4.1 Clear the area
4.2 Apply forward cyclic
4.3 Coordinate collective
4.4 Maintain ETL awareness
4.5 Establish climb attitude`,
      metadata: {
        category: "Flight Manual",
        subcategory: "Normal Procedures",
        helicopterPlatform: "ALH Dhruv",
        courseTypes: ["Basic Flight", "ALH Conversion"],
        securityLevel: "restricted",
        tags: ["dhruv", "procedures", "normal ops", "startup"],
        validFrom: Date.now() - 30 * 24 * 60 * 60 * 1000,
        lastReviewDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
        nextReviewDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
      },
      status: "published",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      createdBy: "Wg Cdr Mehta",
      changeDescription: "Updated engine start sequence per HAL Service Bulletin SB-2024-03",
      changeType: "edited",
      previousVersionId: "ver-av-001-2",
      approvedBy: "Gp Capt Sharma",
      approvedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      hash: "av1b2c3d4",
    },
    versions: [
      {
        versionId: "ver-av-001-1",
        versionNumber: "1.0",
        contentId: "doc-av-ver-001",
        title: "ALH Dhruv Normal Procedures",
        content: "Initial draft content...",
        metadata: {
          category: "Flight Manual",
          helicopterPlatform: "ALH Dhruv",
          courseTypes: ["Basic Flight"],
          securityLevel: "restricted",
          tags: ["dhruv", "procedures"],
        },
        status: "superseded",
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        createdBy: "Wg Cdr Mehta",
        changeDescription: "Initial document creation",
        changeType: "created",
        hash: "av5f6g7h8",
      },
      {
        versionId: "ver-av-001-2",
        versionNumber: "2.0",
        contentId: "doc-av-ver-001",
        title: "ALH Dhruv Normal Procedures",
        content: "Major revision content...",
        metadata: {
          category: "Flight Manual",
          subcategory: "Normal Procedures",
          helicopterPlatform: "ALH Dhruv",
          courseTypes: ["Basic Flight", "ALH Conversion"],
          securityLevel: "restricted",
          tags: ["dhruv", "procedures", "normal ops"],
        },
        status: "superseded",
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        createdBy: "Wg Cdr Mehta",
        changeDescription: "Major revision with expanded hover check procedures",
        changeType: "edited",
        previousVersionId: "ver-av-001-1",
        approvedBy: "Gp Capt Sharma",
        approvedAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
        hash: "av9j0k1l2",
      },
    ],
  },
  {
    id: "doc-av-ver-002",
    currentVersionId: "ver-av-002-2",
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    createdBy: "Sqn Ldr Kumar",
    isLocked: true,
    lockedBy: "Wg Cdr Singh",
    lockedAt: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    currentVersion: {
      versionId: "ver-av-002-2",
      versionNumber: "1.2",
      contentId: "doc-av-ver-002",
      title: "Engine Failure Emergency Procedures",
      content: `ENGINE FAILURE - SINGLE ENGINE (HOVER)

IMMEDIATE ACTIONS:
1. Lower collective smoothly
2. Enter autorotation
3. Maintain rotor RPM (100-107%)

SUBSEQUENT ACTIONS:
4. Identify suitable landing area
5. Establish autorotative descent
6. At 100ft AGL - Begin flare
7. Level aircraft
8. Apply collective cushion
9. Touch down

ENGINE FAILURE - CRUISE FLIGHT

IMMEDIATE ACTIONS:
1. Lower collective
2. Establish autorotative glide
3. Best glide speed: 70 KIAS
4. Turn towards suitable landing area

SUBSEQUENT ACTIONS:
5. Attempt engine restart if altitude permits
6. Transmit MAYDAY
7. Execute autorotative landing`,
      metadata: {
        category: "Emergency Procedures",
        subcategory: "Engine Failure",
        helicopterPlatform: "ALH Dhruv",
        courseTypes: ["Basic Flight", "ALH Conversion", "Instrument Rating"],
        securityLevel: "restricted",
        tags: ["emergency", "engine failure", "autorotation"],
        validFrom: Date.now() - 75 * 24 * 60 * 60 * 1000,
      },
      status: "published",
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      createdBy: "Sqn Ldr Kumar",
      changeDescription: "Added cruise flight engine failure procedures",
      changeType: "edited",
      previousVersionId: "ver-av-002-1",
      approvedBy: "Gp Capt Sharma",
      approvedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
      hash: "avm3n4o5p6",
    },
    versions: [
      {
        versionId: "ver-av-002-1",
        versionNumber: "1.0",
        contentId: "doc-av-ver-002",
        title: "Engine Failure Emergency Procedures",
        content: "Original procedure content...",
        metadata: {
          category: "Emergency Procedures",
          helicopterPlatform: "ALH Dhruv",
          courseTypes: ["Basic Flight"],
          securityLevel: "restricted",
          tags: ["emergency", "engine failure"],
        },
        status: "superseded",
        createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
        createdBy: "Sqn Ldr Kumar",
        changeDescription: "Initial document creation",
        changeType: "created",
        hash: "avq7r8s9t0",
      },
    ],
  },
  {
    id: "doc-av-ver-003",
    currentVersionId: "ver-av-003-1",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    createdBy: "Lt Col Reddy",
    isLocked: false,
    currentVersion: {
      versionId: "ver-av-003-1",
      versionNumber: "1.0",
      contentId: "doc-av-ver-003",
      title: "CAS Procedures for Rudra Attack Helicopter",
      content: `CAS EXECUTION - RUDRA

1. MISSION BRIEF REQUIREMENTS
1.1 Confirm 9-line brief received
1.2 Verify target coordinates
1.3 Confirm friendlies position
1.4 Understand control type (1/2/3)

2. INGRESS PROCEDURES
2.1 Contact JTAC at IP
2.2 Confirm target mark (if applicable)
2.3 Report "CONTACT" when visual
2.4 Report "TALLY" on target

3. WEAPONS DELIVERY
3.1 Confirm cleared hot
3.2 Select appropriate weapon
3.3 Execute attack profile
3.4 Report "RIFLE" (missile) or "GUNS" (cannon)
3.5 Report BDA

4. EGRESS
4.1 Execute break as briefed
4.2 Report "OFF" with direction
4.3 Contact JTAC for re-attack or RTB`,
      metadata: {
        category: "Weapons Employment",
        subcategory: "Close Air Support",
        helicopterPlatform: "HAL Rudra",
        missionType: "CAS",
        courseTypes: ["Attack Conversion", "CAS Training"],
        securityLevel: "confidential",
        tags: ["cas", "rudra", "weapons", "jtac"],
        validFrom: Date.now() - 15 * 24 * 60 * 60 * 1000,
      },
      status: "pending_review",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      createdBy: "Lt Col Reddy",
      changeDescription: "Initial CAS procedures document for Rudra",
      changeType: "created",
      hash: "avu1v2w3x4",
    },
    versions: [],
  },
  {
    id: "doc-av-ver-004",
    currentVersionId: "ver-av-004-1",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    createdBy: "Wg Cdr Kapoor",
    isLocked: false,
    currentVersion: {
      versionId: "ver-av-004-1",
      versionNumber: "1.0",
      contentId: "doc-av-ver-004",
      title: "Apache AH-64E Hellfire Employment",
      content: `HELLFIRE EMPLOYMENT PROCEDURES

1. PRE-ENGAGEMENT CHECKS
1.1 Verify weapon selected (AGM-114)
1.2 Confirm seeker mode (LOBL/LOAL)
1.3 Verify TADS tracking
1.4 Check PRF code match

2. LOCK-ON BEFORE LAUNCH (LOBL)
2.1 Acquire target with TADS
2.2 Designate target (laser on)
2.3 Verify lock-on tone
2.4 Pull trigger to consent
2.5 Launch indication

3. POST-LAUNCH
3.1 Maintain designation until impact
3.2 Observe for splash
3.3 Assess damage
3.4 Re-engage if required`,
      metadata: {
        category: "Weapons Employment",
        subcategory: "ATGM",
        helicopterPlatform: "Apache AH-64E",
        missionType: "CAS",
        courseTypes: ["Attack Conversion"],
        securityLevel: "confidential",
        tags: ["apache", "hellfire", "atgm", "weapons"],
        validFrom: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      status: "draft",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      createdBy: "Wg Cdr Kapoor",
      changeDescription: "Initial Hellfire employment procedures",
      changeType: "created",
      hash: "avy5z6a7b8",
    },
    versions: [],
  },
];

// Get version history for a content item
export function getVersionHistory(contentId: string): ContentVersion[] {
  const item = mockVersionedContent.find((c) => c.id === contentId);
  if (!item) return [];

  return [item.currentVersion, ...item.versions].sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

// Get status badge color
export function getStatusColor(status: ContentStatus): string {
  const colors: Record<ContentStatus, string> = {
    draft: "bg-gray-500",
    pending_review: "bg-yellow-500",
    approved: "bg-blue-500",
    published: "bg-green-500",
    archived: "bg-blue-500",
    superseded: "bg-orange-500",
  };
  return colors[status];
}

// Get security level color
export function getSecurityColor(level: ContentMetadata["securityLevel"]): string {
  const colors: Record<string, string> = {
    unclassified: "bg-gray-500",
    restricted: "bg-yellow-500",
    confidential: "bg-orange-500",
    secret: "bg-red-500",
  };
  return colors[level];
}

// Format date for display
export function formatVersionDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
