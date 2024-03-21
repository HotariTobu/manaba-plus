import { useState } from "react"
import { Coordinate, coordinateFromNumber, coordinateToNumber } from "../../types/coordinate"
import { Active, DragEndEvent, DragOverEvent, useDndMonitor } from "@dnd-kit/core"
import { DisabledAt, getDroppableCellData } from "./droppable-cell"
import { getCourseCellData } from "./course-cell"
import { UpdateCoordinatesMap } from "../../hooks/useCoordinatesMap"

/** Represent the drop area in which the dragging course item will be put */
export const ActiveCell = (props: {
  updateCoordinatesMap: UpdateCoordinatesMap
  disabledAt: DisabledAt
}) => {
  // The coordinate of the drop area
  const [activeCoordinate, setActiveCoordinate] = useState<Coordinate | null>(null)

  /**
   * Get the coordinate of the dragging course item.
   * @param active The active object in dragging events
   * @returns The course coordinate or null
   */
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
    // Dispose of the drop area when dragging is ended or canceled.
    setActiveCoordinate(null)
  }

  const onDragOver = (event: DragOverEvent) => {
    // Dispose of the drop area if the over object does not have droppable cell data.
    const droppableCellData = getDroppableCellData(event.over)
    if (droppableCellData === null) {
      setActiveCoordinate(null)
      return
    }

    // Skip if other courses have the target coordinate.
    const currentCoordinate = getCoordinate(event.active)
    const { coordinate } = droppableCellData
    if (currentCoordinate !== coordinate && props.disabledAt(coordinate)) {
      return
    }

    // Update the drop area.
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
      const newCoordinate = coordinateToNumber(activeCoordinate)

      const currentCoordinate = getCoordinate(event.active)
      if (currentCoordinate === null) {
        // Add a new coordinate.
        props.updateCoordinatesMap({
          courseId,
          method: 'add',
          at: newCoordinate
        })
      }
      else {
        // Remove the current coordinate from the list.
        // And add a new one.
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
