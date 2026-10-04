"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { ACCEPT, uploadDirect } from "@/components/admin/direct-upload";

/** Drop many photos at once: each goes straight to Cloudinary, then all are saved as drafts in one server call. */
export function BulkPhotoUploader({
  saveAction,
}: {
  saveAction: (items: { title: string; url: string }[]) => Promise<void>;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setErrors([]);
    const saved: { title: string; url: string }[] = [];
    const failed: string[] = [];
    const list = Array.from(files);

    for (let i = 0; i < list.length; i++) {
      const file = list[i]!;
      setStatus(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const url = await uploadDirect(file, "photos");
        const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Untitled";
        saved.push({ title, url });
      } catch (err) {
        failed.push(`${file.name}: ${err instanceof Error ? err.message : "failed"}`);
      }
    }

    if (saved.length) {
      setStatus("Saving…");
      await saveAction(saved);
    }
    setStatus(saved.length ? `Added ${saved.length} photo${saved.length > 1 ? "s" : ""} as drafts.` : null);
    setErrors(failed);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    startTransition(() => router.refresh());
  }

  return (
    <div className="mb-10 max-w-2xl">
      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy && e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-navy/20 bg-white py-10 text-center text-sm text-navy/60 hover:border-gold"
      >
        <Upload className="h-5 w-5" />
        {busy ? status : "Drag & drop photos, or click to browse (JPG, PNG, WebP · up to 10MB each)"}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.photos}
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {!busy && status && <p className="mt-2 text-xs text-green-700">{status}</p>}
      {errors.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-700">{e}</p>
      ))}
    </div>
  );
}
