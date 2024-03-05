export interface TimetableCoordinate extends Record<string, number | undefined> {
  column: number
  row?: number
}
