import { Coordinate, toNumber } from "../../types/coordinate"
import { days } from "../../types/course"
import { DisabledAt, DroppableCell } from "./droppable-cell"

export const DroppableCells = (props: {
  term: string
  rowCount: number
  sortable: boolean
  disabledAt: DisabledAt
}) => {
  if (!props.sortable) {
    return
  }

  const coordinates: Coordinate[] = []

  for (const day of days) {
    for (let row = 0; row < props.rowCount; row++) {
      coordinates.push({
        column: day,
        row: row,
      })
    }
  }

  return (
    <>
      {coordinates.map(coordinate => {
        const key = toNumber(coordinate)
        return (
          <DroppableCell column={coordinate.column} row={coordinate.row} coordinate={key} key={key} {...props} />
        )
      })}
    </>
  )
}
