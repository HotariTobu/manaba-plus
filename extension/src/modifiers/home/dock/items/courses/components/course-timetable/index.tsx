import { Over } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { DayOfWeek, type Course, days } from "../../types/course"
import { CourseCell } from "./course-cell"
import { dynamicStore } from "../../store"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { classNames } from "../zone-color"
import { SortableItem } from "@/components/sortable/sortable-item"
import { CourseTimetableHeader } from "./course-timetable-header"
import { CourseTimetableIndex } from "./course-timetable-index"
import { Period } from "../../types/period"
import { Position } from "../../types/position"
import { Coordinate, fromNumber, toNumber } from "../../types/coordinate"
import { useState } from "react"
import { getFiscalYear } from "@/modifiers/home/config"
import { ItemsMap } from "@/components/sortable/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { t } from "@/utils/i18n"
import { CourseCells } from "./course-cells"
import { DroppableCells } from "./droppable-cells"
import { rectSwappingStrategy } from "@dnd-kit/sortable"

/** Bounding box of courses */
interface BoundingBox {
  left: number
  top: number
  width: number
  height: number
}

const getCoordinateMap = (term: string, courses: Course[]) => {
  const coordinateMap: Map<number, Course> = new Map()

  for (const course of courses) {
    const period = dynamicStore.period.get(course.id)
    const coordinates = period.get(term)
    if (typeof coordinates === 'undefined') {
      continue
    }

    for (const coordinate of coordinates) {
      coordinateMap.set(coordinate, course)
    }
  }

  return coordinateMap
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
    const { row, column } = fromNumber(key)

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
  const coordinateMap = getCoordinateMap(props.term, props.courses)
  const boundingBox = getBoundingBox(coordinateMap)

  // Show all columns and rows in sorting, otherwise omit empty ones.
  if (props.sortable) {
    boundingBox.height += boundingBox.top + 1
    boundingBox.left = 0
    boundingBox.top = 0
    boundingBox.width = DayOfWeek.Count
  }
  else if (boundingBox.width === 0 || boundingBox.height === 0) {
    return
  }

  const { left, top, width, height } = boundingBox

  return (
    <div className={cn("gap-1 grid overflow-x-auto", props.sortable && 'pe-2 pb-2')} style={{
      gridTemplateColumns: `auto repeat(${width}, 1fr)`,
      gridTemplateRows: `auto repeat(${height}, 1fr`,
    }}>
      <CourseTimetableHeader startColumn={left} columnCount={width} />
      <CourseTimetableIndex startRow={top} rowCount={height} />
      <SortableZone className={cn("col-start-2 col-end-[-1] row-start-2 row-end-[-1] grid grid-cols-subgrid grid-rows-subgrid", props.sortable && classNames[props.position])} containerId={props.position} items={props.courses} disabled={!props.sortable} strategy={rectSwappingStrategy}>
        <DroppableCells term={props.term} rowCount={height} sortable={props.sortable} disabledAt={coordinate => coordinateMap.has(coordinate)} />
        <CourseCells coordinateMap={coordinateMap} startColumn={left} startRow={top} sortable={props.sortable} />
      </SortableZone>
    </div>
  )
}
