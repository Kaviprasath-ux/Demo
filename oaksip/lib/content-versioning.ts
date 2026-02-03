// Content Versioning System
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
  weaponSystem?: string;
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

// Mock versioned content data
export const mockVersionedContent: ContentItem[] = [
  {
    id: "doc-001",
    currentVersionId: "ver-001-3",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    createdBy: "Maj. Sharma",
    isLocked: false,
    currentVersion: {
      versionId: "ver-001-3",
      versionNumber: "2.1",
      contentId: "doc-001",
      title: "155mm Howitzer Gun Drill Procedures",
      content: `1. PREPARATION
1.1 Ensure all crew members are in position
1.2 Verify ammunition type and quantity
1.3 Check all safety mechanisms

2. LOADING SEQUENCE
2.1 Open breech mechanism
2.2 Insert projectile
2.3 Insert propellant charge
2.4 Close and lock breech

3. FIRING PROCEDURE
3.1 Verify firing data
3.2 Set elevation and traverse
3.3 Engage safety catch
3.4 Fire on command

4. POST-FIRE CHECKS
4.1 Verify round fired
4.2 Clear breech
4.3 Prepare for next round`,
      metadata: {
        category: "Gun Drill",
        subcategory: "155mm Howitzer",
        weaponSystem: "Dhanush",
        courseTypes: ["YO Gunnery", "JCO Cadre"],
        securityLevel: "restricted",
        tags: ["gun drill", "howitzer", "155mm", "dhanush"],
        validFrom: Date.now() - 30 * 24 * 60 * 60 * 1000,
        lastReviewDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
        nextReviewDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
      },
      status: "published",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      createdBy: "Maj. Sharma",
      changeDescription: "Updated post-fire check procedures per new SOP",
      changeType: "edited",
      previousVersionId: "ver-001-2",
      approvedBy: "Lt. Col. Verma",
      approvedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      hash: "a1b2c3d4",
    },
    versions: [
      {
        versionId: "ver-001-1",
        versionNumber: "1.0",
        contentId: "doc-001",
        title: "155mm Howitzer Gun Drill Procedures",
        content: "Initial draft content...",
        metadata: {
          category: "Gun Drill",
          weaponSystem: "Dhanush",
          courseTypes: ["YO Gunnery"],
          securityLevel: "restricted",
          tags: ["gun drill", "howitzer"],
        },
        status: "superseded",
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        createdBy: "Maj. Sharma",
        changeDescription: "Initial document creation",
        changeType: "created",
        hash: "e5f6g7h8",
      },
      {
        versionId: "ver-001-2",
        versionNumber: "2.0",
        contentId: "doc-001",
        title: "155mm Howitzer Gun Drill Procedures",
        content: "Major revision content...",
        metadata: {
          category: "Gun Drill",
          subcategory: "155mm Howitzer",
          weaponSystem: "Dhanush",
          courseTypes: ["YO Gunnery", "JCO Cadre"],
          securityLevel: "restricted",
          tags: ["gun drill", "howitzer", "155mm"],
        },
        status: "superseded",
        createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
        createdBy: "Maj. Sharma",
        changeDescription: "Major revision with expanded procedures",
        changeType: "edited",
        previousVersionId: "ver-001-1",
        approvedBy: "Lt. Col. Verma",
        approvedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
        hash: "i9j0k1l2",
      },
    ],
  },
  {
    id: "doc-002",
    currentVersionId: "ver-002-2",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    createdBy: "Capt. Kumar",
    isLocked: true,
    lockedBy: "Maj. Singh",
    lockedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    currentVersion: {
      versionId: "ver-002-2",
      versionNumber: "1.2",
      contentId: "doc-002",
      title: "Emergency Misfire Procedures",
      content: `MISFIRE PROCEDURE - 155MM SYSTEMS

IMMEDIATE ACTIONS:
1. Call "MISFIRE" loudly
2. Wait 30 seconds minimum
3. Attempt re-fire if permitted
4. If still no fire, wait additional 2 minutes

CLEARING PROCEDURE:
1. Ensure all personnel clear of muzzle arc
2. Open breech carefully
3. Extract round using proper tools
4. Inspect round for defects
5. Report to ordnance officer`,
      metadata: {
        category: "Safety",
        subcategory: "Emergency Procedures",
        weaponSystem: "Dhanush",
        courseTypes: ["YO Gunnery", "LGSC", "JCO Cadre"],
        securityLevel: "restricted",
        tags: ["misfire", "safety", "emergency"],
        validFrom: Date.now() - 45 * 24 * 60 * 60 * 1000,
      },
      status: "published",
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      createdBy: "Capt. Kumar",
      changeDescription: "Updated wait times per ARTRAC directive",
      changeType: "edited",
      previousVersionId: "ver-002-1",
      approvedBy: "Col. Reddy",
      approvedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
      hash: "m3n4o5p6",
    },
    versions: [
      {
        versionId: "ver-002-1",
        versionNumber: "1.0",
        contentId: "doc-002",
        title: "Emergency Misfire Procedures",
        content: "Original procedure content...",
        metadata: {
          category: "Safety",
          weaponSystem: "Dhanush",
          courseTypes: ["YO Gunnery"],
          securityLevel: "restricted",
          tags: ["misfire", "safety"],
        },
        status: "superseded",
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        createdBy: "Capt. Kumar",
        changeDescription: "Initial document creation",
        changeType: "created",
        hash: "q7r8s9t0",
      },
    ],
  },
  {
    id: "doc-003",
    currentVersionId: "ver-003-1",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    createdBy: "Maj. Patel",
    isLocked: false,
    currentVersion: {
      versionId: "ver-003-1",
      versionNumber: "1.0",
      contentId: "doc-003",
      title: "K9 Vajra Self-Propelled Howitzer Operations",
      content: `K9 VAJRA OPERATIONS MANUAL

1. VEHICLE STARTUP
1.1 Pre-start checks
1.2 Engine startup sequence
1.3 System diagnostics

2. GUN OPERATION
2.1 Autoloader operation
2.2 Fire control system
2.3 Rate of fire protocols

3. MOBILITY
3.1 Road march procedures
3.2 Cross-country operations
3.3 Shoot and scoot tactics`,
      metadata: {
        category: "Operations",
        subcategory: "Self-Propelled Systems",
        weaponSystem: "K9 Vajra",
        courseTypes: ["YO Gunnery", "LGSC"],
        securityLevel: "confidential",
        tags: ["k9 vajra", "self-propelled", "operations"],
        validFrom: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
      status: "pending_review",
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      createdBy: "Maj. Patel",
      changeDescription: "Initial K9 Vajra operations document",
      changeType: "created",
      hash: "u1v2w3x4",
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
    archived: "bg-purple-500",
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
