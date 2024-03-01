import { type Course } from "../types/course"
import { CourseHeader, CourseRow } from "./course-row"

export const CourseList = (props: {
  courses: Course[]
}) => (
  <div className="rounded-lg border-primary border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <CourseHeader/>
        </thead>
        <tbody>
          {props.courses.map(course => (
            <CourseRow course={course} key={course.id} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
