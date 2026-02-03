// Document Ingestion Pipeline - SOW Section 8.1
// Ingest doctrinal content from gunnery manuals, course notes, firing tables, SOPs

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  pageNumber?: number;
  sectionTitle?: string;
  chunkIndex: number;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  category: DocumentCategory;
  weaponSystems?: string[];
  courseTypes?: string[];
  topics?: string[];
  securityLevel?: "unclassified" | "restricted" | "confidential";
  source?: string;
  version?: string;
  effectiveDate?: Date;
}

export type DocumentCategory =
  | "doctrine"
  | "sop"
  | "technical-manual"
  | "firing-table"
  | "course-notes"
  | "reference";

export interface ProcessedDocument {
  id: string;
  name: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  pageCount: number;
  chunks: DocumentChunk[];
  metadata: DocumentMetadata;
  processedAt: Date;
  status: "processing" | "completed" | "failed";
  error?: string;
}

export interface IngestionResult {
  success: boolean;
  documentId?: string;
  chunkCount?: number;
  error?: string;
}

// Document processor class
export class DocumentProcessor {
  private static readonly CHUNK_SIZE = 1000; // Characters per chunk
  private static readonly CHUNK_OVERLAP = 200; // Overlap between chunks

  // Process a document file
  async processDocument(
    file: File,
    metadata: Partial<DocumentMetadata> = {}
  ): Promise<ProcessedDocument> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const processedDoc: ProcessedDocument = {
      id,
      name: this.sanitizeFileName(file.name),
      originalFileName: file.name,
      fileType: file.type || this.getFileType(file.name),
      fileSize: file.size,
      pageCount: 0,
      chunks: [],
      metadata: {
        category: metadata.category || "reference",
        weaponSystems: metadata.weaponSystems || [],
        courseTypes: metadata.courseTypes || [],
        topics: metadata.topics || [],
        securityLevel: metadata.securityLevel || "unclassified",
        ...metadata,
      },
      processedAt: new Date(),
      status: "processing",
    };

    try {
      const text = await this.extractText(file);
      const chunks = this.chunkText(text, id, processedDoc.name, processedDoc.metadata);

      processedDoc.chunks = chunks;
      processedDoc.pageCount = this.estimatePageCount(text);
      processedDoc.status = "completed";

      return processedDoc;
    } catch (error) {
      processedDoc.status = "failed";
      processedDoc.error = error instanceof Error ? error.message : "Processing failed";
      return processedDoc;
    }
  }

  // Process text content directly
  processText(
    content: string,
    documentName: string,
    metadata: Partial<DocumentMetadata> = {}
  ): ProcessedDocument {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullMetadata: DocumentMetadata = {
      category: metadata.category || "reference",
      weaponSystems: metadata.weaponSystems || [],
      courseTypes: metadata.courseTypes || [],
      topics: metadata.topics || [],
      securityLevel: metadata.securityLevel || "unclassified",
      ...metadata,
    };

    const chunks = this.chunkText(content, id, documentName, fullMetadata);

    return {
      id,
      name: documentName,
      originalFileName: documentName,
      fileType: "text/plain",
      fileSize: content.length,
      pageCount: this.estimatePageCount(content),
      chunks,
      metadata: fullMetadata,
      processedAt: new Date(),
      status: "completed",
    };
  }

  // Extract text from file
  private async extractText(file: File): Promise<string> {
    const fileType = file.type || this.getFileType(file.name);

    if (fileType === "text/plain" || file.name.endsWith(".txt")) {
      return await file.text();
    }

    if (fileType === "application/json" || file.name.endsWith(".json")) {
      const content = await file.text();
      try {
        const json = JSON.parse(content);
        return typeof json === "string" ? json : JSON.stringify(json, null, 2);
      } catch {
        return content;
      }
    }

    if (fileType.includes("markdown") || file.name.endsWith(".md")) {
      return await file.text();
    }

    // For other file types (PDF, DOCX), we'll need backend processing
    // For now, return a placeholder indicating server-side processing is needed
    // In production, this would call an API endpoint
    throw new Error(
      `File type "${fileType}" requires server-side processing. ` +
      "Please use the document upload API endpoint."
    );
  }

  // Split text into overlapping chunks for better context
  private chunkText(
    text: string,
    documentId: string,
    documentName: string,
    metadata: DocumentMetadata
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const cleanText = this.cleanText(text);

    // Split by paragraphs first
    const paragraphs = cleanText.split(/\n\s*\n/);
    let currentChunk = "";
    let chunkIndex = 0;
    let currentSection = "";

    for (const paragraph of paragraphs) {
      // Check if this is a section header
      if (this.isSectionHeader(paragraph)) {
        // Save current chunk if it has content
        if (currentChunk.trim()) {
          chunks.push(this.createChunk(
            currentChunk,
            documentId,
            documentName,
            chunkIndex++,
            currentSection,
            metadata
          ));
        }
        currentSection = paragraph.trim();
        currentChunk = paragraph + "\n\n";
        continue;
      }

      // Check if adding this paragraph would exceed chunk size
      if ((currentChunk + paragraph).length > DocumentProcessor.CHUNK_SIZE) {
        if (currentChunk.trim()) {
          chunks.push(this.createChunk(
            currentChunk,
            documentId,
            documentName,
            chunkIndex++,
            currentSection,
            metadata
          ));
        }

        // Start new chunk with overlap
        const overlapStart = Math.max(0, currentChunk.length - DocumentProcessor.CHUNK_OVERLAP);
        currentChunk = currentChunk.slice(overlapStart) + paragraph + "\n\n";
      } else {
        currentChunk += paragraph + "\n\n";
      }
    }

    // Don't forget the last chunk
    if (currentChunk.trim()) {
      chunks.push(this.createChunk(
        currentChunk,
        documentId,
        documentName,
        chunkIndex++,
        currentSection,
        metadata
      ));
    }

    return chunks;
  }

  private createChunk(
    content: string,
    documentId: string,
    documentName: string,
    chunkIndex: number,
    sectionTitle: string,
    metadata: DocumentMetadata
  ): DocumentChunk {
    return {
      id: `${documentId}_chunk_${chunkIndex}`,
      documentId,
      documentName,
      content: content.trim(),
      sectionTitle: sectionTitle || undefined,
      chunkIndex,
      metadata,
    };
  }

  // Check if a line is a section header
  private isSectionHeader(text: string): boolean {
    const trimmed = text.trim();

    // Check for markdown headers
    if (/^#{1,6}\s+/.test(trimmed)) return true;

    // Check for numbered sections (e.g., "1.2 Safety Procedures")
    if (/^\d+(\.\d+)*\s+[A-Z]/.test(trimmed)) return true;

    // Check for all-caps lines under 100 chars (likely headers)
    if (trimmed === trimmed.toUpperCase() && trimmed.length < 100 && trimmed.length > 3) {
      return true;
    }

    // Check for common header patterns
    const headerPatterns = [
      /^chapter\s+\d+/i,
      /^section\s+\d+/i,
      /^appendix\s+[a-z]/i,
      /^part\s+\d+/i,
    ];

    return headerPatterns.some((pattern) => pattern.test(trimmed));
  }

  // Clean text content
  private cleanText(text: string): string {
    return text
      // Normalize whitespace
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, "  ")
      // Remove excessive newlines
      .replace(/\n{4,}/g, "\n\n\n")
      // Remove null characters and other control characters (except newlines/tabs)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();
  }

  // Estimate page count based on text length
  private estimatePageCount(text: string): number {
    // Assume ~3000 characters per page (roughly 500 words)
    return Math.max(1, Math.ceil(text.length / 3000));
  }

  // Get file type from extension
  private getFileType(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      txt: "text/plain",
      md: "text/markdown",
      json: "application/json",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  }

  // Sanitize file name
  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/\.[^.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }
}

