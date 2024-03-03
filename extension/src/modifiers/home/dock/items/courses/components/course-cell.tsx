import { isDummyCourse } from "../layout"
import { Course } from "../types/course"
import { CourseLink } from "./course-link"
import { CourseStar } from "./course-star"
import { CourseStatus } from "./course-status"

export const CourseCell = (props: {
  course: Course
}) => (
  <div className="rounded overflow-hidden">
    {isDummyCourse(props.course) || (
      <div className="p-1 gap-1 bg-primary/50 grid grid-cols-1 grid-rows-[minmax(0,_1fr)_auto_auto] h-full" style={{
        gridRowStart: `span ${props.course.period?.span ?? 1}`
      }}>
        <a className="overflow-hidden" href={props.course.url}>{props.course.title}</a>
        <div className="flex justify-between flex-wrap">
          <CourseLink className="my-auto overflow-hidden" linked={props.course.linked} />
          <CourseStar courseId={props.course.id} />
        </div>
        <div className="justify-end flex flex-wrap">
          <CourseStatus course={props.course} />
        </div>
      </div>
    )}
  </div>
)
