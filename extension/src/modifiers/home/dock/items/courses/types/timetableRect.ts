export interface TimetableRect extends Record<string, number | null> {
  column: number
  row: number | null
  span: number
}
