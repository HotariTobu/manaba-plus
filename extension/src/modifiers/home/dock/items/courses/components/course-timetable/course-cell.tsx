import { cn } from "@/lib/utils"
import { SortableItem } from "@/components/sortable/sortable-item"
import { Anchor } from "@/components/anchor"
import { Course } from "../../types/course"
import { CourseLink } from "../course-link"
import { CourseStar } from "../course-star"
import { CourseStatus } from "../course-status"

export const CourseCellBase = (props: {
  course: Course
  sortable: boolean
  className?: string
}) => (
  <div className={cn("p-1 gap-1 bg-primary/50 min-w-20 grid grid-cols-1 grid-rows-[minmax(0,_1fr)_auto_auto] rounded h-full overflow-hidden transition-shadow", props.sortable && 'shadow-lg', props.className)}>
    <Anchor className="overflow-hidden" href={props.course.url}>{props.course.title}</Anchor>
    <div className="flex justify-between flex-wrap">
      <CourseLink className="my-auto overflow-hidden" linked={props.course.linked} />
      <CourseStar courseId={props.course.id} />
    </div>
    <div className="justify-end flex flex-wrap">
      <CourseStatus course={props.course} />
    </div>
  </div>
)

export const CourseCell = (props: {
  course: Course
  sortable: boolean
  column: number
  row: number
  span: number
}) => (
  <SortableItem className={cn(props.sortable ? 'cursor-pointer' : 'cursor-auto')} style={{
    gridColumnStart: props.column,
    gridRowStart: props.row,
    gridRowEnd: `span ${props.span}`,
  }} item={props.course} disabled={{
    draggable: !props.sortable,
    droppable: true,
  }}>
    <CourseCellBase course={props.course} sortable={props.sortable} />
  </SortableItem>
)
