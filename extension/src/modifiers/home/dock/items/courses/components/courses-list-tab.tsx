import { ItemsMap } from "@/components/sortable/item"
import { type Course } from "../types/course"
import { CourseList } from "./course-list"
import { CourseTimetable } from "./course-timetable"

export const CoursesListTab = (props: {
  coursesMap: ItemsMap<Course>
}) => (
  <div className="gap-2 flex flex-col">
    {/* <CourseTimetable courses={props.coursesMap.get('main') ?? []} /> */}
    <CourseList courses={props.coursesMap.get('rest') ?? []} />
  </div>
)
