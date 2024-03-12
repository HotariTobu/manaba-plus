import { cn } from "@/lib/utils"
import { SortableZone } from "@/components/sortable/sortable-zone"
import { type Course } from "../../types/course"
import { Position } from "../../types/position"
import { CourseHeader, CourseRow } from "./course-row"
import { classNames } from "../zone-color"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const CourseList = (props: {
  position: Position
  courses: Course[]
  sortable: boolean
}) => {
  if (props.courses.length === 0 && !props.sortable) {
    return
  }

  return (
    <ScrollArea className={cn("rounded-md border-primary border", props.sortable && classNames[props.position])}>
      <SortableZone containerId={props.position} items={props.courses} disabled={!props.sortable} growOnlyHeight={props.sortable}>
        <div className={cn("grid-cols-[4fr_auto_minmax(4rem,_1fr)_minmax(4rem,_1fr)] grid", props.sortable && 'gap-y-2')}>
          <CourseHeader />
          {props.courses.map(course => (
            <CourseRow course={course} sortable={props.sortable} key={course.id} />
          ))}
        </div>
      </SortableZone>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
