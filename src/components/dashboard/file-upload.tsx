"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  entityType: string;
  entityId?: string;
  onUploadComplete?: (doc: Record<string, unknown>) => void;
  accept?: string;
  maxSizeMB?: number;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function FileUpload({
  entityType,
  entityId,
  onUploadComplete,
  accept = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx",
  maxSizeMB = 10,
  description,
  className,
  compact = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setSuccess(false);

      // Client-side validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum: ${maxSizeMB}MB`);
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entityType", entityType);
        if (entityId) formData.append("entityId", entityId);
        if (description) formData.append("description", description);

        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const doc = await res.json();
        setSuccess(true);
        onUploadComplete?.(doc);

        // Reset success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [entityType, entityId, description, maxSizeMB, onUploadComplete]
  );

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
      if (e.dataTransfer.files?.[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleUpload(e.target.files[0]);
      }
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [handleUpload]
  );

  if (compact) {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors",
            uploading
              ? "opacity-50 cursor-not-allowed"
              : success
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "text-slate-700 hover:bg-slate-50 shadow-sm"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : success ? "Uploaded!" : "Upload Document"}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all",
          dragActive
            ? "border-cyan-400 bg-cyan-50/50"
            : success
            ? "border-emerald-300 bg-emerald-50/30"
            : error
            ? "border-red-300 bg-red-50/30"
            : "border-slate-200 bg-slate-50/30 hover:border-cyan-300 hover:bg-cyan-50/20",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-2" />
            <p className="text-sm font-medium text-slate-600">Uploading...</p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-medium text-emerald-700">File uploaded successfully</p>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 mb-2">
              <Upload className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Drop a file here or <span className="text-cyan-600">browse</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              PDF, JPEG, PNG, WebP, or Word &middot; Max {maxSizeMB}MB
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <X className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
