/**
 * Auto-truncates a full address to "City, State/Country" format.
 *
 * Examples:
 *   "1705 Walkers Ct., District Heights, MD 20747" → "District Heights, MD"
 *   "123 Main St, Apt 4, San Jose, CA 95112"       → "San Jose, CA"
 *   "Freetown, Sierra Leone"                        → "Freetown, Sierra Leone"
 *   "Baltimore, MD"                                 → "Baltimore, MD"
 *   "New York"                                      → "New York"
 */
export function formatLocation(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // Split by comma and clean each part
  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 2) {
    // Already short — just strip ZIP codes
    return parts.map(stripZip).filter(Boolean).join(", ");
  }

  // 3+ parts: take the last two (city + state/country), strip ZIP
  const last = stripZip(parts[parts.length - 1]);
  const secondLast = stripZip(parts[parts.length - 2]);

  // If the second-to-last looks like an apartment/unit, go one more back
  if (isUnitOrStreet(secondLast) && parts.length >= 4) {
    const thirdLast = stripZip(parts[parts.length - 3]);
    return [thirdLast, last].filter(Boolean).join(", ");
  }

  return [secondLast, last].filter(Boolean).join(", ");
}

function stripZip(s: string): string {
  // Remove US ZIP (5 or 5+4 digits), UK postcodes, and generic trailing numbers
  return s
    .replace(/\b\d{5}(-\d{4})?\b/g, "")
    .replace(/\b[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}\b/gi, "")
    .trim();
}

function isUnitOrStreet(s: string): boolean {
  const lower = s.toLowerCase();
  return (
    /^\d/.test(s) ||
    /\b(apt|suite|ste|unit|floor|fl|bldg|building|lot|#)\b/i.test(lower) ||
    /\b(st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|ln|lane|ct|court|way|pl|place|cir|circle|pkwy|parkway|hwy|highway)\b\.?$/i.test(lower)
  );
}
