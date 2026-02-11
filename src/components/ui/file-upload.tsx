"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  folder: "licenses" | "insurance-policies" | "hr-documents" | "patient-docs" | "general";
  accept?: string;
  maxSizeMB?: number;
  onUpload: (result: { path: string; url: string; name: string; size: number; type: string }) => void;
  label?: string;
  compact?: boolean;
}

export function FileUpload({
  folder,
  accept = ".pdf,.jpg,.jpeg,.png,.webp,.docx",
  maxSizeMB = 10,
  onUpload,
  label = "Upload File",
  compact = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setSuccess("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setSuccess(file.name);
      onUpload(data);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {label}
        </button>
        {success && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> {success}
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1 text-[10px] text-red-600">
            <AlertCircle className="h-3 w-3" /> {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-cyan-400 bg-cyan-50/50"
            : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-2" />
        ) : (
          <Upload className="h-8 w-8 text-slate-300 mb-2" />
        )}
        <p className="text-sm font-medium text-slate-600">
          {uploading ? "Uploading..." : label}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">
          PDF, JPEG, PNG, WebP, DOCX — Max {maxSizeMB}MB
        </p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {success && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
