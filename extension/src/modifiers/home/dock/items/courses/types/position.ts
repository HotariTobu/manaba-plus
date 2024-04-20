import { hiddenPosition } from "@/modifiers/home/config"

export const positions = ['timetable', 'current', 'other', 'rest', hiddenPosition] as const
export type Position = (typeof positions)[number]
