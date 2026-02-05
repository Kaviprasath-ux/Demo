// Document Ingestion Pipeline for Aviation
// SOW Section 8.1: Content ingestion from flight manuals, SOPs, doctrine

export type DocumentType = "pdf" | "docx" | "txt" | "html" | "markdown";
export type IngestionStatus = "pending" | "processing" | "completed" | "failed" | "review_required";
export type ContentClassification =
  | "flight_manual"
  | "sop"
  | "doctrine"
  | "technical"
  | "training"
  | "checklist"
  | "weapons_employment"
  | "emergency_procedures";

export interface DocumentMetadata {
  title: string;
  author?: string;
  createdDate?: number;
  modifiedDate?: number;
  pageCount?: number;
  wordCount?: number;
  language: string;
  sourceSystem?: string;
}

export interface ExtractedSection {
  id: string;
  title: string;
  content: string;
  pageNumbers?: number[];
  headingLevel: number;
  parentSectionId?: string;
  keywords: string[];
  entities: ExtractedEntity[];
}

export interface ExtractedEntity {
  type:
    | "helicopter_platform"
    | "procedure"
    | "specification"
    | "location"
    | "unit"
    | "personnel"
    | "weapon_system"
    | "mission_type"
    | "airspace";
  value: string;
  context: string;
  confidence: number;
}

export interface IngestedDocument {
  id: string;
  filename: string;
  documentType: DocumentType;
  classification: ContentClassification;
  status: IngestionStatus;
  metadata: DocumentMetadata;
  sections: ExtractedSection[];
  rawContent: string;
  processedContent: string;
  uploadedBy: string;
  uploadedAt: number;
  processedAt?: number;
  processingDuration?: number;
  errors?: string[];
  warnings?: string[];
  reviewNotes?: string;
  approvedBy?: string;
  approvedAt?: number;
  tags: string[];
  relatedDocuments: string[];
  courseAssociations: string[];
  helicopterPlatforms: string[];
}

export interface IngestionJob {
  id: string;
  documentId: string;
  filename: string;
  status: IngestionStatus;
  progress: number;
  startedAt: number;
  completedAt?: number;
  steps: IngestionStep[];
  currentStep: string;
}

export interface IngestionStep {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: number;
  completedAt?: number;
  details?: string;
}

// Document parsing utilities (mock implementations)
export function parseDocumentContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    // In production, this would use PDF.js, mammoth.js, etc.
    setTimeout(() => {
      resolve(`Mock extracted content from ${file.name}...`);
    }, 1000);
  });
}

// Extract sections from content
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function extractSections(_content: string, _filename: string): ExtractedSection[] {
  // Mock section extraction - in production would use NLP/regex patterns
  const mockSections: ExtractedSection[] = [
    {
      id: "sec-1",
      title: "Introduction",
      content: "This document covers...",
      headingLevel: 1,
      keywords: ["introduction", "overview"],
      entities: [],
    },
    {
      id: "sec-2",
      title: "Normal Procedures",
      content: "The following procedures...",
      headingLevel: 1,
      keywords: ["procedures", "normal", "flight"],
      entities: [
        { type: "procedure", value: "Engine Start Sequence", context: "Pre-flight", confidence: 0.95 },
      ],
    },
    {
      id: "sec-3",
      title: "Emergency Procedures",
      content: "In case of emergency...",
      headingLevel: 1,
      keywords: ["emergency", "procedures", "safety"],
      entities: [
        { type: "procedure", value: "Autorotation", context: "Engine failure", confidence: 0.97 },
      ],
    },
  ];

  return mockSections;
}

