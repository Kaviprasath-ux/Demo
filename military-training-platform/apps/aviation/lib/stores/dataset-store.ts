import { create } from "zustand";
import { persist } from "zustand/middleware";

// Dataset Types
export interface DatasetDocument {
  id: string;
  title: string;
  type: "pdf" | "docx" | "txt" | "markdown" | "json";
  size: number;
  path: string;
  addedAt: Date;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: "structured" | "unstructured" | "mixed";
  category: "doctrine" | "sop" | "technical" | "training" | "assessment" | "general";
  metadata: {
    helicopterTypes?: string[];
    missionTypes?: string[];
    topics?: string[];
    classification?: "restricted" | "confidential" | "secret";
    version?: string;
    author?: string;
  };
  documents: DatasetDocument[];
  tags: string[];
  stats: {
    documentCount: number;
    totalSize: number;
    chunkCount: number;
    lastUpdated: Date;
  };
  status: "draft" | "processing" | "ready" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface DatasetExport {
  id: string;
  datasetId: string;
  format: "json" | "csv" | "parquet" | "jsonl";
  status: "pending" | "processing" | "completed" | "failed";
  filePath?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface DatasetState {
  datasets: Dataset[];
  exports: DatasetExport[];

  // Dataset CRUD
  createDataset: (dataset: Omit<Dataset, "id" | "createdAt" | "updatedAt" | "stats">) => string;
  updateDataset: (id: string, updates: Partial<Dataset>) => void;
  deleteDataset: (id: string) => void;
  archiveDataset: (id: string) => void;

  // Document Management
  addDocumentToDataset: (datasetId: string, document: Omit<DatasetDocument, "id" | "addedAt">) => void;
  removeDocumentFromDataset: (datasetId: string, documentId: string) => void;

  // Query
  getDatasetById: (id: string) => Dataset | undefined;
  getDatasetsByCategory: (category: Dataset["category"]) => Dataset[];
  getReadyDatasets: () => Dataset[];
  searchDatasets: (query: string) => Dataset[];

  // Export
  requestExport: (datasetId: string, format: DatasetExport["format"]) => string;
  getExportStatus: (exportId: string) => DatasetExport | undefined;
}

// Mock Datasets
const mockDatasets: Dataset[] = [
  {
    id: "ds-1",
    name: "CAS Doctrine & Procedures",
    description: "Complete doctrine and SOP collection for Close Air Support operations",
    type: "unstructured",
    category: "doctrine",
    metadata: {
      helicopterTypes: ["Rudra", "LCH Prachand", "Apache"],
      missionTypes: ["CAS", "Fire Support"],
      topics: ["Terminal Control", "9-Line Brief", "Fire Adjustment"],
      classification: "confidential",
      version: "2.1",
    },
    documents: [
      { id: "doc-1", title: "CAS Procedures Manual", type: "pdf", size: 2456789, path: "/docs/cas_manual.pdf", addedAt: new Date("2024-01-10") },
      { id: "doc-2", title: "Fire Adjustment SOP", type: "pdf", size: 1234567, path: "/docs/fire_adj_sop.pdf", addedAt: new Date("2024-01-11") },
      { id: "doc-3", title: "9-Line Brief Format", type: "docx", size: 345678, path: "/docs/9line_format.docx", addedAt: new Date("2024-01-12") },
    ],
    tags: ["CAS", "Doctrine", "Fire Support", "Joint Operations"],
    stats: {
      documentCount: 3,
      totalSize: 4037034,
      chunkCount: 145,
      lastUpdated: new Date("2024-01-12"),
    },
    status: "ready",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "ds-2",
    name: "Helicopter Technical Specifications",
    description: "Technical manuals and specifications for all helicopter platforms",
    type: "structured",
    category: "technical",
    metadata: {
      helicopterTypes: ["ALH Dhruv", "Rudra", "LCH Prachand", "Apache", "Chetak", "Cheetah"],
      topics: ["Specifications", "Performance", "Weapons", "Avionics"],
      classification: "restricted",
      version: "1.5",
    },
    documents: [
      { id: "doc-4", title: "ALH Dhruv Specs", type: "json", size: 125678, path: "/docs/dhruv_specs.json", addedAt: new Date("2024-01-08") },
      { id: "doc-5", title: "Rudra Weapons Config", type: "json", size: 98765, path: "/docs/rudra_weapons.json", addedAt: new Date("2024-01-08") },
      { id: "doc-6", title: "Apache Performance Data", type: "json", size: 156789, path: "/docs/apache_perf.json", addedAt: new Date("2024-01-09") },
    ],
    tags: ["Technical", "Specifications", "Helicopters"],
    stats: {
      documentCount: 3,
      totalSize: 381232,
      chunkCount: 89,
      lastUpdated: new Date("2024-01-09"),
    },
    status: "ready",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-09"),
  },
  {
    id: "ds-3",
    name: "Air-Ground Coordination Training",
    description: "Training materials for air-ground coordination exercises",
    type: "mixed",
    category: "training",
    metadata: {
      missionTypes: ["Joint Ops", "Fire Support", "Reconnaissance"],
      topics: ["Coordination", "Communication", "Safety"],
      classification: "restricted",
      version: "1.0",
    },
    documents: [
      { id: "doc-7", title: "Joint Ops Training Guide", type: "pdf", size: 3456789, path: "/docs/joint_ops_guide.pdf", addedAt: new Date("2024-01-14") },
      { id: "doc-8", title: "Coordination Scenarios", type: "json", size: 234567, path: "/docs/coord_scenarios.json", addedAt: new Date("2024-01-14") },
    ],
    tags: ["Training", "Coordination", "Joint Operations"],
    stats: {
      documentCount: 2,
      totalSize: 3691356,
      chunkCount: 112,
      lastUpdated: new Date("2024-01-14"),
    },
    status: "ready",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "ds-4",
    name: "Assessment Question Bank",
    description: "Question bank for pilot assessments and evaluations",
    type: "structured",
    category: "assessment",
    metadata: {
      helicopterTypes: ["ALH Dhruv", "Rudra", "Chetak"],
      topics: ["Procedures", "Safety", "Systems", "Emergency"],
      classification: "confidential",
      version: "3.0",
    },
    documents: [],
    tags: ["Assessment", "Questions", "Evaluation"],
    stats: {
      documentCount: 0,
      totalSize: 0,
      chunkCount: 0,
      lastUpdated: new Date("2024-01-16"),
    },
    status: "draft",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
];

const mockExports: DatasetExport[] = [
  {
    id: "exp-1",
    datasetId: "ds-1",
    format: "jsonl",
    status: "completed",
    filePath: "/exports/cas_doctrine_export.jsonl",
    createdAt: new Date("2024-01-13"),
    completedAt: new Date("2024-01-13"),
  },
];

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      datasets: mockDatasets,
      exports: mockExports,

      createDataset: (dataset) => {
        const id = `ds-${Date.now()}`;
        set((state) => ({
          datasets: [
            ...state.datasets,
            {
              ...dataset,
              id,
              stats: {
                documentCount: dataset.documents.length,
                totalSize: dataset.documents.reduce((sum, d) => sum + d.size, 0),
                chunkCount: 0,
                lastUpdated: new Date(),
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
        return id;
      },

      updateDataset: (id, updates) =>
        set((state) => ({
          datasets: state.datasets.map((ds) =>
            ds.id === id ? { ...ds, ...updates, updatedAt: new Date() } : ds
          ),
        })),

      deleteDataset: (id) =>
        set((state) => ({
          datasets: state.datasets.filter((ds) => ds.id !== id),
        })),

      archiveDataset: (id) =>
        set((state) => ({
          datasets: state.datasets.map((ds) =>
            ds.id === id ? { ...ds, status: "archived", updatedAt: new Date() } : ds
          ),
        })),

      addDocumentToDataset: (datasetId, document) =>
        set((state) => ({
          datasets: state.datasets.map((ds) => {
            if (ds.id !== datasetId) return ds;
            const newDoc = { ...document, id: `doc-${Date.now()}`, addedAt: new Date() };
            const newDocuments = [...ds.documents, newDoc];
            return {
              ...ds,
              documents: newDocuments,
              stats: {
                ...ds.stats,
                documentCount: newDocuments.length,
                totalSize: newDocuments.reduce((sum, d) => sum + d.size, 0),
                lastUpdated: new Date(),
              },
              updatedAt: new Date(),
            };
          }),
        })),

      removeDocumentFromDataset: (datasetId, documentId) =>
        set((state) => ({
          datasets: state.datasets.map((ds) => {
            if (ds.id !== datasetId) return ds;
            const newDocuments = ds.documents.filter((d) => d.id !== documentId);
            return {
              ...ds,
              documents: newDocuments,
              stats: {
                ...ds.stats,
                documentCount: newDocuments.length,
                totalSize: newDocuments.reduce((sum, d) => sum + d.size, 0),
                lastUpdated: new Date(),
              },
              updatedAt: new Date(),
            };
          }),
        })),

      getDatasetById: (id) => get().datasets.find((ds) => ds.id === id),

      getDatasetsByCategory: (category) =>
        get().datasets.filter((ds) => ds.category === category),

      getReadyDatasets: () =>
        get().datasets.filter((ds) => ds.status === "ready"),

      searchDatasets: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().datasets.filter(
          (ds) =>
            ds.name.toLowerCase().includes(lowerQuery) ||
            ds.description.toLowerCase().includes(lowerQuery) ||
            ds.tags.some((t) => t.toLowerCase().includes(lowerQuery))
        );
      },

      requestExport: (datasetId, format) => {
        const id = `exp-${Date.now()}`;
        set((state) => ({
          exports: [
            ...state.exports,
            {
              id,
              datasetId,
              format,
              status: "pending",
              createdAt: new Date(),
            },
          ],
        }));

        // Simulate processing
        setTimeout(() => {
          set((state) => ({
            exports: state.exports.map((exp) =>
              exp.id === id ? { ...exp, status: "processing" } : exp
            ),
          }));
        }, 500);

        setTimeout(() => {
          set((state) => ({
            exports: state.exports.map((exp) =>
              exp.id === id
                ? {
                    ...exp,
                    status: "completed",
                    filePath: `/exports/${datasetId}_export.${format}`,
                    completedAt: new Date(),
                  }
                : exp
            ),
          }));
        }, 2000);

        return id;
      },

      getExportStatus: (exportId) => get().exports.find((exp) => exp.id === exportId),
    }),
    {
      name: "aviation-dataset-store",
    }
  )
);
