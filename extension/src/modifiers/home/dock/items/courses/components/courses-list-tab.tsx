import { type Course } from "../types/course"
import { CourseList } from "./course-list"

export const CoursesListTab = (props: {
  courses: Course[]
}) => (
  <CourseList courses={props.courses} />
)
