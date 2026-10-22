import type { ContentKey } from "../lib/defaults";

export type ContentValue = string | boolean | ContentValue[] | { [key: string]: ContentValue };

export interface FieldSchema {
  type: "string" | "boolean" | "array" | "object";
  label: string;
  format?: "url" | "image" | "email";
  multiline?: boolean;
  required?: boolean;
  fields?: Record<string, FieldSchema>;
  item?: FieldSchema;
}

export interface ContentRow {
  key: ContentKey;
  body: ContentValue;
  revision: number;
  updated_at: string;
}

export interface SaveContentState {
  ok: boolean;
  message: string;
  revision?: number;
}
