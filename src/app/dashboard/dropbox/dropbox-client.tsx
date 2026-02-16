"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File as FileIcon,
  Search,
  Filter,
  Brain,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Trash2,
  Tag,
  User,
  ChevronDown,
  ChevronRight,
  X,
  Download,
  RefreshCw,
  HardDrive,
  Sparkles,
  Eye,
  Archive,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import type { Document, DocumentCategory } from "@/types/database";

/* ================================================================== */
/*  Constants & Config                                                 */
/* ================================================================== */

const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  eob: {
    label: "EOB",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border border-blue-200",
  },
  insurance_card: {
    label: "Insurance Card",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border border-violet-200",
  },
  referral: {
    label: "Referral",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50 border border-cyan-200",
  },
  lab_result: {
    label: "Lab Result",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border border-emerald-200",
  },
  xray: {
    label: "X-Ray",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border border-amber-200",
  },
  consent_form: {
    label: "Consent Form",
    color: "text-pink-700",
    bgColor: "bg-pink-50 border border-pink-200",
  },
  invoice: {
    label: "Invoice",
    color: "text-green-700",
    bgColor: "bg-green-50 border border-green-200",
  },
  receipt: {
    label: "Receipt",
    color: "text-lime-700",
    bgColor: "bg-lime-50 border border-lime-200",
  },
  correspondence: {
    label: "Correspondence",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border border-indigo-200",
  },
  clinical_note: {
    label: "Clinical Note",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border border-teal-200",
  },
  prescription: {
    label: "Prescription",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border border-orange-200",
  },
  id_document: {
    label: "ID Document",
    color: "text-slate-700",
    bgColor: "bg-slate-50 border border-slate-200",
  },
  other: {
    label: "Other",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border border-gray-200",
  },
  uncategorized: {
    label: "Uncategorized",
    color: "text-slate-500",
    bgColor: "bg-slate-50 border border-slate-200",
  },
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: typeof Clock;
  }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border border-amber-200",
    icon: Clock,
  },
  active: {
    label: "Uploaded",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border border-blue-200",
    icon: Upload,
  },
  processing: {
    label: "Processing",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border border-purple-200",
    icon: Loader2,
  },
  processed: {
    label: "Processed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border border-emerald-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-red-700",
    bgColor: "bg-red-50 border border-red-200",
    icon: AlertTriangle,
  },
  archived: {
    label: "Archived",
    color: "text-slate-500",
    bgColor: "bg-slate-50 border border-slate-200",
    icon: Archive,
  },
};

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType === "application/pdf") return FileText;
  if (fileType.includes("spreadsheet") || fileType.includes("excel"))
    return FileSpreadsheet;
  return FileIcon;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ================================================================== */
/*  Props                                                              */
/* ================================================================== */

