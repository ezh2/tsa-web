"use client";

import { useState } from "react";
import { MediaField } from "@/modules/content/client";

export function EventGalleryEditor({ images = [], onChange }: { images?: { src: string; alt: string }[]; onChange?: () => void }) {
  const [gallery, setGallery] = useState(images.map((image, index) => ({ ...image, key: String(index) })));
  function updateGallery(next: typeof gallery | ((current: typeof gallery) => typeof gallery)) {
    setGallery(next);
    onChange?.();
  }
  return (
    <fieldset className="space-y-4 rounded-md border border-neutral-200 p-4">
      <legend className="px-2 text-sm font-medium">Photo gallery</legend>
      <p className="text-xs leading-5 text-neutral-500">Photos appear in the event&apos;s existing photo dialog. The main image is used as the card background.</p>
      <input type="hidden" name="image_gallery" value={JSON.stringify(gallery.map(({ src, alt }) => ({ src, alt })))} />
      {gallery.map((image, index) => (
        <div key={image.key} className="space-y-3 rounded-md bg-neutral-50 p-3">
          <MediaField label={`Photo ${index + 1}`} value={image.src} onChange={(src) => updateGallery((current) => current.map((item) => item.key === image.key ? { ...item, src } : item))} />
          <label className="block text-xs font-medium">Photo description
            <input value={image.alt} maxLength={500} onChange={(event) => updateGallery((current) => current.map((item) => item.key === image.key ? { ...item, alt: event.target.value } : item))} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
          </label>
          <button type="button" onClick={() => updateGallery((current) => current.filter((item) => item.key !== image.key))} className="text-xs font-medium text-red-700">Remove photo</button>
        </div>
      ))}
      <button type="button" disabled={gallery.length >= 20} onClick={() => updateGallery((current) => [...current, { key: crypto.randomUUID(), src: "", alt: "" }])} className="rounded-md border px-3 py-2 text-xs font-medium disabled:opacity-50">Add photo</button>
    </fieldset>
  );
}
