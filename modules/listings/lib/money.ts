const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Accepts "50", "50.99", or "$50"; returns the numeric string without `$`, or null. */
export function parseMoneyAmount(raw: string): string | null {
  const cleaned = raw.trim().replace(/^\$+/, "").replace(/,/g, "");
  if (!MONEY_PATTERN.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return cleaned;
}

/** Renders a stored amount with a leading `$`. Legacy free-text values pass through. */
export function formatUsd(amount: string | null | undefined): string {
  if (!amount || !amount.trim()) return "—";
  const cleaned = amount.trim().replace(/^\$+/, "").replace(/,/g, "");
  if (MONEY_PATTERN.test(cleaned)) return `$${cleaned}`;
  return amount.trim();
}
