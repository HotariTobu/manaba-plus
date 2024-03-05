import { cn } from "@/lib/utils"
import { t } from "@/utils/i18n"
import { SortableItem } from "@/components/sortable/sortable-item"
import { Anchor } from "@/components/anchor"
import { Truncated } from "@/components/truncated"
import { type Course } from "../types/course"
import { CourseIcon } from "./course-icon"
import { CourseStar } from "./course-star"
import { CourseStatus } from "./course-status"
import { CourseLink } from "./course-link"

export const CourseHeader = () => (
  <div className="bg-primary text-primary-foreground text-center font-bold grid grid-cols-subgrid col-span-full">
    <div className="p-2">{t('home_courses_course_name')}</div>
    <div className="p-2">{t('home_courses_course_year')}</div>
    <div className="p-2">{t('home_courses_course_remarks')}</div>
    <div className="p-2">{t('home_courses_course_teachers')}</div>
  </div>
)

export const CourseRowBase = (props: {
  course: Course
  sortable: boolean
  className?: string
}) => (
  <div className={cn("grid grid-cols-subgrid col-span-full bg-white/40 transition-shadow", props.sortable && 'shadow-lg', props.className)}>
    <div className="my-1 grid-cols-[auto_2rem_minmax(6rem,_1fr)_auto_auto] grid items-center">
      <CourseStar courseId={props.course.id} />
      <CourseIcon src={props.course.icon} />
      <Anchor className="ms-1" href={props.course.url}><Truncated text={props.course.title} /></Anchor>
      <CourseLink className="ms-1" linked={props.course.linked} />
      <div className="ms-1 flex">
        <CourseStatus course={props.course} />
      </div>
    </div>
    <div className="p-1 border-primary border-s grid items-center justify-center">{props.course.year}</div>
    <div className="p-1 border-primary border-s flex items-center"><Truncated text={props.course.remarks} /></div>
    <div className="p-1 border-primary border-s flex items-center"><Truncated text={props.course.teachers} /></div>
  </div>
)

export const CourseRow = (props: {
  course: Course
  sortable: boolean
}) => (
  <SortableItem className={cn("grid grid-cols-subgrid col-span-full", props.sortable ? 'cursor-pointer' : 'even:bg-slate-700/5 cursor-auto')} item={props.course} disabled={!props.sortable}>
    <CourseRowBase course={props.course} sortable={props.sortable} />
  </SortableItem>
)
