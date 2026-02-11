"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  Trash2,
  Loader2,
  File,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  uploaded_by_name: string | null;
  description: string | null;
  created_at: string;
}

interface DocumentListProps {
  entityType: string;
  entityId?: string;
  className?: string;
  refreshKey?: number;
  canDelete?: boolean;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return Image;
  if (fileType === "application/pdf") return FileText;
  if (fileType.includes("word") || fileType.includes("document")) return FileSpreadsheet;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({
  entityType,
  entityId,
  className,
  refreshKey = 0,
  canDelete = true,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ entityType });
      if (entityId) params.set("entityId", entityId);

      const res = await fetch(`/api/documents?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data || []);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.download_url) {
          const link = document.createElement("a");
          link.href = data.download_url;
          link.download = fileName;
          link.target = "_blank";
          link.click();
        }
      }
    } catch {
      // Silent fail
    }
  };

  const handleDelete = async (docId: string) => {
    setDeleting(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch {
      // Silent fail
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-6", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    );
  }

  if (documents.length === 0) {
    return null; // Don't show anything if no documents
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Documents ({documents.length})
      </p>
      {documents.map((doc) => {
        const Icon = getFileIcon(doc.file_type);
        return (
          <div
            key={doc.id}
            className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
              <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-slate-900">
                {doc.file_name}
              </p>
              <p className="text-[10px] text-slate-400">
                {formatFileSize(doc.file_size)}
                {doc.uploaded_by_name && ` \u00B7 ${doc.uploaded_by_name}`}
                {" \u00B7 "}
                {new Date(doc.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDownload(doc.id, doc.file_name)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-cyan-600"
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              {canDelete && (
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600 disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === doc.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
