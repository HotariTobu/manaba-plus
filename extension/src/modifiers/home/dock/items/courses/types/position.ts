export const positions = ['timetable', 'current', 'other', 'rest', 'trash'] as const
export type Position = (typeof positions)[number]
