"use client";

import { useRef, useState } from "react";
import { Upload, X, Film } from "lucide-react";
import { ACCEPT, uploadDirect, type UploadFolder } from "@/components/admin/direct-upload";

interface MediaFieldProps {
  name: string;
  label: string;
  folder: UploadFolder;
  defaultValue?: string;
  required?: boolean;
  /** false = no upload box, paste a URL or /path only (use when Cloudinary isn't configured). */
  uploadsEnabled?: boolean;
}

/** One upload slot (photo, video or thumbnail) that posts its final URL via a hidden input. Pasting a URL also works. */
export function MediaField({ name, label, folder, defaultValue = "", required, uploadsEnabled = true }: MediaFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isVideo = folder === "videos";

  async function upload(file: File) {
    setError(null);
    setProgress(0);
    try {
      setUrl(await uploadDirect(file, folder, setProgress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
    setProgress(null);
  }

  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      {/* Hidden input carries the value; the visible URL box below edits the same state. */}
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-start gap-3">
        {url ? (
          <div className="relative h-28 w-28 overflow-hidden border border-navy/10 bg-navy">
            {isVideo ? (
              <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              aria-label="Remove"
              onClick={() => setUrl("")}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy/80 text-cream"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : !uploadsEnabled ? null : (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) upload(f);
            }}
            className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-navy/20 bg-white text-center text-xs text-navy/60 hover:border-gold"
          >
            {isVideo ? <Film className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {progress !== null ? `${progress}%` : "Upload"}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT[folder]}
              hidden
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </div>
        )}

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={uploadsEnabled ? "…or paste a URL" : "Path or URL, e.g. /media/gallery/photo-1.jpg"}
          required={required}
          className="min-w-[12rem] flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
        />
      </div>
      {progress !== null && (
        <div className="mt-2 h-1 w-full max-w-xs bg-navy/10">
          <div className="h-1 bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
