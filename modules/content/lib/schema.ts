import { DEFAULT_CONTENT, type ContentKey } from "./defaults";
import type { ContentValue, FieldSchema } from "../types";

export const CONTENT_LABELS: Record<ContentKey, { label: string; description: string; href: string }> = {
  site: { label: "Site settings", description: "Name, contact details, and social links.", href: "/" },
  home: { label: "Home page", description: "Welcome text, student resources, and the intern wall.", href: "/" },
  about: { label: "About & people", description: "Organization story, board members, sponsors, and credits.", href: "/about" },
  incoming: { label: "Student guide", description: "Orientation details, resources, and arrival information.", href: "/incoming-students" },
  membership: { label: "Membership", description: "Benefits, displayed pricing, and partner discounts.", href: "/membership" },
  merch: { label: "Merchandise", description: "Product photos, descriptions, displayed prices, and store link.", href: "/membership/merch" },
  features: { label: "Feature visibility", description: "Choose which existing sections visitors can access.", href: "/" },
  boards: { label: "Student boards", description: "Student board introduction and pinned TSA marketplace items.", href: "/current-students" },
};

function label(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function infer(value: ContentValue, key: string): FieldSchema {
  const base = { label: label(key) };
  if (typeof value === "boolean") return { ...base, type: "boolean" };
  if (typeof value === "string") {
    const image = /^(photo|logo|image|src|banner|design|orientationImage)$/i.test(key);
    const url = /^(href|purchaseUrl|orientationUrl)$/i.test(key);
    return {
      ...base, type: "string",
      ...(image ? { format: "image" as const } : url ? { format: "url" as const } : /Email$/.test(key) ? { format: "email" as const } : {}),
      required: /^(title|name|label|subtitle)$/.test(key),
      multiline: /introduction|description|body|summary|note|paragraph|details/i.test(key) || value.length > 160,
    };
  }
  if (Array.isArray(value)) return { ...base, type: "array", item: infer(value[0] ?? "", key === "details" ? "detail" : "item") };
  return { ...base, type: "object", fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, infer(v, k)])) };
}

export const CONTENT_SCHEMAS = Object.fromEntries(
  Object.entries(DEFAULT_CONTENT).map(([key, value]) => [key, infer(value, key)]),
) as Record<ContentKey, FieldSchema>;

for (const [document, list] of [["site", "socialLinks"], ["home", "lifeSections"], ["incoming", "recommendedSites"]] as const) {
  const href = CONTENT_SCHEMAS[document].fields?.[list]?.item?.fields?.href;
  if (href) href.required = true;
}

export function isContentKey(value: string): value is ContentKey {
  return Object.hasOwn(DEFAULT_CONTENT, value);
}

export function isSafeContentUrl(value: string, image = false): boolean {
  if (!value) return true;
  if (/[\s\u0000-\u001f\u007f\\]/.test(value)) return false;
  if (/^https?:\/\/[^/]+/i.test(value)) {
    try { const url = new URL(value); return Boolean(url.hostname) && !url.username && !url.password; } catch { return false; }
  }
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return !image && (/^#[\w-]+$/.test(value) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export function validateContent(value: unknown, schema: FieldSchema, path = schema.label): string | null {
  if (schema.type === "string") {
    if (typeof value !== "string" || value.length > 20000) return `${path}: enter text under 20,000 characters.`;
    if (schema.required && !value.trim()) return `${path} is required.`;
    if ((schema.format === "url" || schema.format === "image") && !isSafeContentUrl(value, schema.format === "image")) return `${path}: enter an http(s) URL or a local path.`;
    if (schema.format === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `${path}: enter a valid email address.`;
    return null;
  }
  if (schema.type === "boolean") return typeof value === "boolean" ? null : `${path}: choose on or off.`;
  if (schema.type === "array") {
    if (!Array.isArray(value) || value.length > 100 || !schema.item) return `${path}: use no more than 100 items.`;
    for (const [index, item] of value.entries()) { const error = validateContent(item, schema.item, `${path} / ${index + 1}`); if (error) return error; }
    return null;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return `${path}: invalid content.`;
  const record = value as Record<string, unknown>;
  const fields = schema.fields ?? {};
  if (Object.keys(record).length !== Object.keys(fields).length) return `${path}: fields have changed. Reload the editor.`;
  for (const [key, field] of Object.entries(fields)) { const error = validateContent(record[key], field, `${path} / ${field.label}`); if (error) return error; }
  return null;
}

export function emptyValue(schema: FieldSchema): ContentValue {
  if (schema.type === "string") return "";
  if (schema.type === "boolean") return false;
  if (schema.type === "array") return [];
  return Object.fromEntries(Object.entries(schema.fields ?? {}).map(([key, field]) => [key, emptyValue(field)]));
}
