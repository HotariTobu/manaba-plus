import { t } from "@/utils/i18n"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { store } from "../store"
import { useCourses } from "../hooks/useCourses"
import { CoursesCardsTab } from "./courses-cards-tab"
import { CoursesListTab } from "./courses-list-tab"

export const CoursesContainer = () => {
  const courses = useCourses()

  return (
    <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
      <TabsList className="bg-primary">
        <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
        <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
      </TabsList>
      <TabsContent value="cards"><CoursesCardsTab courses={courses} /></TabsContent>
      <TabsContent value="list"><CoursesListTab courses={courses} /></TabsContent>
    </Tabs >
  )
}
