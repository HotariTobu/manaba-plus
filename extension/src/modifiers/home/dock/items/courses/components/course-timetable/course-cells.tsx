import { useDndContext } from "@dnd-kit/core"
import { dynamicStore } from "../../store"
import { fromNumber, toNumber } from "../../types/coordinate"
import { Course } from "../../types/course"
import { CourseCell } from "./course-cell"

const getNextCoordinate = (coordinate: number) => {
  const { column, row } = fromNumber(coordinate)

  const nextCoordinate = toNumber({
    column,
    row: row + 1,
  })

  return nextCoordinate
}

const getNextCoordinateMap = (coordinateMap: Map<number, Course>) => {
  const nextCoordinateMap = new Map<number, number>()

  for (const [coordinate] of coordinateMap) {
    const nextCoordinate = getNextCoordinate(coordinate)
    nextCoordinateMap.set(coordinate, nextCoordinate)
  }

  return nextCoordinateMap
}

const mergeNextCoordinates = (coordinateMap: Map<number, Course>, nextCoordinateMap: Map<number, number>) => {
  const mergedCoordinateMap = new Map<number, [number, Course]>()

  const coordinateEntries = Array.from(coordinateMap.entries())
  coordinateEntries.sort((a, b) => b[0] - a[0])

  for (const [coordinate, course] of coordinateEntries) {
    const nextCoordinate = nextCoordinateMap.get(coordinate)
    if (typeof nextCoordinate === 'undefined') {
      continue
    }

    const mergedCoordinateItem = mergedCoordinateMap.get(nextCoordinate)
    if (typeof mergedCoordinateItem === 'undefined' || course.id !== mergedCoordinateItem[1].id) {
      mergedCoordinateMap.set(coordinate, [1, course])
    }
    else {
      const span = mergedCoordinateItem[0] + 1
      mergedCoordinateMap.delete(nextCoordinate)
      mergedCoordinateMap.set(coordinate, [span, course])
    }
  }

  return mergedCoordinateMap
}

export const CourseCells = (props: {
  term: string
  coordinateMap: Map<number, Course>
  startColumn: number
  startRow: number
  sortable: boolean
}) => {
  const nextCoordinateMap = getNextCoordinateMap(props.coordinateMap)
  const mergedCoordinateMap = mergeNextCoordinates(props.coordinateMap, nextCoordinateMap)

  const { active } = useDndContext()
  const notDragging = active === null

  if (props.sortable) {
    return (
      <>
        {Array.from(props.coordinateMap).map(([coordinate, course]) => {
          const { column, row } = fromNumber(coordinate)

          const nextCoordinate = nextCoordinateMap.get(coordinate)
          if (typeof nextCoordinate === 'undefined') {
            return
          }

          const canExtend = props.sortable && notDragging && typeof props.coordinateMap.get(nextCoordinate) === 'undefined'
          const handleExtend = () => {
            const period = dynamicStore.period.get(course.id)

            // Add a new coordinate.
            const coordinates = period.get(props.term)
            coordinates?.push(nextCoordinate)

            dynamicStore.period.set(course.id, period)
          }

          return (
            <CourseCell column={column - props.startColumn} row={row - props.startRow} span={1} course={course} sortable={props.sortable} coordinate={coordinate} canExtend={canExtend} onExtend={handleExtend} key={coordinate} />
          )
        })}
      </>
    )
  }
  else {
    return (
      <>
        {Array.from(mergedCoordinateMap).map(([coordinate, [span, course]]) => {
          const { column, row } = fromNumber(coordinate)
          return (
            <CourseCell column={column - props.startColumn} row={row - props.startRow} span={span} course={course} sortable={props.sortable} coordinate={coordinate} canExtend={false} onExtend={() => { }} key={coordinate} />
          )
        })}
      </>
    )
  }
}
