export interface Coordinate extends Record<string, number> {
  column: number
  row: number
}

const factor = 10

export const toNumber = (coordinate: Coordinate) => {
  return coordinate.column + coordinate.row * factor
}

export const fromNumber = (value: number): Coordinate => {
  return {
    column: value % factor,
    row: Math.floor(value / factor),
  }
}
