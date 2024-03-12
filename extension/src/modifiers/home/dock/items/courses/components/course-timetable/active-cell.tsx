import { useState } from "react"
import { Coordinate, fromNumber, toNumber } from "../../types/coordinate"
import { Active, DragEndEvent, DragOverEvent, useDndMonitor } from "@dnd-kit/core"
import { DisabledAt, getDroppableCellData } from "./droppable-cell"
import { getCourseCellData } from "./course-cell"
import { dynamicStore } from "../../store"

export const ActiveCell = (props: {
  term: string
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
    // console.log(event.active.data.current)
    // console.log(event.over?.data.current)
    // console.error('')
    // console.log(event.collisions)

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

    setActiveCoordinate(fromNumber(coordinate))
  }

  const onDragEnd = (event: DragEndEvent) => {
    onDeactivate()

    const { id: courseId } = event.active
    if (typeof courseId === 'number') {
      return
    }

    // Update the course period.
    const period = dynamicStore.period.get(courseId)

    if (activeCoordinate === null) {
      // Dropped out of timetable.
      // Remove all coordinates in the same term.
      period.delete(props.term)
    }
    else {
      // Add a new coordinate.
      const currentCoordinate = getCoordinate(event.active)
      const newCoordinate = toNumber(activeCoordinate)

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
    <div className="bg-primary/30" style={{
      gridColumnStart: activeCoordinate.column + 1,
      gridRowStart: activeCoordinate.row + 1,
    }} />
  )
}
