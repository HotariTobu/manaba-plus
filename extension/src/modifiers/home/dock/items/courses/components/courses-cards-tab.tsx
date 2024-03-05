import { cn } from "@/lib/utils";
import { ItemsMap } from "@/components/sortable/item"
import { Trash } from "../../../components/trash";
import { type Course } from "../types/course"
import { CourseCards } from "./course-cards"
import { CourseTimetable } from "./course-timetable"

export const CoursesCardsTab = (props: {
  coursesMap: ItemsMap<Course>
  sortable: boolean
}) => {
  const main = props.coursesMap.get('main') ?? []
  const other = props.coursesMap.get('other') ?? []
  const rest = props.coursesMap.get('rest') ?? []
  const trash = props.coursesMap.get('trash') ?? []

  return (
    <div className={cn(props.sortable ? 'gap-4' : 'gap-2', "flex flex-col")}>
      <CourseTimetable main={main} other={other} sortable={props.sortable} />
      <CourseCards position="rest" courses={rest} sortable={props.sortable} />
      <Trash hidden={!props.sortable}>
        <CourseCards position="trash" courses={trash} sortable={props.sortable} />
      </Trash>
    </div>
  )
}
