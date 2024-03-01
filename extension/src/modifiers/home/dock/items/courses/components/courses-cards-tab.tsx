import { type Course } from "../types/course"
import { CourseCard } from "./course-card"

export const CoursesCardsTab = (props: {
  courses: Course[]
}) => (
  <div className="gap-2 justify-evenly flex flex-wrap">
    {props.courses.map(course => (
      <CourseCard course={course} key={course.id} />
    ))}
  </div>
)
