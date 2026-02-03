// Document Ingestion Pipeline
// SOW Section 8.1: Content ingestion from doctrinal manuals, SOPs, firing tables

export type DocumentType = "pdf" | "docx" | "txt" | "html" | "markdown";
export type IngestionStatus = "pending" | "processing" | "completed" | "failed" | "review_required";
export type ContentClassification = "doctrine" | "sop" | "technical" | "training" | "reference" | "firing_table";

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
  type: "weapon_system" | "procedure" | "specification" | "location" | "unit" | "personnel" | "ammunition";
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
  weaponSystems: string[];
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
      title: "Procedures",
      content: "The following procedures...",
      headingLevel: 1,
      keywords: ["procedures", "steps"],
      entities: [
        { type: "procedure", value: "Loading Sequence", context: "Gun drill", confidence: 0.95 },
      ],
    },
    {
      id: "sec-3",
      title: "Safety Guidelines",
      content: "Safety measures include...",
      headingLevel: 1,
      keywords: ["safety", "guidelines"],
      entities: [
        { type: "procedure", value: "Safety Check", context: "Pre-fire", confidence: 0.92 },
      ],
    },
  ];

  return mockSections;
}

// Extract entities from content
export function extractEntities(content: string): ExtractedEntity[] {
  // Mock entity extraction - in production would use NER models
  const entities: ExtractedEntity[] = [];

  const weaponPatterns = [
    { pattern: /155\s*mm\s*(howitzer|gun)/gi, type: "weapon_system" as const },
    { pattern: /dhanush/gi, type: "weapon_system" as const },
    { pattern: /k9\s*vajra/gi, type: "weapon_system" as const },
    { pattern: /bofors/gi, type: "weapon_system" as const },
    { pattern: /atags/gi, type: "weapon_system" as const },
    { pattern: /pinaka/gi, type: "weapon_system" as const },
  ];

  const procedurePatterns = [
    { pattern: /misfire\s*(drill|procedure)/gi, type: "procedure" as const },
    { pattern: /loading\s*sequence/gi, type: "procedure" as const },
    { pattern: /safety\s*check/gi, type: "procedure" as const },
    { pattern: /fire\s*mission/gi, type: "procedure" as const },
  ];

  const ammunitionPatterns = [
    { pattern: /HE\s*(round|shell)/gi, type: "ammunition" as const },
    { pattern: /illumination\s*round/gi, type: "ammunition" as const },
    { pattern: /smoke\s*(round|shell)/gi, type: "ammunition" as const },
  ];

  [...weaponPatterns, ...procedurePatterns, ...ammunitionPatterns].forEach(({ pattern, type }) => {
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

// Auto-classify document
export function classifyDocument(content: string, filename: string): ContentClassification {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.includes("sop") || lowerContent.includes("standard operating procedure")) {
    return "sop";
  }
  if (lowerFilename.includes("firing") || lowerContent.includes("firing table")) {
    return "firing_table";
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

  return "reference";
}

// Extract keywords from content
export function extractKeywords(content: string): string[] {
  // Mock keyword extraction - in production would use TF-IDF or KeyBERT
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

// Mock ingested documents
export const mockIngestedDocuments: IngestedDocument[] = [
  {
    id: "doc-ing-001",
    filename: "155mm_Howitzer_Gun_Drill_Manual.pdf",
    documentType: "pdf",
    classification: "doctrine",
    status: "completed",
    metadata: {
      title: "155mm Howitzer Gun Drill Manual",
      author: "School of Artillery",
      createdDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
      pageCount: 48,
      wordCount: 12500,
      language: "en",
    },
    sections: [
      {
        id: "sec-001-1",
        title: "Introduction to 155mm Systems",
        content: "The 155mm howitzer is the backbone of modern artillery...",
        pageNumbers: [1, 2, 3],
        headingLevel: 1,
        keywords: ["howitzer", "artillery", "155mm"],
        entities: [
          { type: "weapon_system", value: "155mm Howitzer", context: "Primary artillery system", confidence: 0.98 },
        ],
      },
      {
        id: "sec-001-2",
        title: "Loading Procedures",
        content: "Step-by-step loading sequence for the 155mm system...",
        pageNumbers: [8, 9, 10, 11],
        headingLevel: 1,
        keywords: ["loading", "procedure", "sequence"],
        entities: [
          { type: "procedure", value: "Loading Sequence", context: "Gun drill operation", confidence: 0.95 },
        ],
      },
    ],
    rawContent: "Full document content...",
    processedContent: "Processed and cleaned content...",
    uploadedBy: "Maj. Sharma",
    uploadedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 29 * 24 * 60 * 60 * 1000,
    processingDuration: 45000,
    tags: ["155mm", "howitzer", "gun drill", "dhanush"],
    relatedDocuments: ["doc-ing-002"],
    courseAssociations: ["YO Gunnery", "JCO Cadre"],
    weaponSystems: ["Dhanush", "Bofors"],
    approvedBy: "Lt. Col. Verma",
    approvedAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
  },
  {
    id: "doc-ing-002",
    filename: "Emergency_Procedures_SOP_v2.docx",
    documentType: "docx",
    classification: "sop",
    status: "completed",
    metadata: {
      title: "Emergency Procedures Standard Operating Procedures",
      author: "Training Command",
      createdDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
      pageCount: 24,
      wordCount: 6800,
      language: "en",
    },
    sections: [
      {
        id: "sec-002-1",
        title: "Misfire Procedures",
        content: "In case of misfire, follow these immediate actions...",
        pageNumbers: [5, 6, 7],
        headingLevel: 1,
        keywords: ["misfire", "emergency", "procedure"],
        entities: [
          { type: "procedure", value: "Misfire Drill", context: "Emergency response", confidence: 0.97 },
        ],
      },
    ],
    rawContent: "Full SOP content...",
    processedContent: "Processed SOP content...",
    uploadedBy: "Capt. Kumar",
    uploadedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    processingDuration: 32000,
    tags: ["emergency", "misfire", "safety", "sop"],
    relatedDocuments: ["doc-ing-001"],
    courseAssociations: ["YO Gunnery", "LGSC", "JCO Cadre"],
    weaponSystems: ["All Systems"],
    approvedBy: "Col. Reddy",
    approvedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: "doc-ing-003",
    filename: "K9_Vajra_Technical_Manual.pdf",
    documentType: "pdf",
    classification: "technical",
    status: "review_required",
    metadata: {
      title: "K9 Vajra Self-Propelled Howitzer Technical Manual",
      author: "Ordnance Directorate",
      createdDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
      pageCount: 156,
      wordCount: 45000,
      language: "en",
    },
    sections: [],
    rawContent: "Technical specifications and maintenance procedures...",
    processedContent: "Processed technical content...",
    uploadedBy: "Maj. Patel",
    uploadedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    processedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    processingDuration: 120000,
    warnings: ["Some technical specifications may need manual verification"],
    tags: ["k9 vajra", "technical", "maintenance", "self-propelled"],
    relatedDocuments: [],
    courseAssociations: ["YO Gunnery", "LGSC"],
    weaponSystems: ["K9 Vajra"],
  },
  {
    id: "doc-ing-004",
    filename: "Firing_Tables_155mm_Charge_7.xlsx",
    documentType: "pdf", // Converted
    classification: "firing_table",
    status: "processing",
    metadata: {
      title: "Firing Tables - 155mm Charge 7",
      author: "Ballistics Division",
      createdDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
      pageCount: 32,
      wordCount: 2500,
      language: "en",
    },
    sections: [],
    rawContent: "Firing table data...",
    processedContent: "",
    uploadedBy: "Lt. Col. Singh",
    uploadedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    tags: ["firing table", "ballistics", "charge 7"],
    relatedDocuments: [],
    courseAssociations: ["LGSC"],
    weaponSystems: ["Dhanush", "Bofors"],
  },
];

// Mock ingestion jobs
export const mockIngestionJobs: IngestionJob[] = [
  {
    id: "job-001",
    documentId: "doc-ing-004",
    filename: "Firing_Tables_155mm_Charge_7.xlsx",
    status: "processing",
    progress: 65,
    startedAt: Date.now() - 5 * 60 * 1000,
    currentStep: "Entity Extraction",
    steps: [
      { name: "Upload", status: "completed", startedAt: Date.now() - 5 * 60 * 1000, completedAt: Date.now() - 4.5 * 60 * 1000 },
      { name: "Text Extraction", status: "completed", startedAt: Date.now() - 4.5 * 60 * 1000, completedAt: Date.now() - 3 * 60 * 1000 },
      { name: "Section Detection", status: "completed", startedAt: Date.now() - 3 * 60 * 1000, completedAt: Date.now() - 2 * 60 * 1000 },
      { name: "Entity Extraction", status: "running", startedAt: Date.now() - 2 * 60 * 1000 },
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
    processing: "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
    review_required: "bg-yellow-500",
  };
  return colors[status];
}

// Get classification color
export function getClassificationColor(classification: ContentClassification): string {
  const colors: Record<ContentClassification, string> = {
    doctrine: "bg-purple-500",
    sop: "bg-blue-500",
    technical: "bg-orange-500",
    training: "bg-green-500",
    reference: "bg-gray-500",
    firing_table: "bg-red-500",
  };
  return colors[classification];
}
