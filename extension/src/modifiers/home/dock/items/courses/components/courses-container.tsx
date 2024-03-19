import { t } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DragOver, SortableContainer } from "@/components/sortable/sortable-container"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { Trash } from "../../../components/trash"
import { Course } from "../types/course"
import { useCourses } from "../hooks/useCourses"
import { store } from "../store"
import { CourseCardBase } from "./course-cards/course-card"
import { CourseTimetable } from "./course-timetable"
import { CourseCards } from "./course-cards"
import { CourseList } from "./course-list"
import { useRef } from "react"
import { YearTermSelect } from "./year-term-select"
import { Button } from "@/components/ui/button"
import { allCoursesPath } from "@/modifiers/home/config"
import { getCourseCellData } from "./course-timetable/course-cell"
import { hasSortableData } from "@dnd-kit/sortable"

// const createDragOverHandler = (defaultHandler: DragOver): DragOver => {
//   return event => {
//     const courseCellData = getCourseCellData(event.active)
//     if (courseCellData === null) {
//       return defaultHandler(event)
//     }

//     if (!hasSortableData(event.active)) {
//       return defaultHandler(event)
//     }

//     const { sortable } = event.active.data.current
//     sortable.index = sortable.items.indexOf(courseCellData.course.id)

//     return defaultHandler(event)
//   }
// }

const Overlay = (props: {
  item: Course
}) => <CourseCardBase className="shadow-xl w-80 h-fit absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grabbing" course={props.item} sortable />

export const CoursesContainer = () => {
  const { coursesMap, setCoursesMap, storeCoursesMap, selectProps, yearTermKey } = useCourses()

  const { status, setStatus } = usePageContext()
  const dragging = useRef(false)

  const longPress = useLongPress(() => {
    if (dragging.current) {
      return
    }

    if (status === 'normal') {
      setStatus('editing-courses')
    }
    else if (status === 'editing-courses') {
      setStatus('normal')
    }
  }, {
    stopPropagation: status === 'normal' || status === 'editing-courses',
  })

  const sortable = status === 'editing-courses'

  const timetable = coursesMap.get('timetable') ?? []
  const current = coursesMap.get('current') ?? []
  const other = coursesMap.get('other') ?? []
  const rest = coursesMap.get('rest') ?? []
  const trash = coursesMap.get('trash') ?? []

  return (
    <div className={cn(sortable ? 'gap-4' : 'gap-2', "flex flex-col")} {...longPress}>
      <YearTermSelect sortable={sortable} {...selectProps} />

      <SortableContainer itemsMap={coursesMap} setItemsMap={setCoursesMap} Overlay={Overlay} onDropped={storeCoursesMap} setIsDragging={d => dragging.current = d}>
        <CourseTimetable yearTermKey={yearTermKey} position="timetable" courses={timetable} sortable={sortable} />

        <Tabs className="contents" defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
          <TabsList className="bg-primary me-auto">
            <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
            <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
          </TabsList>

          <TabsContent className="contents" value="cards">
            <CourseCards position="current" courses={current} sortable={sortable} />
            <CourseCards position="other" courses={other} sortable={sortable} />
            <CourseCards position="rest" courses={rest} sortable={sortable} />
            <Trash visible={sortable}>
              <CourseCards position="trash" courses={trash} sortable={sortable} />
            </Trash>
          </TabsContent>

          <TabsContent className="contents" value="list">
            <CourseList position="current" courses={current} sortable={sortable} />
            <CourseList position="other" courses={other} sortable={sortable} />
            <CourseList position="rest" courses={rest} sortable={sortable} />
            <Trash visible={sortable}>
              <CourseList position="trash" courses={trash} sortable={sortable} />
            </Trash>
          </TabsContent>
        </Tabs >
      </SortableContainer>

      {location.pathname.includes(allCoursesPath) || (
        <Button className="ms-auto text-foreground" variant="link" asChild>
          <a href={allCoursesPath}>{t('home_courses_show_all_courses')}</a>
        </Button>
      )}
    </div>
  )
}
