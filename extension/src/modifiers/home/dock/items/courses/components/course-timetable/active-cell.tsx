import { useState } from "react"
import { Coordinate, coordinateFromNumber, coordinateToNumber } from "../../types/coordinate"
import { Active, DragEndEvent, DragOverEvent, useDndMonitor } from "@dnd-kit/core"
import { DisabledAt, getDroppableCellData } from "./droppable-cell"
import { getCourseCellData } from "./course-cell"
import { UpdateCoordinatesMap } from "../../hooks/useCoordinatesMap"

export const ActiveCell = (props: {
  updateCoordinatesMap: UpdateCoordinatesMap
  disabledAt: DisabledAt
}) => {
  const [activeCoordinate, setActiveCoordinate] = useState<Coordinate | null>(null)

  const getCoordinate = (active: Active) => {
    const courseCellData = getCourseCellData(active)
    if (courseCellData === null) {
      return null
    }
    else {
      return courseCellData.coordinate
    }
  }

  const onDeactivate = () => {
    setActiveCoordinate(null)
  }

  const onDragOver = (event: DragOverEvent) => {
    const droppableCellData = getDroppableCellData(event.over)
    if (droppableCellData === null) {
      setActiveCoordinate(null)
      return
    }

    const currentCoordinate = getCoordinate(event.active)
    const { coordinate } = droppableCellData
    if (currentCoordinate !== coordinate && props.disabledAt(coordinate)) {
      return
    }

    setActiveCoordinate(coordinateFromNumber(coordinate))
  }

  const onDragEnd = (event: DragEndEvent) => {
    onDeactivate()

    const { id: courseId } = event.active
    if (typeof courseId === 'number') {
      return
    }

    // Update the course period.
    if (activeCoordinate === null) {
      // Dropped out of timetable.
      // Remove all coordinates in the same term.
      props.updateCoordinatesMap({
        courseId,
        method: 'clear',
      })
    }
    else {
      // Add a new coordinate.
      const newCoordinate = coordinateToNumber(activeCoordinate)

      const currentCoordinate = getCoordinate(event.active)
      if (currentCoordinate === null) {
        props.updateCoordinatesMap({
          courseId,
          method: 'add',
          at: newCoordinate
        })
      }
      else {
        props.updateCoordinatesMap({
          courseId,
          method: 'move',
          from: currentCoordinate,
          to: newCoordinate,
        })
      }
    }
  }

  useDndMonitor({
    onDragOver,
    onDragEnd,
    onDragCancel: onDeactivate,
  })

  if (activeCoordinate === null) {
    return
  }

  return (
    <div className="bg-primary/30" style={{
      gridColumnStart: activeCoordinate.column + 1,
      gridRowStart: activeCoordinate.row + 1,
    }} />
  )
}
