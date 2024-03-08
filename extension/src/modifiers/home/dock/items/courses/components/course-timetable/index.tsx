import { Over } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { DayOfWeek, type Course, days } from "../../types/course"
import { CourseCell } from "./course-cell"
import { dynamicStore, sessionStore, store } from "../../store"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "../zone-color"
import { SortableItem } from "@/components/sortable/sortable-item"
import { CourseTimetableHeader } from "./course-timetable-header"
import { CourseTimetableIndex } from "./course-timetable-index"
import { Period } from "../../types/period"
import { Position, getDynamicPosition, positions } from "../../types/position"
import { Coordinate, fromNumber, toNumber } from "../../types/coordinate"
import { useState } from "react"
import { getFiscalYear } from "@/modifiers/home/config"
import { ItemsMap } from "@/components/sortable/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { t } from "@/utils/i18n"

// TODO: Refactoring

/** Bounding box of courses */
interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

/** A prefix of droppable cell id */
const droppableCellId = 'timetable-droppable-cell'

interface DroppableCellData {
  [droppableCellId]: {
    gridIndex: number,
    noRow: boolean
  }
}

/** Type guard for DroppableCellSata */
export const hasDroppableCellData = (over: Over | null): over is Over & {
  data: {
    current: DroppableCellData
  }
} => {
  const data = over?.data?.current
  if (typeof data === 'undefined') {
    return false
  }
  else {
    return droppableCellId in data
  }
}

/** Droppable node for determining where a course is inserted into */
const DroppableCell = (props: {
  data: DroppableCellData
}) => {
  const item = {
    id: `${droppableCellId}-${JSON.stringify(props.data)}`,
  }

  const className = () => {
    debug: {
      return "bg-blue-200 text-xl flex justify-center items-center"
    }
  }

  return (
    <SortableItem className={cn('cursor-auto', className())} item={item} data={props.data} disabled={{
      draggable: true,
    }}>
      {props.data[droppableCellId].gridIndex}
    </SortableItem>
  )
}

type CoordinateMap = Map<number, Course>
type TermMap = Map<string, CoordinateMap>

const getTermMap = (courses: Course[]) => {
  const termMap: TermMap = new Map()

  for (const course of courses) {
    const period = dynamicStore.period.get(course.id)
    if (period === null) {
      continue
    }

    const { terms, coordinates } = period

    for (const term of terms) {
      const coordinateMap = termMap.get(term) ?? new Map<number, Course>()
      if (!termMap.has(term)) {
        termMap.set(term, coordinateMap)
      }

      for (const coordinate of coordinates) {
        const key = toNumber(coordinate)
        coordinateMap.set(key, course)
      }
    }
  }

  return termMap
}

/**
 * Get bounding box of course rects.
 *
 *
 * @returns A bounding box that contains all course rects
 */
const getBoundingBox = (coordinateMap: CoordinateMap): BoundingBox => {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (const key of coordinateMap.keys()) {
    const { row, column } = fromNumber(key)

    left = Math.min(left, column)
    top = Math.min(top, row)
    right = Math.max(right, column)
    bottom = Math.max(bottom, row)
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
 * Get grid indices indicating empty cells in the timetable.
 * @param rects The course rects
 * @param rowCount The row count to be filled
 * @returns An array of grid indices of the timetable
 */
const getEmptyGridIndices = (rects: TimetableRect[], rowCount: number) => {
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
  const emptyIndices = indices.filter(index => !skipIndexSet.has(index))
  return emptyIndices
}

export const CourseTimetable = (props: {
  coursesMap: ItemsMap<Course>
  sortable: boolean
}) => {
  const [year, setYear] = useState(getFiscalYear().toString())
  const [term, setTerm] = useState(store.term)

  const position = getDynamicPosition('main', year, term)
  const courses = props.coursesMap.get(position)

  const termMap = getTermMap(props.courses)
  const boundingBox = getBoundingBox()

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

  return (
    <div>
      <div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue placeholder={t('home_courses_course_year')} />
          </SelectTrigger>
          <SelectContent>
            {sessionStore.years.map(year => (
              <SelectItem value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={cn("gap-1 grid overflow-x-auto", props.sortable && 'pe-2 pb-2')} style={{
        gridTemplateColumns: `auto repeat(${width}, 1fr)`,
        gridTemplateRows: `auto ${'1fr '.repeat(height)} minmax(0, auto) ${'1fr '.repeat(otherRowCount)}`,
      }}>
        <CourseTimetableHeader columnCount={width} startColumn={left} />
        <CourseTimetableIndex rowCount={height} startRow={top} />

        <SortableZone className={cn("col-start-2 col-end-[-1] row-start-2 grid grid-cols-subgrid grid-rows-subgrid", props.sortable && classNames.main)} containerId='main' items={props.main} disabled={!props.sortable} style={{
          gridRowEnd: `span ${height}`
        }}>
          {props.main.map(course => (
            <CourseCell column={left} startRow={top} course={course} sortable={props.sortable} key={course.id} />
          ))}
          {mainDroppableData.map(gridIndex => (
            <DroppableCell data={{ [droppableCellId]: { gridIndex, noRow: false } }} key={gridIndex} />
          ))}
        </SortableZone>
      </div>
    </div>
  )
}
