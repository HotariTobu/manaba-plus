import { cn } from "@/lib/utils"
import { SortableItem } from "@/components/sortable/sortable-item"
import { Anchor } from "@/components/anchor"
import { Truncated } from "@/components/truncated"
import { Course } from "../../types/course"
import { CourseIcon } from "../course-icon"
import { CourseLink } from "../course-link"
import { CourseStar } from "../course-star"
import { CourseStatus } from "../course-status"

export const CourseCardBase = (props: {
  course: Course
  sortable: boolean
  className?: string
}) => (
  <div className={cn("rounded border-primary border border-s-4 grid grid-cols-[auto_minmax(9rem,_1fr)_auto] bg-white/40 transition-shadow", props.sortable && 'shadow-lg', props.className)}>
    <CourseIcon className="mx-1 my-auto min-w-[60px] row-span-2" src={props.course.icon} />
    <div className="mt-1 flex flex-col">
      <div className="h-4">{props.course.code}</div>
      <Anchor className="h-4" href={props.course.url}><Truncated text={props.course.title} /></Anchor>
      <Truncated className="h-4" text={`${props.course.year} ${props.course.remarks}`} />
      <Truncated className="h-4" text={props.course.teachers} />
    </div>
    <div>
      <CourseStar courseId={props.course.id} />
    </div>
    <div className="col-span-2 flex justify-between items-center">
      <CourseLink linked={props.course.linked} />
      <div className="flex">
        <CourseStatus course={props.course} />
      </div>
    </div>
  </div>
)

export const CourseCard = (props: {
  course: Course
  sortable: boolean
}) => (
  <SortableItem className={cn("flex-1", props.sortable ? 'cursor-pointer' : 'cursor-auto')} item={props.course} disabled={!props.sortable}>
    <CourseCardBase course={props.course} sortable={props.sortable} />
  </SortableItem>
)
