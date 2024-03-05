import { rectSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { type Course } from "../types/course"
import { Position } from "../types/position"
import { CourseCard } from "./course-card"
import { classNames } from "./zone-color"

export const CourseCards = (props: {
  position: Position
  courses: Course[]
  sortable: boolean
}) => (
  <SortableZone className={cn("gap-2 flex flex-wrap", props.sortable && classNames[props.position])} containerId={props.position} items={props.courses} disabled={!props.sortable} strategy={rectSortingStrategy}>
    {props.courses.map(course => (
      <CourseCard course={course} sortable={props.sortable} key={course.id} />
    ))}
  </SortableZone>
)
