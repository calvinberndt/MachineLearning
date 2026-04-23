export function buildConceptHeadingId(section: string, slug: string): string {
  const normalisedSection = section.replace(/\./g, "-");
  const normalisedSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `s-${normalisedSection}-${normalisedSlug}`;
}
