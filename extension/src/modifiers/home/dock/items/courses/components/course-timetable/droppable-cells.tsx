import { Coordinate, coordinateToNumber } from "../../types/coordinate"
import { daysOfWeek } from "../../types/course"
import { DroppableCell } from "./droppable-cell"

export const DroppableCells = (props: {
  rowCount: number
  sortable: boolean
}) => {
  if (!props.sortable) {
    return
  }

  const coordinates: Coordinate[] = []

  for (let column = 0; column < daysOfWeek.length; column++) {
    for (let row = 0; row < props.rowCount; row++) {
      coordinates.push({
        column,
        row,
      })
    }
  }

  return (
    <>
      {coordinates.map(coordinate => {
        const key = coordinateToNumber(coordinate)
        return (
          <DroppableCell {...coordinate} coordinate={key} sortable={props.sortable} key={key} />
        )
      })}
    </>
  )
}
