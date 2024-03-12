import { useState } from "react"
import { Coordinate, fromNumber, toNumber } from "../../types/coordinate"
import { DragEndEvent, DragOverEvent, useDndMonitor } from "@dnd-kit/core"
import { DisabledAt, getDroppableCellData } from "./droppable-cell"
import { getCourseCellData } from "./course-cell"
import { dynamicStore } from "../../store"

export const ActiveCell = (props: {
  term: string
  disabledAt: DisabledAt
}) => {
  const [activeCoordinate, setActiveCoordinate] = useState<Coordinate | null>(null)

  const onDragOver = (event: DragOverEvent) => {
    const droppableCellData = getDroppableCellData(event.over)
    if (droppableCellData === null) {
      return
    }

    const { coordinate } = droppableCellData
    if (props.disabledAt(coordinate)) {
      return
    }

    setActiveCoordinate(fromNumber(coordinate))
  }

  const onDeactivate = () => {
    setActiveCoordinate(null)
  }

  const onDragEnd = (event: DragEndEvent) => {
    onDeactivate()

    if (activeCoordinate === null) {
      return
    }

    const newCoordinate = toNumber(activeCoordinate)

    const { id: courseId } = event.active
    if (typeof courseId === 'number') {
      return
    }

    const courseCellData = getCourseCellData(event.active)
    const currentCoordinate = courseCellData?.coordinate ?? NaN

    // Update the course period.
    const period = dynamicStore.period.get(courseId)

    // Add a new coordinate.
    const coordinates = period.get(props.term)
    if (typeof coordinates === 'undefined') {
      period.set(props.term, [newCoordinate])
    }
    else {
      // Remove the current coordinate.
      const newCoordinates = coordinates.filter(
        coordinate => coordinate !== currentCoordinate
      )
      newCoordinates.push(newCoordinate)
      period.set(props.term, newCoordinates)
    }

    dynamicStore.period.set(courseId, period)
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
    <div className=" bg-cyan-400/50" style={{
      gridColumnStart: activeCoordinate.column + 1,
      gridRowStart: activeCoordinate.row + 1,
    }} />
  )
}
