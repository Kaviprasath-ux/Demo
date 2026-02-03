// Document Ingestion API - SOW Section 8.1: Content Ingestion Pipeline
import { NextRequest, NextResponse } from "next/server";
import {
  ingestText,
  documentStore,
  DocumentMetadata,
  DocumentCategory,
} from "@/lib/ai/document-processor";

// POST - Ingest text content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      content,
      documentName,
      category = "reference",
      weaponSystems = [],
      courseTypes = [],
      topics = [],
    } = body;

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { error: "Content is required (minimum 50 characters)" },
        { status: 400 }
      );
    }

    if (!documentName) {
      return NextResponse.json(
        { error: "Document name is required" },
        { status: 400 }
      );
    }

    const validCategories: DocumentCategory[] = [
      "doctrine",
      "sop",
      "technical-manual",
      "firing-table",
      "course-notes",
      "reference",
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Use one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    const metadata: Partial<DocumentMetadata> = {
      category,
      weaponSystems,
      courseTypes,
      topics,
    };

    const result = ingestText(content, documentName, metadata);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      chunkCount: result.chunkCount,
      message: `Document "${documentName}" ingested successfully with ${result.chunkCount} chunks`,
    });
  } catch (error) {
    console.error("Document ingestion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ingestion failed",
      },
      { status: 500 }
    );
  }
}

// GET - List ingested documents or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const weaponSystem = searchParams.get("weaponSystem");

    // Search mode
    if (query) {
      const chunks = documentStore.searchChunks(query, 10);
      return NextResponse.json({
        success: true,
        query,
        results: chunks.map((chunk) => ({
          chunkId: chunk.id,
          documentId: chunk.documentId,
          documentName: chunk.documentName,
          sectionTitle: chunk.sectionTitle,
          content: chunk.content.slice(0, 500) + (chunk.content.length > 500 ? "..." : ""),
          metadata: chunk.metadata,
        })),
        totalResults: chunks.length,
      });
    }

    // Filter by category
    if (category) {
      const chunks = documentStore.getChunksByCategory(category as DocumentCategory);
      return NextResponse.json({
        success: true,
        filter: { category },
        documents: [...new Set(chunks.map((c) => c.documentId))].map((docId) => ({
          documentId: docId,
          documentName: chunks.find((c) => c.documentId === docId)?.documentName,
          chunkCount: chunks.filter((c) => c.documentId === docId).length,
        })),
      });
    }

    // Filter by weapon system
    if (weaponSystem) {
      const chunks = documentStore.getChunksByWeaponSystem(weaponSystem);
      return NextResponse.json({
        success: true,
        filter: { weaponSystem },
        results: chunks.slice(0, 20).map((chunk) => ({
          chunkId: chunk.id,
          documentName: chunk.documentName,
          sectionTitle: chunk.sectionTitle,
          preview: chunk.content.slice(0, 300),
        })),
        totalResults: chunks.length,
      });
    }

    // List all documents
    return NextResponse.json({
      success: true,
      documents: documentStore.documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        category: doc.metadata.category,
        chunkCount: doc.chunks.length,
        pageCount: doc.pageCount,
        processedAt: doc.processedAt,
        status: doc.status,
      })),
      totalDocuments: documentStore.documents.length,
      totalChunks: documentStore.chunks.length,
    });
  } catch (error) {
    console.error("Document query failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Query failed",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId query parameter is required" },
        { status: 400 }
      );
    }

    const doc = documentStore.getDocument(documentId);
    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    documentStore.removeDocument(documentId);

    return NextResponse.json({
      success: true,
      message: `Document "${doc.name}" removed`,
    });
  } catch (error) {
    console.error("Document deletion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Deletion failed",
      },
      { status: 500 }
    );
  }
}
