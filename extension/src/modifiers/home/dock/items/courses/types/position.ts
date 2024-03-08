export const positions = ['main', 'other', 'trash'] as const
export type Position = (typeof positions)[number]

export const getDynamicPosition = (base: Position, year: string | number | null, term: string) => {
  return `${base}-${year ?? 'none'}-${term}`
}
