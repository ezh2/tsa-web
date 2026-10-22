"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createClient } from "@/core/supabase/client";
import { isSafeContentUrl } from "../lib/schema";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export function MediaField({ label, name, value, defaultValue = "", onChange, onBusyChange }: {
  label: string; name?: string; value?: string; defaultValue?: string;
  onChange?: (value: string) => void; onBusyChange?: (busy: boolean) => void;
}) {
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const current = value ?? localValue;
  useEffect(() => {
    if (!busy) return;
    const form = container.current?.closest("form");
    function preventSubmit(event: SubmitEvent) { event.preventDefault(); setError("Wait for the image upload to finish before saving."); }
    form?.addEventListener("submit", preventSubmit);
    return () => form?.removeEventListener("submit", preventSubmit);
  }, [busy]);
  function update(next: string) { setLocalValue(next); onChange?.(next); }
  async function upload(file?: File) {
    if (!file) return;
    if (!extensions[file.type] || file.size > 5 * 1024 * 1024) { setError("Choose a JPG, PNG, WebP, or GIF under 5 MB."); return; }
    setError(""); setBusy(true); onBusyChange?.(true);
    try {
      const client = createClient();
      const path = `${crypto.randomUUID()}.${extensions[file.type]}`;
      const { error: uploadError } = await client.storage.from("site-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      update(client.storage.from("site-media").getPublicUrl(path).data.publicUrl);
    } catch { setError("Upload failed. Check your admin access and that the website content migration is installed."); }
    finally { setBusy(false); onBusyChange?.(false); }
  }
  return (
    <div ref={container} className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800">{label}</label>
      {current && isSafeContentUrl(current, true) && <Image unoptimized src={current} alt={`${label} preview`} width={320} height={180} className="h-28 w-auto max-w-full rounded-md border border-neutral-200 object-contain" />}
      <input id={id} name={name} value={current} onChange={(event) => update(event.target.value)} placeholder="https://… or /content/photo.jpg" className="w-full rounded-md border px-3 py-2 text-sm" />
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium">
        {busy ? "Uploading…" : "Upload image"}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} className="sr-only" />
      </label>
      <span className="ml-2 text-xs text-neutral-500">JPG, PNG, WebP, GIF · up to 5 MB</span>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
