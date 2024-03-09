import { rectSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { type Course } from "../../types/course"
import { Position } from "../../types/position"
import { CourseCard } from "./course-card"
import { classNames } from "../zone-color"
import { useBreakpoints } from "@/hooks/useBreakpoints"

export const CourseCards = (props: {
  position: Position
  courses: Course[]
  sortable: boolean
}) => {
  const [{ sm, md }, setRef] = useBreakpoints({
    sm: 500,
    md: 750,
  })

  if (props.courses.length === 0 && !props.sortable) {
    return
  }

  return (
    <SortableZone className={cn(props.sortable && classNames[props.position])} containerId={props.position} items={props.courses} disabled={!props.sortable} strategy={rectSortingStrategy} growOnly={props.sortable}>
      <div className={cn(md ? 'grid-cols-3' : sm ? 'grid-cols-2' : 'grid-cols-1', 'gap-2 grid', props.sortable && 'min-h-8')} ref={setRef}>
        {props.courses.map(course => (
          <CourseCard course={course} sortable={props.sortable} key={course.id} />
        ))}
      </div>
    </SortableZone>
  )
}
