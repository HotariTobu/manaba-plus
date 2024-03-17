/**
 * Clamp number in [min, max].
 * @param num The number
 * @param min The minimum number
 * @param max The maximum number
 * @returns The clamped number
 */
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
