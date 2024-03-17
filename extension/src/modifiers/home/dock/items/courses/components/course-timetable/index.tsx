import { cn } from "@/lib/utils"
import { DayOfWeek, type Course, daysOfWeek } from "../../types/course"
import { dynamicStore } from "../../store"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "../zone-color"
import { CourseTimetableHeader } from "./course-timetable-header"
import { CourseTimetableIndex } from "./course-timetable-index"
import { Position } from "../../types/position"
import { coordinateFromNumber } from "../../types/coordinate"
import { CourseCells } from "./course-cells"
import { DroppableCells } from "./droppable-cells"
import { rectSwappingStrategy } from "@dnd-kit/sortable"
import { ActiveCell } from "./active-cell"
import { LostCourseCell } from "./course-cell"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

/** Bounding box of courses */
interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

const getCoordinateMap = (term: string, courses: Course[]) => {
  const coordinateMap = new Map<number, Course>()
  const noCoordinateCourses: Course[] = []

  for (const course of courses) {
    const period = dynamicStore.period.get(course.id)
    const coordinates = period.get(term)
    if (typeof coordinates === 'undefined') {
      noCoordinateCourses.push(course)
      continue
    }

    for (const coordinate of coordinates) {
      coordinateMap.set(coordinate, course)
    }
  }

  return {
    coordinateMap,
    noCoordinateCourses,
  }
}

/**
 * Get bounding box of course rects.
 *
 *
 * @returns A bounding box that contains all course rects
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
  term: string
  position: Position
  courses: Course[]
  sortable: boolean
}) => {
  const { coordinateMap, noCoordinateCourses } = getCoordinateMap(props.term, props.courses)
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

  // console.log(props.courses)
  // console.log([...coordinateMap.entries()])
  // console.log(noCoordinateCourses)

  return (
    <ScrollArea>
      <SortableZone className={cn("gap-2 flex flex-col", props.sortable && classNames[props.position])} containerId={props.position} items={props.courses} disabled={!props.sortable} growOnlyHeight={props.sortable} strategy={rectSwappingStrategy}>
        <div className="gap-1 grid" style={{
          gridTemplateColumns: `auto repeat(${width}, 1fr)`,
          gridTemplateRows: `auto repeat(${height}, 1fr`,
        }}>
          <CourseTimetableHeader startColumn={left} columnCount={width} />
          <CourseTimetableIndex startRow={top} rowCount={height} />
          <div className={cn("col-start-2 col-end-[-1] row-start-2 row-end-[-1] grid grid-cols-subgrid grid-rows-subgrid")}>
            <DroppableCells rowCount={height} sortable={props.sortable} />
            <CourseCells term={props.term} coordinateMap={coordinateMap} startColumn={left} startRow={top} sortable={props.sortable} />
            <ActiveCell term={props.term} disabledAt={coordinate => coordinateMap.has(coordinate)} />
          </div>
        </div>
        {props.sortable && (
          <div className="mt-auto flex">
            {noCoordinateCourses.map(course => (
              <LostCourseCell course={course} sortable={props.sortable} key={course.id} />
            ))}
          </div>
        )}
      </SortableZone>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
