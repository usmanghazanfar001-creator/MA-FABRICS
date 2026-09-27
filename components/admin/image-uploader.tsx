"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: "products" | "banners" | "categories";
}

export function ImageUploader({ value, onChange, folder = "products" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        uploaded.push(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    onChange([...value, ...uploaded]);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function reorder(from: number, to: number) {
    const next = [...value];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-navy/20 bg-white py-10 text-center text-sm text-navy/60 hover:border-gold"
      >
        <Upload className="h-5 w-5" />
        {uploading ? "Uploading..." : "Drag & drop images, or click to browse"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {value.map((url, i) => (
            <div
              key={url + i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              className="group relative aspect-square cursor-grab overflow-hidden border border-navy/10"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="100px" />
              <span className="absolute left-1 top-1 text-cream drop-shadow">
                <GripVertical className="h-3.5 w-3.5" />
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy/80 text-cream opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
