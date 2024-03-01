import { t } from "@/utils/i18n"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { store } from "../store"
import { useCourses } from "../hooks/useCourses"
import { CoursesTimetableTab } from "./courses-timetable-tab"
import { CoursesCardsTab } from "./courses-cards-tab"
import { CoursesListTab } from "./courses-list-tab"

export const CoursesContainer = () => {
  const courses = useCourses()

  return (
    <Tabs defaultValue={store.tab} onValueChange={tab => store.tab = tab}>
      <TabsList className="bg-primary">
        <TabsTrigger value="timetable">{t('home_courses_timetable')}</TabsTrigger>
        <TabsTrigger value="cards">{t('home_courses_cards')}</TabsTrigger>
        <TabsTrigger value="list">{t('home_courses_list')}</TabsTrigger>
      </TabsList>
      <TabsContent value="timetable"><CoursesTimetableTab courses={courses} /></TabsContent>
      <TabsContent value="cards"><CoursesCardsTab courses={courses} /></TabsContent>
      <TabsContent value="list"><CoursesListTab courses={courses} /></TabsContent>
    </Tabs >
  )
}
