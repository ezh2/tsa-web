"use client";

import { useState } from "react";

const ENGLISH_COPY = [
  "UIUC TSA’s official merchandise for the new semester is finally here!",
  "This time, we are introducing the 「呆丸囡仔」oversized T-shirt, designed to bring the memories, energy, and sense of belonging from campus in Champaign into your everyday life. Whether you are an incoming student about to begin a new journey, a current student working hard on campus, or an alum who misses your alma mater, this TSA-exclusive design is the perfect way to show your Illini Pride! 🧡 💙",
  "Available in classic black and white, these timeless and versatile colors make the shirt easy to style for any occasion. Whether you are studying at the library, heading out for brunch, or putting together a casual everyday outfit, it fits effortlessly into your wardrobe. No matter whether you are in Champaign or Taiwan, wearing it will help you instantly recognize fellow members of the TSA community!",
  "Get yours now and carry your UIUC memories with you wherever you go!",
];

export function MerchTranslationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-500 hover:bg-neutral-50"
      >
        Translate to English
      </button>

      {open && (
        <div
          aria-labelledby="merch-translation-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          role="dialog"
        >
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-md bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="merch-translation-title"
                className="text-lg font-semibold text-neutral-900"
              >
                English Translation
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-2.5 py-1 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-700">
              <p className="font-semibold text-neutral-900">
                📢 {ENGLISH_COPY[0]}
              </p>
              {ENGLISH_COPY.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