// Extract entities from content - Aviation specific
export function extractEntities(content: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];

  // Helicopter platform patterns
  const helicopterPatterns = [
    { pattern: /alh\s*dhruv|dhruv/gi, type: "helicopter_platform" as const },
    { pattern: /rudra|alh\s*wsi/gi, type: "helicopter_platform" as const },
    { pattern: /lch\s*prachand|prachand/gi, type: "helicopter_platform" as const },
    { pattern: /apache\s*ah-?64|ah-?64|apache/gi, type: "helicopter_platform" as const },
    { pattern: /chetak|cheetah/gi, type: "helicopter_platform" as const },
    { pattern: /chinook|ch-?47/gi, type: "helicopter_platform" as const },
  ];

  // Weapon system patterns
  const weaponPatterns = [
    { pattern: /helina|dhruvastra/gi, type: "weapon_system" as const },
    { pattern: /mistral/gi, type: "weapon_system" as const },
    { pattern: /hellfire|agm-?114/gi, type: "weapon_system" as const },
    { pattern: /70\s*mm\s*rocket|hydra/gi, type: "weapon_system" as const },
    { pattern: /m230\s*chain\s*gun|20\s*mm\s*cannon/gi, type: "weapon_system" as const },
    { pattern: /turret\s*gun|chin\s*gun/gi, type: "weapon_system" as const },
  ];

  // Procedure patterns
  const procedurePatterns = [
    { pattern: /autorotation/gi, type: "procedure" as const },
    { pattern: /engine\s*start/gi, type: "procedure" as const },
    { pattern: /pre-?flight\s*(check|inspection)/gi, type: "procedure" as const },
    { pattern: /hover\s*check/gi, type: "procedure" as const },
    { pattern: /run-?on\s*landing/gi, type: "procedure" as const },
    { pattern: /confined\s*area\s*(landing|takeoff)/gi, type: "procedure" as const },
    { pattern: /nap\s*of\s*the\s*earth|noe/gi, type: "procedure" as const },
  ];

  // Mission type patterns
  const missionPatterns = [
    { pattern: /close\s*air\s*support|cas/gi, type: "mission_type" as const },
    { pattern: /reconnaissance|recce/gi, type: "mission_type" as const },
    { pattern: /medevac|casualty\s*evacuation/gi, type: "mission_type" as const },
    { pattern: /search\s*and\s*rescue|sar/gi, type: "mission_type" as const },
    { pattern: /troop\s*transport/gi, type: "mission_type" as const },
    { pattern: /armed\s*escort/gi, type: "mission_type" as const },
  ];

  // Airspace patterns
  const airspacePatterns = [
    { pattern: /no-?fly\s*zone|nfz/gi, type: "airspace" as const },
    { pattern: /restricted\s*area/gi, type: "airspace" as const },
    { pattern: /farp|forward\s*arming/gi, type: "airspace" as const },
    { pattern: /battle\s*position|bp/gi, type: "airspace" as const },
  ];

  [...helicopterPatterns, ...weaponPatterns, ...procedurePatterns, ...missionPatterns, ...airspacePatterns].forEach(({ pattern, type }) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      entities.push({
        type,
        value: match[0],
        context: content.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50),
        confidence: 0.85 + Math.random() * 0.15,
      });
    }
  });

  return entities;
}

// Auto-classify document - Aviation specific
export function classifyDocument(content: string, filename: string): ContentClassification {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.includes("emergency") || lowerContent.includes("emergency procedure")) {
    return "emergency_procedures";
  }
  if (lowerFilename.includes("checklist") || lowerContent.includes("checklist")) {
    return "checklist";
  }
  if (lowerFilename.includes("sop") || lowerContent.includes("standard operating procedure")) {
    return "sop";
  }
  if (lowerFilename.includes("weapons") || lowerContent.includes("weapons employment")) {
    return "weapons_employment";
  }
  if (lowerFilename.includes("flight manual") || lowerContent.includes("flight manual")) {
    return "flight_manual";
  }
  if (lowerFilename.includes("doctrine") || lowerContent.includes("tactical doctrine")) {
    return "doctrine";
  }
  if (lowerFilename.includes("technical") || lowerContent.includes("technical manual")) {
    return "technical";
  }
  if (lowerFilename.includes("training") || lowerContent.includes("training syllabus")) {
    return "training";
  }

  return "doctrine";
}

