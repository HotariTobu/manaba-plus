import { useDroppable } from "@dnd-kit/core"
import { t } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { DayOfWeek, type Course, days } from "../types/course"
import { CourseCell } from "./course-cell"
import { dynamicStore } from "../store"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "./zone-color"

interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

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

export const droppableCellId = 'droppable-cell'

const DroppableCell = (props: {
  num: number
}) => {
  const { setNodeRef } = useDroppable({
    id: `${droppableCellId}-${props.num}`,
  });

  return (
    <div className=" bg-blue-500" ref={setNodeRef} />
  )
}

const getBoundingBox = (courses: Course[]): BoundingBox => {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const course of courses) {
    const rect = dynamicStore.rect.get(course.id)
    if (rect === null) {
      continue
    }

    const { column, row, span } = rect

    left = Math.min(left, column)
    right = Math.max(right, column)

    if (row !== null) {
      top = Math.min(top, row)
      bottom = Math.max(bottom, row + span)
    }
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

const getMaxRowCount = (courses: Course[]) => {
  const rowCounts = days.map(_ => 0)

  for (const course of courses) {
    const rect = dynamicStore.rect.get(course.id)
    if (rect === null) {
      continue
    }

    const { column, span } = rect

    rowCounts[column] += span
  }

  return Math.max(...rowCounts)
}

export const CourseTimetable = (props: {
  main: Course[]
  other: Course[]
  sortable: boolean
}) => {
  const boundingBox = getBoundingBox(props.main.concat(props.other))

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

  const otherRowCount = getMaxRowCount(props.other) + (props.sortable ? 1 : 0)

  const mainDroppableCount = width * height + - props.main.length
  const otherDroppableCount = width * otherRowCount - props.other.length

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
        {props.sortable && [...new Array(mainDroppableCount).keys()].map(i => (
          <DroppableCell num={i} key={i} />
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
        {props.sortable && [...new Array(otherDroppableCount).keys()].map(i => (
          <DroppableCell num={i} key={i} />
        ))}
      </SortableZone>
    </div>
  )
}
