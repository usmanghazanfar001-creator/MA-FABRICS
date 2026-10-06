"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadDirect } from "@/components/admin/direct-upload";

interface SingleImageFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: "products" | "banners" | "categories";
}

export function SingleImageField({ name, label, defaultValue = "", folder = "categories" }: SingleImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      setUrl(await uploadDirect(file, "photos"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative h-28 w-28 overflow-hidden border border-navy/10">
          <Image src={url} alt="" fill className="object-cover" sizes="112px" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy/80 text-cream"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) upload(e.dataTransfer.files[0]);
          }}
          className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-navy/20 bg-white text-center text-xs text-navy/60 hover:border-gold"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
