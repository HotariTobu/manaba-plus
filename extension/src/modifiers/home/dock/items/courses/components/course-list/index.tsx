import { cn } from "@/lib/utils"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { type Course } from "../../types/course"
import { Position } from "../../types/position"
import { CourseHeader, CourseRow } from "./course-row"
import { classNames } from "../zone-color"

export const CourseList = (props: {
  position: Position
  courses: Course[]
  sortable: boolean
}) => {
  if (props.courses.length === 0 && !props.sortable) {
    return
  }

  return (
    <div className={cn("rounded-lg border-primary border overflow-hidden", props.sortable && classNames[props.position])}>
      <SortableZone className="overflow-x-auto" containerId={props.position} items={props.courses} disabled={!props.sortable} growOnlyHeight={props.sortable}>
        <div className={cn("grid-cols-[4fr_auto_minmax(4rem,_1fr)_minmax(4rem,_1fr)] grid", props.sortable && 'gap-y-2')}>
          <CourseHeader />
          {props.courses.map(course => (
            <CourseRow course={course} sortable={props.sortable} key={course.id} />
          ))}
        </div>
      </SortableZone>
    </div>
  )
}