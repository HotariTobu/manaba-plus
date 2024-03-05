import { type Course } from "../types/course"
import { CourseHeader, CourseRow } from "./course-row"

export const CourseList = (props: {
  courses: Course[]
}) => (
  <div className="rounded-lg border-primary border overflow-hidden">
    <div className="grid-cols-[4fr_auto_minmax(4rem,_1fr)_minmax(4rem,_1fr)] grid overflow-x-auto">
      <CourseHeader />
      {props.courses.map(course => (
        <CourseRow course={course} key={course.id} />
      ))}
    </div>
  </div>
)
