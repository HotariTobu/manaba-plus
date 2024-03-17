export const positions = ['general', 'trash'] as const
export type Position = (typeof positions)[number]
