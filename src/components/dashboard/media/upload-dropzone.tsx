"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[], previewUrls: string[]) => void;
  maxFiles?: number;
}

export function UploadDropzone({ onFilesSelected, maxFiles = 10 }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"].includes(f.type))
      .slice(0, maxFiles);

    const newPreviews = valid.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const next = [...previews, ...newPreviews].slice(0, maxFiles);
    setPreviews(next);
    onFilesSelected(next.map(p => p.file), next.map(p => p.url));
  };

  const removeFile = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      const next = prev.filter((_, i) => i !== idx);
      onFilesSelected(next.map((p) => p.file), next.map(p => p.url));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer
          ${dragging ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="font-semibold text-gray-700">Drop photos here or click to browse</p>
        <p className="mt-1 text-sm text-gray-500">JPG, PNG, WEBP, HEIC · Up to 20 MB each · Max {maxFiles} photos</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((p, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
              <Image src={p.url} alt={p.file.name} fill className="object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-0.5">
                <p className="truncate text-[10px] text-white">{p.file.name}</p>
              </div>
            </div>
          ))}
          {previews.length < maxFiles && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-cyan-400 text-gray-400 hover:text-cyan-500 transition-colors"
            >
              <ImageIcon className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
