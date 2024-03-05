import { t } from "@/utils/i18n"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ItemsMap } from "@/components/sortable/item"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { Course } from "../types/course"
import { store } from "../store"
import { useCourses } from "../hooks/useCourses"
import { CoursesCardsTab } from "./courses-cards-tab"
import { CoursesListTab } from "./courses-list-tab"

export type CoursesMap = ItemsMap<Course>

export const CoursesContainer = () => {
  const { coursesMap, setCoursesMap } = useCourses()
  const { status, setStatus } = usePageContext()

  const longPress = useLongPress(() => {
    if (status === 'normal') {
      setStatus('editing-courses')
    }
    else if (status === 'editing-courses') {
      setStatus('normal')
    }
  }, status === 'normal')

  return (
    <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab} {...longPress}>
      <TabsList className="bg-primary">
        <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
        <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
      </TabsList>
      <TabsContent value="cards"><CoursesCardsTab coursesMap={coursesMap} /></TabsContent>
      <TabsContent value="list"><CoursesListTab coursesMap={coursesMap} /></TabsContent>
    </Tabs >
  )
}
