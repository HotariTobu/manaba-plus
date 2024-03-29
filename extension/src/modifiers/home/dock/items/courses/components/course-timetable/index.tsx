import { cn } from "@/lib/utils"
import { type Course, daysOfWeek } from "../../types/course"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "../zone-color"
import { CourseTimetableHeader } from "./course-timetable-header"
import { CourseTimetableIndex } from "./course-timetable-index"
import { Position } from "../../types/position"
import { CoordinatesMap, coordinateFromNumber } from "../../types/coordinate"
import { CourseCells } from "./course-cells"
import { DroppableCells } from "./droppable-cells"
import { rectSwappingStrategy } from "@dnd-kit/sortable"
import { ActiveCell } from "./active-cell"
import { LostCourseCell } from "./course-cell"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useCoordinatesMap } from "../../hooks/useCoordinatesMap"

/** Bounding box of courses */
interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Get a map of coordinates and courses.
 * @param coordinatesMap The map of course ids and coordinate lists
 * @param courses The courses
 */
const getCoordinateMap = (coordinatesMap: CoordinatesMap, courses: Course[]) => {
  const coordinateMap = new Map<number, Course>()
  const noCoordinateCourses: Course[] = []

  for (const course of courses) {
    const coordinates = coordinatesMap.get(course.id)
    if (typeof coordinates === 'undefined') {
      noCoordinateCourses.push(course)
      continue
    }

    for (const coordinate of coordinates) {
      coordinateMap.set(coordinate, course)
    }
  }

  return {
    /** A map to get courses by coordinates */
    coordinateMap,
    /** Courses that have no coordinates */
    noCoordinateCourses,
  }
}

/**
 * Get a bounding box of course coordinates.
 * If the specified map has no items, returned properties will be 0.
 * @param coordinateMap The map of coordinates and courses
 * @returns A bounding box that contains all course coordinates.
 */
const getBoundingBox = (coordinateMap: Map<number, Course>): BoundingBox => {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const key of coordinateMap.keys()) {
    const { row, column } = coordinateFromNumber(key)

    left = Math.min(left, column)
    top = Math.min(top, row)
    right = Math.max(right, column)
    bottom = Math.max(bottom, row + 1)
  }

  const width = right - left + 1
  const height = bottom - top

  if (isFinite(width) && isFinite(height)) {
    return {
      left,
      top,
      width,
      height,
    }
  }
  else {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
  }
}

export const CourseTimetable = (props: {
  yearModuleKey: string
  position: Position
  courses: Course[]
  sortable: boolean
}) => {
  const { coordinatesMap, updateCoordinatesMap } = useCoordinatesMap(props.yearModuleKey)

  const { coordinateMap, noCoordinateCourses } = getCoordinateMap(coordinatesMap, props.courses)
  const boundingBox = getBoundingBox(coordinateMap)

  // Show all columns and rows in sorting, otherwise omit empty ones.
  if (props.sortable) {
    boundingBox.height += boundingBox.top + 1
    boundingBox.left = 0
    boundingBox.top = 0
    boundingBox.width = daysOfWeek.length
  }
  else if (boundingBox.width === 0 || boundingBox.height === 0) {
    return
  }

  const { left, top, width, height } = boundingBox

  // NOTE: ScrollArea can cause ugly scrolling when sorting.
  const Container = props.sortable ? 'div' : ScrollArea

  return (
    <Container className={cn(props.sortable && "overflow-hidden")}>
      {/* <ScrollArea> */}
      <SortableZone className={cn("gap-2 flex flex-col", props.sortable && classNames[props.position])} containerId={props.position} items={props.courses} disabled={!props.sortable} growOnlyHeight={props.sortable} strategy={rectSwappingStrategy}>
        {props.sortable && (
          <div className="gap-1 mt-auto flex flex-wrap">
            {noCoordinateCourses.map(course => (
              <LostCourseCell course={course} sortable={props.sortable} key={course.id} />
            ))}
          </div>
        )}
        <div className="gap-1 grid" style={{
          gridTemplateColumns: `auto repeat(${width}, 1fr)`,
          gridTemplateRows: `auto repeat(${height}, 1fr)`,
        }}>
          <CourseTimetableHeader startColumn={left} columnCount={width} />
          <CourseTimetableIndex startRow={top} rowCount={height} />
          <div className={cn("col-start-2 col-end-[-1] row-start-2 row-end-[-1] grid grid-cols-subgrid grid-rows-subgrid")}>
            <DroppableCells rowCount={height} sortable={props.sortable} />
            <CourseCells updateCoordinatesMap={updateCoordinatesMap} coordinateMap={coordinateMap} startColumn={left} startRow={top} sortable={props.sortable} />
            <ActiveCell updateCoordinatesMap={updateCoordinatesMap} disabledAt={coordinate => coordinateMap.has(coordinate)} />
          </div>
        </div>
      </SortableZone>
      {/* <ScrollBar orientation="horizontal" />
    </ScrollArea> */}
      {props.sortable || (
        <ScrollBar orientation="horizontal" />
      )}
    </Container>
  )
}
