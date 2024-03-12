import { Coordinate, toNumber } from "../../types/coordinate"
import { days } from "../../types/course"
import { DroppableCell } from "./droppable-cell"

export const DroppableCells = (props: {
  rowCount: number
  sortable: boolean
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
          <DroppableCell {...coordinate} coordinate={key} key={key} {...props} />
        )
      })}
    </>
  )
}
