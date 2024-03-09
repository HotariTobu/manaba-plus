import { DragOverEvent } from "@dnd-kit/core"
import { t } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DragOver, SortableContainer } from "@/components/sortable/sortable-container"
import { ItemsMap } from "@/components/sortable/item"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { Trash } from "../../../components/trash"
import { Course, DayOfWeek } from "../types/course"
import { useCourses } from "../hooks/useCourses"
import { store } from "../store"
import { CourseCardBase } from "./course-cards/course-card"
import { CourseTimetable, hasDroppableCellData } from "./course-timetable"
import { CourseCards } from "./course-cards"
import { CourseList } from "./course-list"
import { useEffect, useState } from "react"
import { getFiscalYear } from "../../../../config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Overlay = (props: {
  item: Course
}) => <CourseCardBase className="shadow-xl w-80 h-fit absolute inset-1/2 -translate-x-1/2 -translate-y-1/2" course={props.item} sortable />

const createDragOverHandler = (defaultHandler: DragOver) => {
  return (event: DragOverEvent) => {
    //   if (hasDroppableCellData(event.over)) {
    //     const { id: courseId } = event.active
    //     if (typeof courseId === 'number') {
    //       return
    //     }

    //     const { gridIndex, noRow } = event.over.data.current["timetable-droppable-cell"]
    //     const column = gridIndex % DayOfWeek.Count
    //     const row = noRow ? null : Math.floor(gridIndex / DayOfWeek.Count)

    //     const rect = dynamicStore.rect.get(courseId)
    //     const span = rect === null ? 1 : rect.span

    //     dynamicStore.rect.set(courseId, {
    //       column,
    //       row,
    //       span,
    //     })
    //   }

    defaultHandler(event)
  }
}

export const CoursesContainer = () => {
  const { coursesMap, setCoursesMap, storeCoursesMap, year, setYear, term, setTerm } = useCourses()
  const { status, setStatus } = usePageContext()

  const longPress = useLongPress(() => {
    if (status === 'normal') {
      setStatus('editing-courses')
    }
    else if (status === 'editing-courses') {
      setStatus('normal')
    }
  }, {
    stopPropagation: status === 'normal',
  })

  const sortable = status === 'editing-courses'

  const timetable = coursesMap.get('timetable') ?? []
  const current = coursesMap.get('current') ?? []
  const other = coursesMap.get('other') ?? []
  const rest = coursesMap.get('rest') ?? []
  const trash = coursesMap.get('trash') ?? []

  return (
    <div {...longPress}>
      <div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue placeholder={t('home_courses_course_year')} />
          </SelectTrigger>
          <SelectContent>
            {Array.from(store.years).map(year => (
              <SelectItem value={year} key={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {Array.from(store.terms).map(term => (
          <div key={term}>{term}</div>
        ))}
      </div>
      <SortableContainer itemsMap={coursesMap} setItemsMap={setCoursesMap} Overlay={Overlay} onDropped={storeCoursesMap} createDragOverHandler={createDragOverHandler}>
        <CourseTimetable term={term} position="timetable" courses={timetable} sortable={sortable} />

        <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
          <TabsList className="bg-primary">
            <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
            <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
          </TabsList>

          <div className={cn(sortable ? 'gap-4' : 'gap-2', "flex flex-col")}>
            <TabsContent value="cards">
              <CourseCards position="current" courses={current} sortable={sortable} />
              <CourseCards position="other" courses={other} sortable={sortable} />
              <CourseCards position="rest" courses={rest} sortable={sortable} />
              <Trash hidden={!sortable}>
                <CourseCards position="trash" courses={trash} sortable={sortable} />
              </Trash>
            </TabsContent>
            <TabsContent value="list">
              <CourseList position="current" courses={current} sortable={sortable} />
              <CourseList position="other" courses={other} sortable={sortable} />
              <CourseList position="rest" courses={rest} sortable={sortable} />
              <Trash hidden={!sortable}>
                <CourseList position="trash" courses={trash} sortable={sortable} />
              </Trash>
            </TabsContent>
          </div>
        </Tabs >
      </SortableContainer>
    </div>
  )
}
