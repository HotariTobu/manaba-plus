import { Truncated } from "@/components/truncated"
import { Course } from "../types/course"
import { CourseLink } from "./course-link"
import { CourseStar } from "./course-star"
import { CourseStatus } from "./course-status"

export const CourseCard = (props: {
  course: Course
}) => (
  <div className="rounded border-primary border border-s-4 grid grid-cols-[auto_minmax(0,_1fr)_auto]">
    <img className="mx-1 my-auto min-w-[60px] row-span-2" src={props.course.icon} />
    <div className="mt-1 flex flex-col">
      <div className="h-4">{props.course.code}</div>
      <a className="h-4" href={props.course.url}><Truncated text={props.course.title} /></a>
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