// Document store for managing processed documents
export interface DocumentStore {
  documents: ProcessedDocument[];
  chunks: DocumentChunk[];
}

// In-memory document store (in production, use database)
class InMemoryDocumentStore implements DocumentStore {
  documents: ProcessedDocument[] = [];
  chunks: DocumentChunk[] = [];

  addDocument(doc: ProcessedDocument): void {
    this.documents.push(doc);
    this.chunks.push(...doc.chunks);
  }

  removeDocument(documentId: string): void {
    this.documents = this.documents.filter((d) => d.id !== documentId);
    this.chunks = this.chunks.filter((c) => c.documentId !== documentId);
  }

  getDocument(documentId: string): ProcessedDocument | undefined {
    return this.documents.find((d) => d.id === documentId);
  }

  searchChunks(query: string, limit: number = 10): DocumentChunk[] {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter((t) => t.length > 2);

    // Simple relevance scoring
    const scored = this.chunks.map((chunk) => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;

      // Exact phrase match
      if (contentLower.includes(queryLower)) {
        score += 10;
      }

      // Term matches
      for (const term of queryTerms) {
        const matches = (contentLower.match(new RegExp(term, "g")) || []).length;
        score += matches * 2;
      }

      // Boost for section title match
      if (chunk.sectionTitle?.toLowerCase().includes(queryLower)) {
        score += 5;
      }

      return { chunk, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.chunk);
  }

  getChunksByCategory(category: DocumentCategory): DocumentChunk[] {
    return this.chunks.filter((c) => c.metadata.category === category);
  }

  getChunksByWeaponSystem(weaponSystem: string): DocumentChunk[] {
    return this.chunks.filter((c) =>
      c.metadata.weaponSystems?.some((ws) =>
        ws.toLowerCase().includes(weaponSystem.toLowerCase())
      )
    );
  }
}

// Export singleton instances
export const documentProcessor = new DocumentProcessor();
export const documentStore = new InMemoryDocumentStore();

// Helper to ingest document
export async function ingestDocument(
  file: File,
  metadata: Partial<DocumentMetadata> = {}
): Promise<IngestionResult> {
  try {
    const processed = await documentProcessor.processDocument(file, metadata);

    if (processed.status === "failed") {
      return {
        success: false,
        error: processed.error,
      };
    }

    documentStore.addDocument(processed);

    return {
      success: true,
      documentId: processed.id,
      chunkCount: processed.chunks.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ingestion failed",
    };
  }
}

// Helper to ingest text content
export function ingestText(
  content: string,
  documentName: string,
  metadata: Partial<DocumentMetadata> = {}
): IngestionResult {
  try {
    const processed = documentProcessor.processText(content, documentName, metadata);
    documentStore.addDocument(processed);

    return {
      success: true,
      documentId: processed.id,
      chunkCount: processed.chunks.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ingestion failed",
    };
  }
}
