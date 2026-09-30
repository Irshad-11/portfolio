export const CATEGORY_ORDER = [
  'Languages', 'Frameworks & Libraries', 'Databases', 'Tools & Platforms', 'Cloud & DevOps',
  'Mobile', 'Testing', 'Data & AI', 'Design & Creative',
]

/** Categories in a stable, sensible order (known ones first, then alphabetical). */
export function orderedCategories(items: { category: string }[]): string[] {
  const set = Array.from(new Set(items.map(i => i.category).filter(Boolean)))
  return set.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b)
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    return a.localeCompare(b)
  })
}

export const LEVELS = ['Familiar', 'Working', 'Proficient', 'Strong', 'Deep'] as const