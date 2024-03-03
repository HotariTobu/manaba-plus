import { cn } from "@/lib/utils"
import { useBreakpoints } from "@/hooks/useBreakpoints"
import { type Course } from "../types/course"
import { CourseCard } from "./course-card"

export const CourseCards = (props: {
  courses: Course[]
}) => {
  const [{ sm, md }, setRef] = useBreakpoints({
    sm: 500,
    md: 750,
  })
  return (
    <div className={cn(md ? 'grid-cols-3' : sm ? 'grid-cols-2' : 'grid-cols-1', 'gap-2 grid')} ref={setRef}>
      {props.courses.map(course => (
        <CourseCard course={course} key={course.id} />
      ))}
    </div>
  )
}
