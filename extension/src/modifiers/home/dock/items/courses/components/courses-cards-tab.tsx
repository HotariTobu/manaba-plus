import { type Course } from "../types/course"
import { CourseCards } from "./course-cards"

export const CoursesCardsTab = (props: {
  courses: Course[]
}) => {
  return (
    <CourseCards courses={props.courses} />
  )
}
