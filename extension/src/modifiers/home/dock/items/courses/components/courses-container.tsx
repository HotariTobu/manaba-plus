import { CollisionDetection, DragOverEvent } from "@dnd-kit/core"
import { t } from "@/utils/i18n"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CollisionDetectionArgs, DragOver, SortableContainer } from "@/components/sortable/sortable-container"
import { ItemsMap } from "@/components/sortable/item"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { Course } from "../types/course"
import { store } from "../store"
import { useCourses } from "../hooks/useCourses"
import { CoursesCardsTab } from "./courses-cards-tab"
import { CoursesListTab } from "./courses-list-tab"
import { CourseCardBase } from "./course-card"

export type CoursesMap = ItemsMap<Course>

const Overlay = (props: {
  item: Course
}) => <CourseCardBase className="shadow-xl" course={props.item} sortable />

const createCollisionDetection = (defaultHandler: CollisionDetection) => {
  return (event: CollisionDetectionArgs) => {
    console.log(event)
    return defaultHandler(event)
  }
}

const createDragOverHandler = (defaultHandler: DragOver) => {
  return (event: DragOverEvent) => {
    // console.log(event)
    defaultHandler(event)
  }
}

export const CoursesContainer = () => {
  const { coursesMap, setCoursesMap, storeCoursesMap } = useCourses()
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

  return (
    <div {...longPress}>
      <SortableContainer overlayClassName="w-80 h-fit" itemsMap={coursesMap} setItemsMap={setCoursesMap} Overlay={Overlay} onDropped={storeCoursesMap} createCollisionDetection={createCollisionDetection} createDragOverHandler={createDragOverHandler}>
        <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
          <TabsList className="bg-primary">
            <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
            <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
          </TabsList>
          <TabsContent value="cards"><CoursesCardsTab coursesMap={coursesMap} sortable={sortable} /></TabsContent>
          <TabsContent value="list"><CoursesListTab coursesMap={coursesMap} sortable={sortable} /></TabsContent>
        </Tabs >
      </SortableContainer>
    </div>
  )
}
