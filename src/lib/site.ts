// One place for the site name and address. Change them here only.
export const SITE_URL = "https://www.mlroadmap.dev";
export const SITE_NAME = "MLRoadmap";

// Search engines show about 160 characters. Cut long descriptions at a word boundary.
export function trimDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\-–—\s]+$/, "") + "…";
}