interface DropboxClientProps {
  initialDocuments: Document[];
  patients: { id: string; first_name: string; last_name: string }[];
  stats: {
    totalDocs: number;
    pendingProcessing: number;
    processedToday: number;
    storageUsedMB: number;
  };
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export function DropboxClient({
  initialDocuments,
  patients,
  stats,
}: DropboxClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [categoryModal, setCategoryModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    if (
      categoryFilter !== "all" &&
      doc.category !== categoryFilter
    )
      return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        doc.file_name.toLowerCase().includes(q) ||
        (doc.ai_summary && doc.ai_summary.toLowerCase().includes(q)) ||
        (doc.notes && doc.notes.toLowerCase().includes(q)) ||
        (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Refresh documents from API
  const refreshDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch {
      // silently fail on refresh
    }
  }, []);

  // Upload handler
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        formData.append("file", file);
      }

      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
          setUploadError(result.error || "Upload failed");
        } else {
          if (result.documents) {
            setDocuments((prev) => [...result.documents, ...prev]);
          }
          if (result.errors && result.errors.length > 0) {
            setUploadError(
              `Some files failed: ${result.errors.map((e: { fileName: string }) => e.fileName).join(", ")}`
            );
          }
        }
      } catch {
        setUploadError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  // AI Process
  const handleProcess = useCallback(
    async (docId: string) => {
      setProcessingIds((prev) => new Set(prev).add(docId));
      try {
        const res = await fetch(`/api/documents/${docId}/process`, {
          method: "POST",
        });
        if (res.ok) {
          const updated = await res.json();
          setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? updated : d))
          );
        }
      } catch {
        // will show failed status on refresh
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(docId);
          return next;
        });
        await refreshDocuments();
      }
    },
    [refreshDocuments]
  );

  // Archive document
  const handleArchive = useCallback(
    async (docId: string) => {
      try {
        const res = await fetch(`/api/documents/${docId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setDocuments((prev) => prev.filter((d) => d.id !== docId));
          if (expandedDoc === docId) setExpandedDoc(null);
        }
      } catch {
        // silently fail
      }
    },
    [expandedDoc]
  );

  // Assign to patient
  const handleAssignPatient = useCallback(
    async (docId: string, patientId: string | null) => {
      try {
        const res = await fetch(`/api/documents/${docId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patient_id: patientId }),
        });
        if (res.ok) {
          const updated = await res.json();
          setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? updated : d))
          );
        }
      } catch {
        // silently fail
      }
      setAssignModal(null);
    },
    []
  );

  // Change category
  const handleChangeCategory = useCallback(
    async (docId: string, category: DocumentCategory) => {
      try {
        const res = await fetch(`/api/documents/${docId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        });
        if (res.ok) {
          const updated = await res.json();
          setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? updated : d))
          );
        }
      } catch {
        // silently fail
      }
      setCategoryModal(null);
    },
    []
  );

  const getPatientName = (patientId: string | null) => {
    if (!patientId) return null;
    const p = patients.find((pt) => pt.id === patientId);
    return p ? `${p.first_name} ${p.last_name}` : "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI File Drop Box
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload documents for AI-powered categorization and data extraction
          </p>
        </div>
        <button
          onClick={() => refreshDocuments()}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Documents"
          value={stats.totalDocs.toString()}
          icon={FileText}
          iconColor="text-blue-600 bg-blue-50"
          accentColor="#3b82f6"
        />
        <StatCard
          title="Pending Processing"
          value={stats.pendingProcessing.toString()}
          icon={Clock}
          iconColor="text-amber-600 bg-amber-50"
          accentColor="#f59e0b"
          pulse={stats.pendingProcessing > 0}
        />
        <StatCard
          title="Processed Today"
          value={stats.processedToday.toString()}
          icon={Brain}
          iconColor="text-emerald-600 bg-emerald-50"
          accentColor="#10b981"
        />
        <StatCard
          title="Storage Used"
          value={`${stats.storageUsedMB} MB`}
          icon={HardDrive}
          iconColor="text-slate-600 bg-slate-100"
          accentColor="#64748b"
        />
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          dragActive
            ? "border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-100/50"
            : "border-slate-300 bg-white hover:border-cyan-300 hover:bg-slate-50/50",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUpload(e.target.files);
              e.target.value = "";
            }
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
            <p className="text-sm font-medium text-slate-600">
              Uploading files...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              <Upload
                className={cn(
                  "h-7 w-7 transition-colors",
                  dragActive ? "text-cyan-500" : "text-slate-400"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {dragActive
                  ? "Drop files here"
                  : "Drag & drop files here, or click to browse"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PDF, JPG, PNG, DOCX, XLSX -- Max 10MB per file
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              viewMode === "list"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              viewMode === "grid"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500">
        Showing {filteredDocs.length} of {documents.length} documents
      </p>

      {/* Document List / Grid */}
      {filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <FileText className="h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            No documents found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Upload files or adjust your filters
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {filteredDocs.map((doc) => {
            const isExpanded = expandedDoc === doc.id;
            const isProcessing = processingIds.has(doc.id);
            const FileTypeIcon = getFileIcon(doc.file_type);
            const statusCfg =
              STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
            const categoryCfg =
              CATEGORY_CONFIG[doc.category] || CATEGORY_CONFIG.uncategorized;
            const StatusIcon = statusCfg.icon;
            const patientName = getPatientName(doc.patient_id);

            return (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200/80 bg-white transition-all hover:shadow-md hover:border-slate-300/80"
              >
                {/* Main row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() =>
                    setExpandedDoc(isExpanded ? null : doc.id)
                  }
                >
                  {/* File icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                    <FileTypeIcon className="h-5 w-5 text-slate-500" />
                  </div>

                  {/* File info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {doc.file_name}
                      </p>
                      {doc.ai_confidence !== null &&
                        doc.ai_confidence !== undefined && (
                          <span className="shrink-0 flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600 border border-purple-200">
                            <Sparkles className="h-2.5 w-2.5" />
                            {Math.round(doc.ai_confidence * 100)}%
                          </span>
                        )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {patientName && (
                        <span className="flex items-center gap-1 text-cyan-600">
                          <User className="h-3 w-3" />
                          {patientName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category badge */}
                  <span
                    className={cn(
                      "hidden sm:inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      categoryCfg.bgColor,
                      categoryCfg.color
                    )}
                  >
                    {categoryCfg.label}
                  </span>

                  {/* Status badge */}
                  <span
                    className={cn(
                      "hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      statusCfg.bgColor,
                      statusCfg.color
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        "h-3 w-3",
                        isProcessing && "animate-spin"
                      )}
                    />
                    {isProcessing ? "Processing..." : statusCfg.label}
                  </span>

                  {/* Quick actions */}
                  <div className="flex items-center gap-1">
                    {(doc.status === "pending" ||
                      doc.status === "active" ||
                      doc.status === "failed") &&
                      !isProcessing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcess(doc.id);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          title="Process with AI"
                        >
                          <Brain className="h-4 w-4" />
                        </button>
                      )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssignModal(doc.id);
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                      title="Assign to Patient"
                    >
                      <User className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryModal(doc.id);
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Change Category"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(doc.id);
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Archive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Expand chevron */}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* AI Summary */}
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI Analysis
                        </h4>
                        {doc.ai_summary ? (
                          <div className="space-y-3">
                            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 p-4">
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {doc.ai_summary}
                              </p>
                            </div>
                            {doc.ai_confidence !== null &&
                              doc.ai_confidence !== undefined && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">
                                    Confidence:
                                  </span>
                                  <div className="flex-1 max-w-[200px] h-2 rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                      style={{
                                        width: `${Math.round(doc.ai_confidence * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-purple-600">
                                    {Math.round(doc.ai_confidence * 100)}%
                                  </span>
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
                            <Brain className="mx-auto h-8 w-8 text-slate-300" />
                            <p className="mt-2 text-xs text-slate-400">
                              Not yet processed
                            </p>
                            <button
                              onClick={() => handleProcess(doc.id)}
                              disabled={isProcessing}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Brain className="h-3.5 w-3.5" />
                              )}
                              {isProcessing
                                ? "Processing..."
                                : "Process with AI"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Extracted Data */}
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                          <Eye className="h-3.5 w-3.5" />
                          Extracted Data
                        </h4>
                        {doc.ai_extracted_data &&
                        Object.keys(doc.ai_extracted_data).length > 0 ? (
                          <div className="space-y-2">
                            {renderExtractedData(
                              doc.ai_extracted_data as Record<string, unknown>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
                            <FileText className="mx-auto h-8 w-8 text-slate-300" />
                            <p className="mt-2 text-xs text-slate-400">
                              No extracted data yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-3.5 w-3.5 text-slate-400" />
                          {doc.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Document metadata footer */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
                      <span>ID: {doc.id.slice(0, 8)}...</span>
                      {doc.ai_processed_at && (
                        <span>
                          Processed: {formatDate(doc.ai_processed_at)}
                        </span>
                      )}
                      <span>Type: {doc.file_type}</span>
                      {doc.download_url && (
                        <a
                          href={doc.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((doc) => {
            const isProcessing = processingIds.has(doc.id);
            const FileTypeIcon = getFileIcon(doc.file_type);
            const statusCfg =
              STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
            const categoryCfg =
              CATEGORY_CONFIG[doc.category] || CATEGORY_CONFIG.uncategorized;
            const StatusIcon = statusCfg.icon;
            const patientName = getPatientName(doc.patient_id);

            return (
              <div
                key={doc.id}
                className="group rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:shadow-lg hover:border-slate-300/80 hover:-translate-y-0.5 cursor-pointer"
                onClick={() =>
                  setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                }
              >
                {/* File icon + type */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <FileTypeIcon className="h-6 w-6 text-slate-500" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      statusCfg.bgColor,
                      statusCfg.color
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        "h-2.5 w-2.5",
                        isProcessing && "animate-spin"
                      )}
                    />
                    {isProcessing ? "..." : statusCfg.label}
                  </span>
                </div>

                {/* File name */}
                <p className="truncate text-sm font-semibold text-slate-800">
                  {doc.file_name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatFileSize(doc.file_size)}
                </p>

                {/* Category */}
                <div className="mt-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      categoryCfg.bgColor,
                      categoryCfg.color
                    )}
                  >
                    {categoryCfg.label}
                  </span>
                </div>

                {/* Patient */}
                {patientName && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-cyan-600">
                    <User className="h-3 w-3" />
                    {patientName}
                  </p>
                )}

                {/* AI confidence */}
                {doc.ai_confidence !== null &&
                  doc.ai_confidence !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{
                            width: `${Math.round(doc.ai_confidence * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-purple-600">
                        {Math.round(doc.ai_confidence * 100)}%
                      </span>
                    </div>
                  )}

                {/* Quick actions */}
                <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(doc.status === "pending" ||
                    doc.status === "active" ||
                    doc.status === "failed") &&
                    !isProcessing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProcess(doc.id);
                        }}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        title="Process with AI"
                      >
                        <Brain className="h-3.5 w-3.5" />
                      </button>
                    )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssignModal(doc.id);
                    }}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    title="Assign to Patient"
                  >
                    <User className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(doc.id);
                    }}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Archive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-slate-400">
                  {formatDate(doc.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Patient Modal */}
      {assignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setAssignModal(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Assign to Patient
              </h3>
              <button
                onClick={() => setAssignModal(null)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-1">
              <button
                onClick={() => handleAssignPatient(assignModal, null)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Unassign
              </button>
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAssignPatient(assignModal, p.id)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  {p.first_name} {p.last_name}
                </button>
              ))}
              {patients.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  No patients found
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Category Modal */}
      {categoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setCategoryModal(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Change Category
              </h3>
              <button
                onClick={() => setCategoryModal(null)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-1">
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() =>
                    handleChangeCategory(
                      categoryModal,
                      key as DocumentCategory
                    )
                  }
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      cfg.bgColor,
                      cfg.color
                    )}
                  >
                    {cfg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Extracted Data Renderer                                            */
/* ================================================================== */

function renderExtractedData(data: Record<string, unknown>) {
  const rows: { label: string; value: string }[] = [];

  const addField = (label: string, value: unknown) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === "object" && !Array.isArray(value)) {
      // Recursively handle objects
      const obj = value as Record<string, unknown>;
      Object.entries(obj).forEach(([k, v]) => {
        addField(
          `${label} > ${k
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}`,
          v
        );
      });
      return;
    }
    const display = Array.isArray(value) ? value.join(", ") : String(value);
    rows.push({
      label: label
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      value: display,
    });
  };

  Object.entries(data).forEach(([key, value]) => {
    addField(key, value);
  });

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
        <p className="text-xs text-slate-400">No data extracted</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-64 overflow-y-auto">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2"
        >
          <span className="shrink-0 text-[11px] font-semibold text-slate-400 min-w-[120px]">
            {row.label}
          </span>
          <span className="text-xs text-slate-700 break-all">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
