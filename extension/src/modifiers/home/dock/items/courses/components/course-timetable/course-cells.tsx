import { useDndContext } from "@dnd-kit/core"
import { coordinateFromNumber, coordinateToNumber } from "../../types/coordinate"
import { Course } from "../../types/course"
import { CourseCell } from "./course-cell"
import { UpdateCoordinatesMap } from "../../hooks/useCoordinatesMap"

/**
 * Get a coordinate next to the specified coordinate.
 * @param coordinate The target coordinate
 * @returns A coordinate one row below the specified coordinate
 */
const getNextCoordinate = (coordinate: number) => {
  const { column, row } = coordinateFromNumber(coordinate)

  const nextCoordinate = coordinateToNumber({
    column,
    row: row + 1,
  })

  return nextCoordinate
}

/**
 * Create a map of coordinates for getting the next coordinates.
 * @param coordinateMap The map of coordinates and courses
 * @returns The map to get the next coordinate by another coordinate
 */
const getNextCoordinateMap = (coordinateMap: Map<number, Course>) => {
  const nextCoordinateMap = new Map<number, number>()

  for (const [coordinate] of coordinateMap) {
    const nextCoordinate = getNextCoordinate(coordinate)
    nextCoordinateMap.set(coordinate, nextCoordinate)
  }

  return nextCoordinateMap
}

/**
 * Create a new map of coordinates and courses.
 * Coordinates are merged into 1 item if their courses are the same and they stand in a vertical line.
 * @param coordinateMap The map of coordinates and courses
 * @param nextCoordinateMap The map of coordinates
 * @returns A merged coordinate map
 */
const mergeNextCoordinates = (coordinateMap: Map<number, Course>, nextCoordinateMap: Map<number, number>) => {
  const mergedCoordinateMap = new Map<number, [number, Course]>()

  // Sort items descending by coordinates.
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
      // Merge items.
      const span = mergedCoordinateItem[0] + 1
      mergedCoordinateMap.delete(nextCoordinate)
      mergedCoordinateMap.set(coordinate, [span, course])
    }
  }

  return mergedCoordinateMap
}

export const CourseCells = (props: {
  updateCoordinatesMap: UpdateCoordinatesMap
  coordinateMap: Map<number, Course>
  startColumn: number
  startRow: number
  sortable: boolean
}) => {
  const { active } = useDndContext()

  const nextCoordinateMap = getNextCoordinateMap(props.coordinateMap)

  if (props.sortable) {
    const notDragging = active === null

    return (
      <>
        {Array.from(props.coordinateMap).map(([coordinate, course]) => {
          const { column, row } = coordinateFromNumber(coordinate)

          const nextCoordinate = nextCoordinateMap.get(coordinate)
          if (typeof nextCoordinate === 'undefined') {
            return
          }

          const nextIsEmpty = typeof props.coordinateMap.get(nextCoordinate) === 'undefined'

          const canExtend = props.sortable && notDragging && nextIsEmpty
          const handleExtend = () => {
            props.updateCoordinatesMap({
              courseId: course.id,
              method: 'add',
              at: nextCoordinate
            })
          }

          return (
            <CourseCell column={column - props.startColumn} row={row - props.startRow} span={1} course={course} sortable={props.sortable} coordinate={coordinate} canExtend={canExtend} onExtend={handleExtend} key={coordinate} />
          )
        })}
      </>
    )
  }
  else {
    const mergedCoordinateMap = mergeNextCoordinates(props.coordinateMap, nextCoordinateMap)

    return (
      <>
        {Array.from(mergedCoordinateMap).map(([coordinate, [span, course]]) => {
          const { column, row } = coordinateFromNumber(coordinate)
          return (
            <CourseCell column={column - props.startColumn} row={row - props.startRow} span={span} course={course} sortable={props.sortable} coordinate={coordinate} canExtend={false} onExtend={() => { }} key={coordinate} />
          )
        })}
      </>
    )
  }
}
