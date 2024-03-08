import { useDroppable } from "@dnd-kit/core"
import { t } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { DayOfWeek, type Course, days } from "../types/course"
import { TimetableRect } from "../types/timetableRect"
import { CourseCell } from "./course-cell"
import { dynamicStore } from "../store"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "./zone-color"

// TODO: Refactoring

/** Bounding box of courses */
interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

/** Header labels of the timetable */
const headers: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: t('home_courses_Monday'),
  [DayOfWeek.Tuesday]: t('home_courses_Tuesday'),
  [DayOfWeek.Wednesday]: t('home_courses_Wednesday'),
  [DayOfWeek.Thursday]: t('home_courses_Thursday'),
  [DayOfWeek.Friday]: t('home_courses_Friday'),
  [DayOfWeek.Saturday]: t('home_courses_Saturday'),
  [DayOfWeek.Sunday]: t('home_courses_Sunday'),
  [DayOfWeek.Count]: '',
}

/** A prefix of droppable cell id */
export const droppableCellId = 'droppable-cell'

/** Droppable node for determining where a course is inserted into */
const DroppableCell = (props: {
  gridIndex: number
}) => {
  const { setNodeRef } = useDroppable({
    id: `${droppableCellId}-${props.gridIndex}`,
    data: {
      [droppableCellId]: props.gridIndex
    }
  });

  return (
    <div ref={setNodeRef} className=" bg-blue-200 text-xl flex justify-center items-center" >
      {props.gridIndex}
    </div>
  )
}

/**
 * Get timetable rects of specific courses.
 * @param courses The courses
 * @returns An array of course rects
 */
const getTimetableRects = (courses: Course[]) => {
  const rects: TimetableRect[] = []

  for (const course of courses) {
    const rect = dynamicStore.rect.get(course.id)
    if (rect === null) {
      continue
    }

    rects.push(rect)
  }

  return rects
}

/**
 * Get bounding box of course rects.
 * @param rects The course rects
 * @returns A bounding box that contains all course rects
 */
const getBoundingBox = (rects: TimetableRect[]): BoundingBox => {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const rect of rects) {
    const { column, row, span } = rect

    left = Math.min(left, column)
    right = Math.max(right, column)

    if (row === null) {
      continue
    }

    top = Math.min(top, row)
    bottom = Math.max(bottom, row + span)
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

/**
 * Get the row count of other courses.
 * @param rects The other course rects
 * @returns The max row count for each column
 */
const getOtherRowCount = (rects: TimetableRect[]) => {
  const rowCounts = days.map(_ => 0)

  for (const rect of rects) {
    const { column, row, span } = rect
    if (row === null) {
      rowCounts[column] += span
    }
  }

  const maxRowCount = Math.max(...rowCounts)
  return maxRowCount
}

/**
 * Get grid indices indicating empty cells in the timetable for droppable data.
 * @param rects The course rects
 * @param rowCount The row count to be filled
 * @returns An array of grid indices of the timetable
 */
const getDroppableCellData = (rects: TimetableRect[], rowCount: number) => {
  const skipIndexSet = new Set<number>()
  const rowCounts = days.map(_ => 0)

  const preprocessRect = (rect: TimetableRect) => {
    const { column, row, span } = rect
    if (row === null) {
      const rowStart = rowCounts[column]
      rowCounts[column] += span
      return {
        column,
        row: rowStart,
        span,
      }
    }
    else {
      return {
        column,
        row,
        span,
      }
    }
  }

  for (const rect of rects) {
    const { column, row, span } = preprocessRect(rect)

    for (let offset = 0; offset < span; offset++) {
      const index = column + (row + offset) * DayOfWeek.Count
      skipIndexSet.add(index)
    }
  }

  const indices = [...new Array(rowCount * DayOfWeek.Count).keys()]
  const droppableCellData = indices.filter(index => !skipIndexSet.has(index))
  return droppableCellData
}

export const CourseTimetable = (props: {
  main: Course[]
  other: Course[]
  sortable: boolean
}) => {
  const mainRects = getTimetableRects(props.main)
  const otherRects = getTimetableRects(props.other)
  const boundingBox = getBoundingBox(mainRects.concat(otherRects))

  // Show all columns and rows in sorting, otherwise omit empty ones.
  if (props.sortable) {
    boundingBox.height += boundingBox.top + 1
    boundingBox.left = 0
    boundingBox.top = 0
    boundingBox.width = DayOfWeek.Count
  }
  else if (boundingBox.width === 0) {
    return
  }

  const { left, top, width, height } = boundingBox

  const otherRowCount = getOtherRowCount(otherRects) + (props.sortable ? 1 : 0)

  const mainDroppableData = props.sortable ? getDroppableCellData(mainRects, height) : []
  const otherDroppableData = props.sortable ? getDroppableCellData(otherRects, otherRowCount) : []

  return (
    <div className={cn("gap-1 grid overflow-x-auto", props.sortable && 'pe-2 pb-2')} style={{
      gridTemplateColumns: `auto repeat(${width}, 1fr)`,
      gridTemplateRows: `auto ${'1fr '.repeat(height)} minmax(0, auto) ${'1fr '.repeat(otherRowCount)}`,
    }}>
      <div className="col-start-2 col-end-[-1] row-start-1 row-end-2 grid grid-cols-subgrid">
        {[...Array(width).keys()].map(i => {
          const day = left + i
          return (
            <div className="p-2 text-center font-bold rounded bg-primary text-primary-foreground" key={day}>
              {headers[day as DayOfWeek]}
            </div>
          )
        })}
      </div>

      <div className="col-start-1 col-end-2 row-start-2 grid grid-rows-subgrid" style={{
        gridRowEnd: `span ${height}`
      }}>
        {[...Array(height).keys()].map(i => {
          const period = top + i + 1
          return (
            <div className="p-2 text-center flex items-center rounded bg-slate-100" key={period}>
              {period}
            </div>
          )
        })}
      </div>
      <SortableZone className={cn("col-start-2 col-end-[-1] row-start-2 grid grid-cols-subgrid grid-rows-subgrid", props.sortable && classNames.main)} containerId='main' items={props.main} disabled={!props.sortable} style={{
        gridRowEnd: `span ${height}`
      }}>
        {props.main.map(course => (
          <CourseCell startColumn={left} startRow={top} course={course} sortable={props.sortable} key={course.id} />
        ))}
        {mainDroppableData.map(gridIndex => (
          <DroppableCell gridIndex={gridIndex} key={gridIndex} />
        ))}
      </SortableZone>
      <div className={cn(props.sortable && 'h-2', " bg-red-500 col-span-full row-end-auto")} style={{
        gridRowStart: height + 2
      }} />
      <SortableZone className={cn("col-start-2 col-end-[-1] row-end-[-1] grid grid-cols-subgrid grid-rows-subgrid", props.sortable && classNames.other)} containerId='other' items={props.other} disabled={!props.sortable} style={{
        gridRowStart: height + 3
      }}>
        {props.other.map(course => (
          <CourseCell startColumn={left} startRow={top} course={course} sortable={props.sortable} key={course.id} />
        ))}
        {otherDroppableData.map(gridIndex => (
          <DroppableCell gridIndex={gridIndex} key={gridIndex} />
        ))}
      </SortableZone>
    </div>
  )
}
