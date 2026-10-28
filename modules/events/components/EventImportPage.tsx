"use client";

import Link from "next/link";
import { useState } from "react";
import { importEventsAction, previewEventImportAction } from "../server/actions";
import type { EventImportDuplicate, EventImportIssue, EventImportRecord } from "../lib/import";

type Preview = {
  ok: boolean;
  events: EventImportRecord[];
  issues: EventImportIssue[];
  duplicates: EventImportDuplicate[];
};
type ImportResult = Awaited<ReturnType<typeof importEventsAction>>;

function formatEventDate(event: EventImportRecord): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: event.time_tba ? undefined : "short",
    timeZone: event.time_zone,
  }).format(new Date(event.starts_at));
}

export function EventImportPage() {
  const [json, setJson] = useState("");
  const [validatedJson, setValidatedJson] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [fileError, setFileError] = useState("");

  function updateJson(value: string) {
    setJson(value);
    setValidatedJson("");
    setPreview(null);
    setResult(null);
    setFileError("");
  }

  async function loadFile(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json") || file.size > 1_000_000) {
      setFileError("Choose a .json file no larger than 1 MB.");
      return;
    }
    try {
      updateJson(await file.text());
    } catch {
      setFileError("Could not read that JSON file.");
    }
  }

  async function validate() {
    setBusy(true);
    setResult(null);
    try {
      const next = await previewEventImportAction(json);
      setPreview(next);
      setValidatedJson(json);
    } catch {
      setPreview({
        ok: false,
        events: [],
        issues: [{ row: null, message: "Could not validate the import. Try again." }],
        duplicates: [],
      });
    } finally {
      setBusy(false);
    }
  }

  async function importBatch() {
    if (!preview?.ok || preview.duplicates.length || validatedJson !== json) return;
    setBusy(true);
    try {
      const next = await importEventsAction(json);
      setResult(next);
      if (next.ok) {
        setPreview(null);
        setValidatedJson("");
      } else {
        setPreview({
          ok: false,
          events: [],
          issues: next.issues,
          duplicates: next.duplicates,
        });
        setValidatedJson(json);
      }
    } catch {
      setResult({
        ok: false,
        count: 0,
        issues: [{ row: null, message: "Import failed before completion. Check the event list, then retry." }],
        duplicates: [],
      });
    } finally {
      setBusy(false);
    }
  }

  const canImport = Boolean(preview?.ok && preview.events.length && !preview.duplicates.length && validatedJson === json && !busy);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link href="/admin/events" className="text-sm text-neutral-600 hover:text-neutral-900">
        &larr; Manage events
      </Link>
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Admin · Events</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">Import events</h1>
        <p className="mt-2 text-sm text-neutral-600">Import up to 100 events at a time.</p>
      </header>

      <section className="mt-7 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
            Choose JSON file
            <input
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={(event) => {
                void loadFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <a
            href="/event-import-template.json"
            download
            className="text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
          >
            Download JSON template
          </a>
        </div>

        <label htmlFor="event-import-json" className="block text-sm font-medium text-neutral-800">Events JSON</label>
        <textarea
          id="event-import-json"
          value={json}
          onChange={(event) => updateJson(event.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={18}
          className="w-full rounded-md border border-neutral-300 px-3 py-3 font-mono text-xs leading-5 outline-none focus:border-neutral-900"
          placeholder={'[\n  {\n    "title": "Event title",\n    "starts_at": "2026-11-13T17:30",\n    "time_zone": "America/Chicago"\n  }\n]'}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void validate()}
            disabled={busy || !json.trim()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Checking…" : "Validate & preview"}
          </button>
          <Link href="/admin/events" className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Cancel
          </Link>
        </div>
      </section>

      {fileError && <p role="alert" className="mt-4 text-sm text-red-700">{fileError}</p>}

      {preview && (
        <section className="mt-8 border-t border-neutral-200 pt-6" aria-live="polite">
          <h2 className="text-lg font-semibold text-neutral-900">Preview</h2>
          {preview.issues.length > 0 && (
            <ul className="mt-3 space-y-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {preview.issues.map((issue, index) => (
                <li key={`${issue.row ?? "json"}-${index}`}>
                  {issue.row === null ? "JSON" : `Row ${issue.row}`}: {issue.message}
                </li>
              ))}
            </ul>
          )}
          {preview.duplicates.length > 0 && (
            <ul className="mt-3 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {preview.duplicates.map((duplicate) => (
                <li key={duplicate.row}>
                  Row {duplicate.row} duplicates {duplicate.matchedRow === null ? "an existing event" : `row ${duplicate.matchedRow}`} ({duplicate.title}, {formatEventDate({
                    title: duplicate.title,
                    description: null,
                    location: null,
                    starts_at: duplicate.starts_at,
                    ends_at: null,
                    capacity: null,
                    image_url: "",
                    image_gallery: [],
                    link_url: "",
                    time_zone: duplicate.time_zone,
                    time_tba: false,
                    time_note: "",
                    show_in_archive: true,
                    is_published: true,
                  })}).
                </li>
              ))}
            </ul>
          )}
          {preview.ok && preview.events.length > 0 && (
            <>
              <p className="mt-2 text-sm text-neutral-600">{preview.events.length} events ready to import.</p>
              <ul className="mt-4 divide-y divide-neutral-200 rounded-md border border-neutral-200">
                {preview.events.map((event, index) => (
                  <li key={`${event.title}-${event.starts_at}`} className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 px-4 py-3">
                    <span className="font-medium text-neutral-900">{index + 1}. {event.title}</span>
                    <span className="text-sm text-neutral-600">{formatEventDate(event)} · {event.location || "No location"}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {preview.ok && preview.events.length > 0 && (
            <button
              type="button"
              onClick={() => void importBatch()}
              disabled={!canImport}
              className="mt-5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Importing…" : `Import ${preview.events.length} events`}
            </button>
          )}
        </section>
      )}

      {result && (
        <p role={result.ok ? "status" : "alert"} className={`mt-5 rounded-md border px-4 py-3 text-sm ${result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {result.ok ? `Imported ${result.count} events.` : [...result.issues.map((issue) => `${issue.row === null ? "Import" : `Row ${issue.row}`}: ${issue.message}`), ...result.duplicates.map((duplicate) => `Row ${duplicate.row} duplicates an existing or imported event.`)].join(" ")}
        </p>
      )}
    </main>
  );
}
