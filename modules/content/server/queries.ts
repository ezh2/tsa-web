import "server-only";
import { cache } from "react";
import { notFound, unstable_rethrow } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import { DEFAULT_CONTENT, type ContentKey, type ContentMap, type SiteFeature } from "../lib/defaults";
import { CONTENT_SCHEMAS, isContentKey, validateContent } from "../lib/schema";
import type { ContentRow } from "../types";

export const getContentState = cache(async (): Promise<{ rows: ContentRow[]; ready: boolean }> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("content_document").select("key, body, revision, updated_at");
    if (error) { console.warn("Website content could not be loaded", error.message); return { rows: [], ready: false }; }
    const rows = (data ?? []).filter((row) => isContentKey(row.key) && !validateContent(row.body, CONTENT_SCHEMAS[row.key as ContentKey])) as ContentRow[];
    return { rows, ready: rows.length === Object.keys(DEFAULT_CONTENT).length };
  } catch (error) {
    unstable_rethrow(error);
    console.warn("Website content is unavailable", error);
    return { rows: [], ready: false };
  }
});

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const { rows } = await getContentState();
  return (rows.find((row) => row.key === key)?.body ?? DEFAULT_CONTENT[key]) as ContentMap[K];
}

export async function requireSiteFeature(key: SiteFeature): Promise<void> {
  const features = await getContent("features");
  if (!features[key]) notFound();
}
