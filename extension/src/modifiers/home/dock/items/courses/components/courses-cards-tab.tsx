import { ItemsMap } from "@/components/sortable/item"
import { type Course } from "../types/course"
import { CourseCards } from "./course-cards"
import { CourseTimetable } from "./course-timetable"

export const CoursesCardsTab = (props: {
  coursesMap: ItemsMap<Course>
}) => {
  return (
    <div className="gap-2 flex flex-col">
      <CourseTimetable courses={props.coursesMap.get('main') ?? []} />
      <CourseCards courses={props.coursesMap.get('other') ?? []} />
    </div>
  )
}