// Extract keywords from content
export function extractKeywords(content: string): string[] {
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "and", "but", "if", "or", "because", "until", "while"]);

  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordFreq: Record<string, number> = {};

  words.forEach((word) => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

// Mock ingested documents - Aviation specific
export const mockIngestedDocuments: IngestedDocument[] = [
  {
    id: "doc-av-001",
    filename: "ALH_Dhruv_Flight_Manual_Vol1.pdf",
    documentType: "pdf",
    classification: "flight_manual",
    status: "completed",
    metadata: {
      title: "ALH Dhruv Flight Manual Volume 1 - Normal Procedures",
      author: "HAL Helicopter Division",
      createdDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
      pageCount: 245,
      wordCount: 68000,
      language: "en",
    },
    sections: [
      {
        id: "sec-av-001-1",
        title: "Aircraft Description",
        content: "The Advanced Light Helicopter (ALH) Dhruv is a multi-role helicopter...",
        pageNumbers: [1, 2, 3, 4, 5],
        headingLevel: 1,
        keywords: ["dhruv", "alh", "description", "specifications"],
        entities: [
          { type: "helicopter_platform", value: "ALH Dhruv", context: "Primary training helicopter", confidence: 0.98 },
        ],
      },
      {
        id: "sec-av-001-2",
        title: "Normal Procedures",
        content: "This chapter covers all normal flight procedures including startup, hover, and cruise...",
        pageNumbers: [45, 46, 47, 48, 49, 50],
        headingLevel: 1,
        keywords: ["procedures", "normal", "startup", "hover"],
        entities: [
          { type: "procedure", value: "Engine Start Sequence", context: "Normal operations", confidence: 0.95 },
        ],
      },
    ],
    rawContent: "Full flight manual content...",
    processedContent: "Processed and indexed content...",
    uploadedBy: "Wg Cdr Mehta",
    uploadedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 59 * 24 * 60 * 60 * 1000,
    processingDuration: 120000,
    tags: ["dhruv", "alh", "flight manual", "normal procedures"],
    relatedDocuments: ["doc-av-002"],
    courseAssociations: ["Basic Flight Training", "ALH Conversion"],
    helicopterPlatforms: ["ALH Dhruv"],
    approvedBy: "Gp Capt Sharma",
    approvedAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
  },
  {
    id: "doc-av-002",
    filename: "ALH_Dhruv_Emergency_Procedures.pdf",
    documentType: "pdf",
    classification: "emergency_procedures",
    status: "completed",
    metadata: {
      title: "ALH Dhruv Emergency Procedures",
      author: "HAL Helicopter Division",
      createdDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
      pageCount: 78,
      wordCount: 18500,
      language: "en",
    },
    sections: [
      {
        id: "sec-av-002-1",
        title: "Engine Failure Procedures",
        content: "In case of single engine failure, immediate actions are...",
        pageNumbers: [12, 13, 14, 15],
        headingLevel: 1,
        keywords: ["engine failure", "emergency", "autorotation"],
        entities: [
          { type: "procedure", value: "Autorotation", context: "Engine failure response", confidence: 0.97 },
        ],
      },
    ],
    rawContent: "Full emergency procedures content...",
    processedContent: "Processed emergency content...",
    uploadedBy: "Wg Cdr Mehta",
    uploadedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 59 * 24 * 60 * 60 * 1000,
    processingDuration: 45000,
    tags: ["dhruv", "emergency", "autorotation", "engine failure"],
    relatedDocuments: ["doc-av-001"],
    courseAssociations: ["Basic Flight Training", "ALH Conversion", "Instrument Rating"],
    helicopterPlatforms: ["ALH Dhruv"],
    approvedBy: "Gp Capt Sharma",
    approvedAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
  },
  {
    id: "doc-av-003",
    filename: "Rudra_Weapons_Employment_Manual.pdf",
    documentType: "pdf",
    classification: "weapons_employment",
    status: "completed",
    metadata: {
      title: "HAL Rudra Weapons Employment Manual",
      author: "Army Aviation Directorate",
      createdDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
      pageCount: 156,
      wordCount: 42000,
      language: "en",
    },
    sections: [
      {
        id: "sec-av-003-1",
        title: "Weapons Systems Overview",
        content: "The Rudra is equipped with Helina ATGMs, 70mm rockets, and 20mm turret gun...",
        pageNumbers: [8, 9, 10],
        headingLevel: 1,
        keywords: ["weapons", "helina", "rockets", "turret"],
        entities: [
          { type: "helicopter_platform", value: "Rudra", context: "Attack helicopter", confidence: 0.98 },
          { type: "weapon_system", value: "Helina", context: "Anti-tank guided missile", confidence: 0.96 },
        ],
      },
    ],
    rawContent: "Full weapons manual content...",
    processedContent: "Processed weapons content...",
    uploadedBy: "Lt Col Reddy",
    uploadedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 29 * 24 * 60 * 60 * 1000,
    processingDuration: 85000,
    tags: ["rudra", "weapons", "helina", "cas", "attack"],
    relatedDocuments: [],
    courseAssociations: ["Attack Helicopter Conversion", "CAS Training"],
    helicopterPlatforms: ["HAL Rudra"],
    approvedBy: "Brig Iyer",
    approvedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: "doc-av-004",
    filename: "CAS_SOP_Joint_Operations.pdf",
    documentType: "pdf",
    classification: "sop",
    status: "review_required",
    metadata: {
      title: "Close Air Support Standard Operating Procedures",
      author: "Joint Fire Support Cell",
      createdDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
      pageCount: 64,
      wordCount: 15800,
      language: "en",
    },
    sections: [],
    rawContent: "CAS SOP content...",
    processedContent: "Processed CAS content...",
    uploadedBy: "Maj Singh",
    uploadedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    processingDuration: 55000,
    warnings: ["References to classified coordinates need review"],
    tags: ["cas", "joint operations", "sop", "air-ground"],
    relatedDocuments: [],
    courseAssociations: ["CAS Training", "Joint Fire Support"],
    helicopterPlatforms: ["HAL Rudra", "LCH Prachand", "Apache AH-64E"],
  },
  {
    id: "doc-av-005",
    filename: "Apache_AH64E_Checklist.pdf",
    documentType: "pdf",
    classification: "checklist",
    status: "processing",
    metadata: {
      title: "Apache AH-64E Flight Checklist",
      author: "Boeing / Army Aviation",
      createdDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      pageCount: 42,
      wordCount: 8500,
      language: "en",
    },
    sections: [],
    rawContent: "Checklist content...",
    processedContent: "",
    uploadedBy: "Wg Cdr Kapoor",
    uploadedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    tags: ["apache", "checklist", "ah-64e"],
    relatedDocuments: [],
    courseAssociations: ["Apache Conversion"],
    helicopterPlatforms: ["Apache AH-64E"],
  },
];

// Mock ingestion jobs
export const mockIngestionJobs: IngestionJob[] = [
  {
    id: "job-av-001",
    documentId: "doc-av-005",
    filename: "Apache_AH64E_Checklist.pdf",
    status: "processing",
    progress: 45,
    startedAt: Date.now() - 8 * 60 * 1000,
    currentStep: "Entity Extraction",
    steps: [
      { name: "Upload", status: "completed", startedAt: Date.now() - 8 * 60 * 1000, completedAt: Date.now() - 7 * 60 * 1000 },
      { name: "Text Extraction", status: "completed", startedAt: Date.now() - 7 * 60 * 1000, completedAt: Date.now() - 5 * 60 * 1000 },
      { name: "Section Detection", status: "completed", startedAt: Date.now() - 5 * 60 * 1000, completedAt: Date.now() - 3 * 60 * 1000 },
      { name: "Entity Extraction", status: "running", startedAt: Date.now() - 3 * 60 * 1000 },
      { name: "Classification", status: "pending" },
      { name: "Keyword Extraction", status: "pending" },
      { name: "Quality Check", status: "pending" },
    ],
  },
];

// Get status color
export function getIngestionStatusColor(status: IngestionStatus): string {
  const colors: Record<IngestionStatus, string> = {
    pending: "bg-gray-500",
    processing: "bg-emerald-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
    review_required: "bg-yellow-500",
  };
  return colors[status];
}

// Get classification color
export function getClassificationColor(classification: ContentClassification): string {
  const colors: Record<ContentClassification, string> = {
    flight_manual: "bg-emerald-500",
    sop: "bg-emerald-500",
    doctrine: "bg-emerald-500",
    technical: "bg-emerald-500",
    training: "bg-green-500",
    checklist: "bg-emerald-500",
    weapons_employment: "bg-red-500",
    emergency_procedures: "bg-yellow-500",
  };
  return colors[classification];
}
