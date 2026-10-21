"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/core/rbac/server";
import { createClient } from "@/core/supabase/server";
import { CONTENT_SCHEMAS, isContentKey, validateContent } from "../lib/schema";
import type { SaveContentState } from "../types";

export async function saveContentAction(_previous: SaveContentState, formData: FormData): Promise<SaveContentState> {
  await requireRole("admin");
  const key = String(formData.get("key") ?? "");
  const revision = Number(formData.get("revision"));
  if (!isContentKey(key) || !Number.isSafeInteger(revision) || revision < 1) return { ok: false, message: "Reload this page before publishing." };
  const fail = (message: string): SaveContentState => ({ ok: false, message, revision });
  const raw = String(formData.get("body") ?? "");
  if (raw.length > 250000) return fail("This page is too large. Shorten its content before publishing.");
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return fail("The content could not be read. Reload and try again."); }
  const validationError = validateContent(body, CONTENT_SCHEMAS[key]);
  if (validationError) return fail(validationError);
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_document").update({ body }).eq("key", key).eq("revision", revision).select("revision").maybeSingle();
  if (error) return fail("Publishing failed. Check that the website content migration is installed and try again.");
  if (!data) return fail("Another admin changed this page. Reload to get the latest version before editing again.");
  revalidatePath("/", "layout");
  return { ok: true, message: "Published. Your changes are now visible on the website.", revision: data.revision };
}
