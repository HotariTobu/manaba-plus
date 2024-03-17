export const phases = ['over', 'moment', 'around', 'about', 'long'] as const
export type Phase = (typeof phases)[number]
