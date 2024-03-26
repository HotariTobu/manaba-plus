/** Represent a timetable cell coordinate */
export interface Coordinate extends Record<string, number> {
  column: number
  row: number
}

/** <course id, coordinate list> */
export type CoordinatesMap = Map<string, number[]>

/** A factor to convert a coordinate and a number for each other */
const factor = 10

export const coordinateToNumber = (coordinate: Coordinate) => {
  return coordinate.column + coordinate.row * factor
}

export const coordinateFromNumber = (value: number): Coordinate => {
  return {
    column: value % factor,
    row: Math.floor(value / factor),
  }
}
