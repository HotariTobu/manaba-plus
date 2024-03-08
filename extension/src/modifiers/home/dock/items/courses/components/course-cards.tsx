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
  <div className={cn(props.sortable && classNames[props.position])}>
    <SortableZone className="gap-2 flex flex-wrap content-start h-full" containerId={props.position} items={props.courses} disabled={!props.sortable} strategy={rectSortingStrategy} growOnly={props.sortable}>
      {props.courses.map(course => (
        <CourseCard course={course} sortable={props.sortable} key={course.id} />
      ))}
    </SortableZone>
  </div>
)
