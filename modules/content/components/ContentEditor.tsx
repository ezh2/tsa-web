"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState } from "react";
import { saveContentAction } from "../server/actions";
import { CONTENT_LABELS, CONTENT_SCHEMAS, emptyValue } from "../lib/schema";
import type { ContentKey } from "../lib/defaults";
import type { ContentRow, ContentValue, FieldSchema, SaveContentState } from "../types";
import { MediaField } from "./MediaField";

const initialState: SaveContentState = { ok: false, message: "" };

export function ContentEditor({ documentKey, row, disabled }: { documentKey: ContentKey; row: ContentRow; disabled: boolean }) {
  const [body, setBody] = useState(row.body);
  const [initialRevision] = useState(row.revision);
  const [savedBody, setSavedBody] = useState(JSON.stringify(row.body));
  const [uploadCount, setUploadCount] = useState(0);
  const [state, action, pending] = useActionState(saveContentAction, initialState);
  const [submittedBody, setSubmittedBody] = useState(savedBody);
  const dirty = JSON.stringify(body) !== (state.ok ? submittedBody : savedBody);
  const info = CONTENT_LABELS[documentKey];
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); }
    function confirmNavigation(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.button !== 0) return;
      if (!window.confirm("Leave this editor and discard unpublished changes?")) { event.preventDefault(); event.stopPropagation(); }
    }
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", confirmNavigation, true);
    return () => { window.removeEventListener("beforeunload", warn); document.removeEventListener("click", confirmNavigation, true); };
  }, [dirty]);
  // Action results carry the exact saved revision; edits made later stay local.
  const publishedBody = state.ok ? submittedBody : savedBody;
  function busyChange(busy: boolean) { setUploadCount((count) => count + (busy ? 1 : -1)); }
  return (
    <form action={action} onSubmit={() => { setSubmittedBody(JSON.stringify(body)); setSavedBody(publishedBody); }} className="min-w-0">
      <input type="hidden" name="key" value={documentKey} />
      <input type="hidden" name="revision" value={state.revision ?? initialRevision} />
      <input type="hidden" name="body" value={JSON.stringify(body)} />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-6">
        <div><p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Website editor</p><h2 className="mt-2 text-3xl font-semibold">{info.label}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{info.description}</p></div>
        <Link href={info.href} target="_blank" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium">View page ↗</Link>
      </div>
      {documentKey === "features" && <p className="mb-6 rounded-md bg-neutral-100 p-4 text-sm leading-6">Switches control existing pages and sections. Creating new functionality requires a website update.</p>}
      {(documentKey === "membership" || documentKey === "merch") && <p className="mb-6 rounded-md bg-neutral-100 p-4 text-sm leading-6">Prices here are display text. Update your external store separately to change what buyers are charged.</p>}
      <fieldset disabled={disabled || pending} className="space-y-6 disabled:opacity-60">
        <EditorField schema={CONTENT_SCHEMAS[documentKey]} value={body} onChange={setBody} onBusyChange={busyChange} root />
      </fieldset>
      <div className="sticky bottom-0 z-20 mt-10 border-t border-neutral-200 bg-[#f5f5f7]/95 py-4 backdrop-blur-xl">
        {state.message && <p role={state.ok ? "status" : "alert"} className={`mb-3 text-sm ${state.ok ? "text-emerald-800" : "text-red-700"}`}>{state.message}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">{uploadCount > 0 ? "Wait for image uploads to finish." : "Publishing updates the live website."}</p>
          <button type="submit" disabled={disabled || pending || uploadCount > 0} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Publishing…" : "Publish changes"}</button>
        </div>
      </div>
    </form>
  );
}

function EditorField({ schema, value, onChange, onBusyChange, root = false }: { schema: FieldSchema; value: ContentValue; onChange: (next: ContentValue) => void; onBusyChange: (busy: boolean) => void; root?: boolean }) {
  const id = useId();
  if (schema.type === "boolean") return <label className="flex items-center justify-between gap-6 rounded-md border border-neutral-200 bg-white p-5"><span className="font-medium">{schema.label}</span><input type="checkbox" role="switch" checked={value === true} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-neutral-900" /></label>;
  if (schema.type === "string") {
    if (schema.format === "image") return <MediaField label={schema.label} value={String(value)} onChange={onChange} onBusyChange={onBusyChange} />;
    return <label htmlFor={id} className="block"><span className="mb-2 block text-sm font-medium text-neutral-800">{schema.label}{schema.required ? " *" : ""}</span>{schema.multiline ? <textarea id={id} value={String(value)} required={schema.required} maxLength={20000} rows={4} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm leading-6" /> : <input id={id} type={schema.format === "email" ? "email" : "text"} value={String(value)} required={schema.required} maxLength={20000} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />}</label>;
  }
  if (schema.type === "array" && schema.item && Array.isArray(value)) {
    const itemSchema = schema.item;
    function move(index: number, offset: number) { const next = [...value as ContentValue[]]; [next[index], next[index + offset]] = [next[index + offset], next[index]]; onChange(next); }
    return <details className="rounded-md border border-neutral-200 bg-white p-5" open={value.length <= 3}>
      <summary className="cursor-pointer text-base font-semibold">{schema.label} <span className="ml-2 text-xs font-normal text-neutral-500">{value.length} items</span></summary>
      <div className="mt-5 space-y-4">{value.map((item, index) => <div key={index} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <div className="mb-4 flex items-center justify-between gap-3"><span className="text-xs font-semibold text-neutral-500">Item {index + 1}</span><div className="flex gap-3 text-xs"><button type="button" aria-label={`Move ${schema.label} item ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)} className="disabled:opacity-30">Move up</button><button type="button" aria-label={`Move ${schema.label} item ${index + 1} down`} disabled={index === value.length - 1} onClick={() => move(index, 1)} className="disabled:opacity-30">Move down</button><button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="text-red-700">Remove</button></div></div>
        <EditorField schema={itemSchema} value={item} onChange={(next) => onChange(value.map((old, i) => i === index ? next : old))} onBusyChange={onBusyChange} root />
      </div>)}<button type="button" disabled={value.length >= 100} onClick={() => onChange([...value, emptyValue(itemSchema)])} className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium">+ Add item</button></div>
    </details>;
  }
  const record = value as Record<string, ContentValue>;
  const fields = <div className="space-y-5">{Object.entries(schema.fields ?? {}).map(([key, field]) => <EditorField key={key} schema={field} value={record[key]} onChange={(next) => onChange({ ...record, [key]: next })} onBusyChange={onBusyChange} />)}</div>;
  return root ? fields : <fieldset className="rounded-md border p-5"><legend className="px-2 font-medium">{schema.label}</legend>{fields}</fieldset>;
}
