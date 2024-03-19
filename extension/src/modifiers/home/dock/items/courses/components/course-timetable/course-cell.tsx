import { cn } from "@/lib/utils"
import { SortableItem } from "@/components/sortable/sortable-item"
import { Anchor } from "@/components/anchor"
import { Course } from "../../types/course"
import { CourseLink } from "../course-link"
import { CourseStar } from "../course-star"
import { CourseStatus } from "../course-status"
import { defineCustomDnDData } from "@/utils/defineCustomDnDData"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { MouseEvent } from "react"
import { useDndContext } from "@dnd-kit/core"
import { useSortableFocus } from "../../hooks/useSortableFocus"

interface CourseCellData {
  coordinate: number
  course: Course
}

export const [, createCourseCellData, getCourseCellData] = defineCustomDnDData<CourseCellData>()

export const CourseCellBase = (props: {
  course: Course
  sortable: boolean
  className?: string
}) => (
  <div className={cn("p-1 gap-1 bg-primary/50 min-w-20 grid grid-cols-1 grid-rows-[minmax(0,_1fr)_auto_auto] rounded-md h-full overflow-hidden transition-shadow", props.sortable && 'shadow-lg', props.className)}>
    <Anchor className="overflow-hidden" href={props.course.url}>{props.course.title}</Anchor>
    <div className="flex justify-between flex-wrap">
      <CourseLink className="my-auto overflow-hidden" linked={props.course.linked} />
      <CourseStar courseId={props.course.id} />
    </div>
    <div className="justify-end flex flex-wrap">
      <CourseStatus course={props.course} />
    </div>
  </div>
)

export const CourseCell = (props: CourseCellData & {
  column: number
  row: number
  span: number
  sortable: boolean
  canExtend: boolean
  onExtend: () => void
}) => {
  /**
   * For courses that have multiple coordinates, 1 course must have unique id for each coordinates.
   * However, to move courses between not timetable container, the id of the active item must be just the course id.
   * To achieve this, the course item ids should be dynamically changed based on the focus and active states of the items.
   */
  const { focus, setNodeRef } = useSortableFocus()
  const { active } = useDndContext()
  const courseCellData = getCourseCellData(active)

  const item = focus || props.coordinate === courseCellData?.coordinate ? props.course : {
    id: `${props.course.id}-${props.coordinate}`
  }

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    props.onExtend()
  }

  return (
    <div className={cn('relative', props.sortable ? 'cursor-grab' : 'cursor-auto')} style={{
      gridColumnStart: props.column + 1,
      gridRowStart: props.row + 1,
      gridRowEnd: `span ${props.span}`,
    }}>
      <SortableItem className="h-full" item={item} disabled={{
        draggable: !props.sortable,
        droppable: true,
      }} data={createCourseCellData(props)} ref={setNodeRef}>
        <CourseCellBase course={props.course} sortable={props.sortable} />
      </SortableItem>
      {props.canExtend && (
        <Button variant="outline" className="mx-1 opacity-0 hover:opacity-100 transition-opacity absolute inset-x-0 -translate-y-1/2" onClick={handleClick}>
          <PlusCircledIcon />
        </Button>
      )}
    </div>
  )
}

export const LostCourseCell = (props: {
  course: Course
  sortable: boolean
}) => (
  <SortableItem className={cn("w-48", props.sortable ? 'cursor-grab' : 'cursor-auto')} item={props.course} disabled={{
    draggable: !props.sortable,
    droppable: true,
  }}>
    <CourseCellBase course={props.course} sortable={props.sortable} />
  </SortableItem>
)
